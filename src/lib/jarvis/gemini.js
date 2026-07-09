const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash-lite';
const FALLBACK_MODELS = ['gemini-2.0-flash-lite', 'gemini-1.5-flash-8b', 'gemini-1.5-flash'];
const TIMEOUT_MS = 25_000;

function getApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '').trim();
}

function getModel() {
  return (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();
}

function modelsToTry() {
  return [...new Set([getModel(), ...FALLBACK_MODELS])];
}

function isQuotaError(err) {
  const em = err?.message || '';
  return em.includes('429') || em.includes('quota') || em.includes('RESOURCE_EXHAUSTED');
}

function buildPayload(systemPrompt, messages) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  return {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
  };
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
  if (em.includes('404') || em.includes('not found')) {
    return 'Gemini model unavailable, sir. Set GEMINI_MODEL=gemini-1.5-flash in Vercel and redeploy.';
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

  for (const model of models) {
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
        if (isQuotaError(err) && model !== models[models.length - 1]) {
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
      if (isQuotaError(err) && model !== models[models.length - 1]) {
        lastError = err;
        continue;
      }
      return { ok: false, error: err.message, model };
    }
  }
  return { ok: false, error: lastError?.message || 'All models quota exhausted', model: models[0] };
}

/**
 * Non-streaming completion — reliable fallback when SSE fails.
 */
export async function generateGeminiCompletion(systemPrompt, messages) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_NOT_CONFIGURED');

  const models = modelsToTry();
  let lastError;

  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(geminiUrl(model, false), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(systemPrompt, messages)),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        const err = new Error(`Gemini ${res.status}: ${errText.slice(0, 300)}`);
        if (isQuotaError(err) && model !== models[models.length - 1]) {
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
      if (isQuotaError(err) && model !== models[models.length - 1]) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error('Gemini quota exhausted on all models');
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
export async function streamGeminiCompletion(systemPrompt, messages) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_NOT_CONFIGURED');

  const models = modelsToTry();
  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(geminiUrl(model, true), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload(systemPrompt, messages)),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          const err = new Error(`Gemini ${res.status}: ${errText.slice(0, 300)}`);
          if (isQuotaError(err)) {
            lastError = err;
            break; // try next model
          }
          throw err;
        }
        if (!res.body) throw new Error('No response body from Gemini');
        return res.body;
      } catch (err) {
        clearTimeout(timer);
        if (isQuotaError(err)) {
          lastError = err;
          break;
        }
        lastError = err;
        if (attempt === 0) continue;
      }
    }
  }

  // Fallback: single request, stream full text to client
  try {
    const text = await generateGeminiCompletion(systemPrompt, messages);
    return textToTokenStream(text);
  } catch (fallbackErr) {
    const mapped = mapGeminiError(fallbackErr) || mapGeminiError(lastError);
    if (mapped) throw new Error(mapped);
    throw lastError || fallbackErr;
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
        controller.error(err);
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
