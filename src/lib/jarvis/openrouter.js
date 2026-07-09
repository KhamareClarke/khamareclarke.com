const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';
const TIMEOUT_MS = 15_000;

function referer() {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (url) return url.startsWith('http') ? url : `https://${url}`;
  return 'https://khamareclarke.com';
}

/**
 * Stream chat completion from OpenRouter. One retry on failure/timeout.
 * Returns upstream Response body stream or throws.
 */
export async function streamJarvisCompletion(systemPrompt, messages) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_NOT_CONFIGURED');
  }

  const model = process.env.OPENROUTER_MODEL || process.env.EMPIRE_LLM_MODEL || DEFAULT_MODEL;
  const payload = {
    model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    max_tokens: 1024,
  };

  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': referer(),
          'X-Title': 'Khamare Clarke JARVIS',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`OpenRouter ${res.status}: ${errText.slice(0, 200)}`);
      }
      if (!res.body) throw new Error('No response body from OpenRouter');
      return res.body;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt === 0) continue;
    }
  }
  throw lastError || new Error('OpenRouter request failed');
}

/**
 * Transform OpenRouter SSE into simplified token events for the client.
 */
export function transformOpenRouterStream(upstream) {
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
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              continue;
            }
            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
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
