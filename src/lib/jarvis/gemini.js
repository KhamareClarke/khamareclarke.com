const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];
/** Shut down 2026-06-01 — skip even if still set in GEMINI_MODEL env. */
const DEPRECATED_MODELS = new Set([
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-001',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-1.5-flash-8b',
]);
const TIMEOUT_MS = 25_000;

function getApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '').trim();
}

function getModel() {
  return (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();
}

function isDeprecatedModel(model) {
  if (DEPRECATED_MODELS.has(model)) return true;
  return /^gemini-2\.0-/i.test(model);
}

function modelsToTry() {
  const configured = getModel();
  const candidates = [
    ...(isDeprecatedModel(configured) ? [] : [configured]),
    ...FALLBACK_MODELS,
  ];
  return [...new Set(candidates)];
}

function isQuotaError(err) {
  const em = err?.message || '';
  return em.includes('429') || em.includes('quota') || em.includes('RESOURCE_EXHAUSTED');
}

function isModelUnavailableError(err) {
  const em = err?.message || '';
  return em.includes('404') || em.includes('not found') || em.includes('is not found') || em.includes('NOT_FOUND');
}

function shouldTryNextModel(err, modelIndex, modelCount) {
  if (modelIndex >= modelCount - 1) return false;
  return isQuotaError(err) || isModelUnavailableError(err);
}

function throwGeminiExhausted(...errors) {
  const last = errors.find(Boolean);
  const mapped = errors.map(mapGeminiError).find(Boolean);
  if (mapped) throw new Error(mapped);
  throw last || new Error('Gemini request failed on all models');
}

function buildPayload(systemPrompt, messages, { useGoogleSearch = false } = {}) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
  };

  if (useGoogleSearch) {
    payload.tools = [{ google_search: {} }];
  }

  return payload;
}

function geminiUrl(model, stream) {
  const apiKey = getApiKey();
  const action = stream ? 'streamGenerateContent' : 'generateContent';
  const params = new URLSearchParams({ key: apiKey });
  if (stream) params.set('alt', 'sse');
  return `${GEMINI_BASE}/models/${model}:${action}?${params.toString()}`;
}

function mapGeminiError(err) {
  const em = err?.message || '';
  if (em.includes('401') || em.includes('403') || em.includes('API key not valid')) {
    return 'Gemini credentials rejected, sir. Create a new key at aistudio.google.com — it must start with AIzaSy.';
  }
  if (em.includes('404') || em.includes('not found') || em.includes('is not found')) {
    return 'Gemini model unavailable, sir. Remove GEMINI_MODEL from Vercel (uses gemini-2.5-flash) or set GEMINI_MODEL=gemini-2.5-flash.';
  }
  if (em.includes('429') || em.includes('quota') || em.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini quota reached for today, sir. Try again later or use a different key.';
  }
  return null;
}

/** Quick ping — verifies key + model work (admin diagnostic). */
export async function pingGemini() {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, error: 'GEMINI_API_KEY not set' };
  if (!apiKey.startsWith('AIza')) {
    return {
      ok: false,
      error: 'Key format invalid — Gemini keys start with AIzaSy. Get one at aistudio.google.com/apikey',
    };
  }

  const models = modelsToTry();
  let lastError;

  for (let i = 0; i < models.length; i += 1) {
    const model = models[i];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(geminiUrl(model, false), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Reply with exactly: ok' }] }],
          generationConfig: { maxOutputTokens: 8 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        const err = new Error(`Gemini ${res.status}: ${t.slice(0, 180)}`);
        if (shouldTryNextModel(err, i, models.length)) {
          lastError = err;
          continue;
        }
        return { ok: false, error: `Gemini ${res.status}: ${t.slice(0, 180)}`, model };
      }
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { ok: true, model, sample: text.slice(0, 20) };
    } catch (err) {
      clearTimeout(timer);
      if (shouldTryNextModel(err, i, models.length)) {
        lastError = err;
        continue;
      }
      return { ok: false, error: err.message, model };
    }
  }
  const mapped = mapGeminiError(lastError);
  return {
    ok: false,
    error: mapped || lastError?.message || 'All models failed',
    model: models[0],
  };
}

/**
 * Non-streaming completion — reliable fallback when SSE fails.
 */
