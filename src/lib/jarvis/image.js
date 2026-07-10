import { isGeminiConfigured } from '@/lib/jarvis/gemini';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const IMAGE_MODELS = [
  'imagen-3.0-generate-002',
  'imagen-3.0-fast-generate-001',
  'gemini-2.0-flash-preview-image-generation',
];

function getApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '').trim();
}

async function generateWithImagen(model, prompt, apiKey) {
  const res = await fetch(`${GEMINI_BASE}/models/${model}:predict?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`${model} ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const b64 =
    json.predictions?.[0]?.bytesBase64Encoded ||
    json.predictions?.[0]?.image?.bytesBase64Encoded;
  if (!b64) throw new Error('No image bytes in response');
  return { dataUrl: `data:image/png;base64,${b64}`, model };
}

async function generateWithGeminiImage(model, prompt, apiKey) {
  const res = await fetch(`${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`${model} ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    if (inline?.data) {
      const mime = inline.mimeType || inline.mime_type || 'image/png';
      return { dataUrl: `data:${mime};base64,${inline.data}`, model };
    }
  }
  throw new Error('No image in Gemini response');
}

/** Generate an image from a text prompt (Gemini Imagen / image models). */
export async function generateJarvisImage(prompt) {
  const text = String(prompt || '').trim();
  if (!text) throw new Error('Image prompt is empty');
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY required for image generation, sir.');
  }
  const apiKey = getApiKey();
  let lastError;
  for (const model of IMAGE_MODELS) {
    try {
      if (model.startsWith('imagen')) {
        return await generateWithImagen(model, text, apiKey);
      }
      return await generateWithGeminiImage(model, text, apiKey);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Image generation unavailable on all models, sir.');
}
