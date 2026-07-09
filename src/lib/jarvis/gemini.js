const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash';
const TIMEOUT_MS = 15_000;

function getApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
}

function getModel() {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

/**
 * Stream chat from Google Gemini (free tier friendly).
 */
export async function streamGeminiCompletion(systemPrompt, messages) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_NOT_CONFIGURED');

  const model = getModel();
  const url = `${GEMINI_BASE}/models/${model}:streamGenerateContent?alt=sse`;

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 1024, temperature: 0.4 },
  };

  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
      }
      if (!res.body) throw new Error('No response body from Gemini');
      return res.body;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt === 0) continue;
    }
  }
  throw lastError || new Error('Gemini request failed');
}

/** Transform Gemini SSE into simplified token events for the client. */
export function transformGeminiStream(upstream) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n');
          buffer = parts.pop() || '';
          for (const line of parts) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const token = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (token) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
                );
              }
            } catch {
              // skip malformed chunks
            }
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