export async function generateGeminiCompletion(systemPrompt, messages, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_NOT_CONFIGURED');

  const models = modelsToTry();
  let lastError;

  for (let i = 0; i < models.length; i += 1) {
    const model = models[i];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(geminiUrl(model, false), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(systemPrompt, messages, options)),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        const err = new Error(`Gemini ${res.status}: ${errText.slice(0, 300)}`);
        if (shouldTryNextModel(err, i, models.length)) {
          lastError = err;
          continue;
        }
        throw err;
      }
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini returned empty response');
      return text;
    } catch (err) {
      clearTimeout(timer);
      if (shouldTryNextModel(err, i, models.length)) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throwGeminiExhausted(lastError);
}

/** Fake SSE stream from complete text (fallback). */
export function textToTokenStream(text) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

/**
 * Stream chat from Google Gemini.
 */
export async function streamGeminiCompletion(systemPrompt, messages, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_NOT_CONFIGURED');

  const models = modelsToTry();
  let lastError;

  for (let i = 0; i < models.length; i += 1) {
    const model = models[i];
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(geminiUrl(model, true), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload(systemPrompt, messages, options)),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          const err = new Error(`Gemini ${res.status}: ${errText.slice(0, 300)}`);
          if (shouldTryNextModel(err, i, models.length)) {
            lastError = err;
            break;
          }
          throw err;
        }
        if (!res.body) throw new Error('No response body from Gemini');
        return res.body;
      } catch (err) {
        clearTimeout(timer);
        if (shouldTryNextModel(err, i, models.length)) {
          lastError = err;
          break;
        }
        lastError = err;
        if (attempt === 0) continue;
        break;
      }
    }
  }

  // Fallback: single request, stream full text to client
  try {
    const text = await generateGeminiCompletion(systemPrompt, messages, options);
    return textToTokenStream(text);
  } catch (fallbackErr) {
    throwGeminiExhausted(fallbackErr, lastError);
  }
}

function extractGeminiToken(json) {
  return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/** Transform Gemini SSE into simplified token events. Handles multi-line JSON chunks. */
export function transformGeminiStream(upstream) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  let lastText = '';

  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE events separated by blank lines
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() || '';

          for (const event of events) {
            const dataLines = event
              .split(/\r?\n/)
              .filter((l) => l.startsWith('data:'))
              .map((l) => l.slice(5).trim());
            const payload = dataLines.join('\n').trim();
            if (!payload || payload === '[DONE]') continue;

            try {
              const json = JSON.parse(payload);
              const chunk = extractGeminiToken(json);
              if (!chunk) continue;
              // Gemini SSE often sends cumulative text — emit only the delta
              let delta = chunk;
              if (chunk.startsWith(lastText)) {
                delta = chunk.slice(lastText.length);
                lastText = chunk;
              } else {
                lastText += chunk;
              }
              if (delta) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ token: delta })}\n\n`)
                );
              }
            } catch {
              // try line-by-line JSON
              for (const line of event.split(/\r?\n/)) {
                const t = line.trim();
                if (!t || t.startsWith(':')) continue;
                const raw = t.startsWith('data:') ? t.slice(5).trim() : t;
                try {
                  const json = JSON.parse(raw);
                  const chunk = extractGeminiToken(json);
                  if (chunk) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ token: chunk })}\n\n`)
                    );
                  }
                } catch {
                  // skip
                }
              }
            }
          }
        }

        // Flush remaining buffer
        if (buffer.trim()) {
          try {
            const raw = buffer.replace(/^data:\s*/m, '').trim();
            const json = JSON.parse(raw);
            const chunk = extractGeminiToken(json);
            if (chunk && chunk !== lastText) {
              const delta = chunk.startsWith(lastText) ? chunk.slice(lastText.length) : chunk;
              if (delta) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ token: delta })}\n\n`)
                );
              }
            }
          } catch {
            // ignore
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const mapped = mapGeminiError(err);
        const msg = mapped || `Stream error, sir. ${String(err?.message || '').slice(0, 120)}`;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: msg })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } finally {
        reader.releaseLock();
      }
    },
  });
}

export function isGeminiConfigured() {
  return !!getApiKey();
}

export { mapGeminiError, getModel };
