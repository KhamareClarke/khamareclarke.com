import { isGeminiConfigured } from '@/lib/jarvis/gemini';
import { isOpenRouterConfigured } from '@/lib/jarvis/openrouter';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const IMAGE_TIMEOUT_MS = 55_000;

/** OpenRouter image models — Gemini Nano Banana + Flux fallbacks. */
const OPENROUTER_IMAGE_MODELS = [
  { model: 'google/gemini-2.5-flash-image', modalities: ['image', 'text'] },
  { model: 'google/gemini-2.5-flash-image-preview', modalities: ['image', 'text'] },
  { model: 'google/gemini-3.1-flash-image', modalities: ['image', 'text'] },
  { model: 'google/gemini-3.1-flash-image-preview', modalities: ['image', 'text'] },
  { model: 'black-forest-labs/flux.2-flex', modalities: ['image'] },
  { model: 'black-forest-labs/flux.2-pro', modalities: ['image'] },
];

/** Direct Gemini API — Nano Banana only (no Imagen; Imagen requires paid Google plan). */
const GEMINI_NATIVE_IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image'];

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

function openRouterImageModelConfigs() {
  const preferred = process.env.OPENROUTER_IMAGE_MODEL?.trim();
  if (!preferred) return OPENROUTER_IMAGE_MODELS;
  const match = OPENROUTER_IMAGE_MODELS.find((m) => m.model === preferred);
  const entry = match || { model: preferred, modalities: ['image', 'text'] };
  return [entry, ...OPENROUTER_IMAGE_MODELS.filter((m) => m.model !== preferred)];
}

function fetchWithTimeout(url, options, timeoutMs = IMAGE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function findDataUrlInValue(value, depth = 0) {
  if (depth > 14 || value == null) return null;
  if (typeof value === 'string') {
    const match = value.match(/data:image\/[a-z0-9+.-]+;base64,[A-Za-z0-9+/=]+/i);
    return match ? match[0] : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDataUrlInValue(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value)) {
      const found = findDataUrlInValue(v, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function extractImageFromOpenRouterResponse(json) {
  const message = json?.choices?.[0]?.message;
  if (!message) return null;

  const images = message.images;
  if (Array.isArray(images)) {
    for (const img of images) {
      const url = img?.image_url?.url || img?.imageUrl?.url || img?.url;
      if (url && String(url).startsWith('data:')) return String(url);
    }
  }

  const content = message.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part?.type === 'image_url' || part?.type === 'image') {
        const url = part?.image_url?.url || part?.imageUrl?.url;
        if (url?.startsWith('data:')) return url;
      }
      const inline = part?.inline_data || part?.inlineData;
      if (inline?.data) {
        const mime = inline.mime_type || inline.mimeType || 'image/png';
        return `data:${mime};base64,${inline.data}`;
      }
    }
  }

  if (typeof content === 'string') {
    const fromText = findDataUrlInValue(content);
    if (fromText) return fromText;
  }

  return findDataUrlInValue(message) || findDataUrlInValue(json);
}

function formatImagePrompt(prompt) {
  const text = String(prompt || '').trim();
  if (/^(generate|draw|create|make)\b/i.test(text)) return text;
  return `Generate a high-quality image: ${text}`;
}

async function generateWithOpenRouter(prompt) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) throw new Error('OPENROUTER_NOT_CONFIGURED');

  const imagePrompt = formatImagePrompt(prompt);
  const errors = [];

  for (const { model, modalities } of openRouterImageModelConfigs()) {
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
          messages: [{ role: 'user', content: imagePrompt }],
          modalities,
          stream: false,
          max_tokens: 4096,
        }),
      });

      const raw = await res.text().catch(() => '');
      if (!res.ok) {
        throw new Error(`${model} ${res.status}: ${raw.slice(0, 220)}`);
      }

      let json;
      try {
        json = JSON.parse(raw);
      } catch {
        throw new Error(`${model}: invalid JSON response`);
      }

      const dataUrl = extractImageFromOpenRouterResponse(json);
      if (!dataUrl) {
        const hint = json?.choices?.[0]?.message?.content;
        const preview =
          typeof hint === 'string' ? hint.slice(0, 120) : 'no image field in response';
        throw new Error(`${model}: no image returned (${preview})`);
      }

      return { dataUrl, model };
    } catch (err) {
      errors.push(err?.message || String(err));
      console.warn('[jarvis/image] OpenRouter', model, err?.message || err);
    }
  }

  throw new Error(errors[0] || 'OpenRouter image generation failed');
}

async function generateWithGeminiNative(model, prompt, apiKey) {
  const imagePrompt = formatImagePrompt(prompt);
  const res = await fetchWithTimeout(
    `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
    }
  );

  const raw = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`${model} ${res.status}: ${raw.slice(0, 220)}`);
  }

  const json = JSON.parse(raw);
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

/** Generate an image from a text prompt (OpenRouter first, then Gemini Nano Banana). */
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
        console.warn('[jarvis/image] Gemini', model, err?.message || err);
      }
    }
  }

  if (!isOpenRouterConfigured() && !isGeminiConfigured()) {
    throw new Error(
      'Set OPENROUTER_API_KEY for image generation (recommended), sir. Add credits at openrouter.ai if models return payment errors.'
    );
  }

  const detail = errors.slice(0, 2).join(' · ').slice(0, 360);
  throw new Error(
    detail ||
      'Image generation unavailable. Ensure OPENROUTER_API_KEY has credits and supports image models, sir.'
  );
}
