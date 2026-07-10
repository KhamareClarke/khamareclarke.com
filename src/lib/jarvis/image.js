import { isGeminiConfigured } from '@/lib/jarvis/gemini';
import { isOpenRouterConfigured } from '@/lib/jarvis/openrouter';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const IMAGE_TIMEOUT_MS = 55_000;

const OPENROUTER_IMAGE_MODELS = [
  'google/gemini-2.5-flash-image',
  'google/gemini-3.1-flash-image',
  'google/gemini-3.1-flash-image-preview',
];

const GEMINI_NATIVE_IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image'];

const IMAGEN_MODELS = ['imagen-4.0-generate-001', 'imagen-4.0-fast-generate-001'];

function getGeminiApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '').trim();
}

function getOpenRouterApiKey() {
  return process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY;
}

function referer() {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (url) return url.startsWith('http') ? url : `https://${url}`;
  return 'https://khamareclarke.com';
}

function openRouterImageModels() {
  const preferred = process.env.OPENROUTER_IMAGE_MODEL?.trim();
  return preferred ? [preferred, ...OPENROUTER_IMAGE_MODELS.filter((m) => m !== preferred)] : OPENROUTER_IMAGE_MODELS;
}

function fetchWithTimeout(url, options, timeoutMs = IMAGE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function extractImageFromOpenRouterMessage(message) {
  const images = message?.images;
  if (Array.isArray(images)) {
    for (const img of images) {
      const url = img?.image_url?.url || img?.imageUrl?.url;
      if (url && String(url).startsWith('data:')) return String(url);
    }
  }

  const content = message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      const url = part?.image_url?.url || part?.imageUrl?.url;
      if (url && String(url).startsWith('data:')) return String(url);
    }
  }

  if (typeof content === 'string') {
    const dataMatch = content.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+/);
    if (dataMatch) return dataMatch[0];
  }

  return null;
}

async function generateWithOpenRouter(prompt) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) throw new Error('OPENROUTER_NOT_CONFIGURED');

  let lastError;
  for (const model of openRouterImageModels()) {
    try {
      const res = await fetchWithTimeout(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': referer(),
          'X-Title': 'Khamare Clarke JARVIS',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          modalities: ['image', 'text'],
          stream: false,
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(`${model} ${res.status}: ${t.slice(0, 200)}`);
      }

      const json = await res.json();
      const dataUrl = extractImageFromOpenRouterMessage(json.choices?.[0]?.message);
      if (!dataUrl) throw new Error(`${model}: no image in response`);
      return { dataUrl, model };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('OpenRouter image generation failed');
}

async function generateWithGeminiNative(model, prompt, apiKey) {
  const res = await fetchWithTimeout(
    `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
    }
  );

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
  throw new Error(`${model}: no image in Gemini response`);
}

async function generateWithImagen(model, prompt, apiKey) {
  const res = await fetchWithTimeout(`${GEMINI_BASE}/models/${model}:predict?key=${apiKey}`, {
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
  if (!b64) throw new Error(`${model}: no image bytes in response`);
  return { dataUrl: `data:image/png;base64,${b64}`, model };
}

/** Generate an image from a text prompt (OpenRouter Nano Banana / Gemini Imagen). */
export async function generateJarvisImage(prompt) {
  const text = String(prompt || '').trim();
  if (!text) throw new Error('Image prompt is empty');

  const errors = [];

  if (isOpenRouterConfigured()) {
    try {
      return await generateWithOpenRouter(text);
    } catch (err) {
      errors.push(err?.message || String(err));
    }
  }

  if (isGeminiConfigured()) {
    const apiKey = getGeminiApiKey();
    for (const model of GEMINI_NATIVE_IMAGE_MODELS) {
      try {
        return await generateWithGeminiNative(model, text, apiKey);
      } catch (err) {
        errors.push(err?.message || String(err));
      }
    }
    for (const model of IMAGEN_MODELS) {
      try {
        return await generateWithImagen(model, text, apiKey);
      } catch (err) {
        errors.push(err?.message || String(err));
      }
    }
  }

  if (!isOpenRouterConfigured() && !isGeminiConfigured()) {
    throw new Error('Set OPENROUTER_API_KEY or GEMINI_API_KEY for image generation, sir.');
  }

  const detail = errors.length ? errors[errors.length - 1].slice(0, 280) : 'All image models failed';
  throw new Error(`Image generation failed, sir. ${detail}`);
}
