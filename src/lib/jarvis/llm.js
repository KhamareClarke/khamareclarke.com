import { streamGeminiCompletion, transformGeminiStream, isGeminiConfigured } from '@/lib/jarvis/gemini';
import { streamOpenRouterCompletion, transformOpenRouterStream, isOpenRouterConfigured } from '@/lib/jarvis/openrouter';

/**
 * Pick LLM provider: Gemini (free tier) first, then OpenRouter.
 */
export function getJarvisLlmProvider() {
  if (isGeminiConfigured()) return 'gemini';
  if (isOpenRouterConfigured()) return 'openrouter';
  return null;
}

export async function streamJarvisCompletion(systemPrompt, messages) {
  const provider = getJarvisLlmProvider();
  if (provider === 'gemini') {
    return { provider, body: await streamGeminiCompletion(systemPrompt, messages) };
  }
  if (provider === 'openrouter') {
    return { provider, body: await streamOpenRouterCompletion(systemPrompt, messages) };
  }
  throw new Error('LLM_NOT_CONFIGURED');
}

export function transformJarvisStream(upstream, provider) {
  if (provider === 'gemini') return transformGeminiStream(upstream);
  return transformOpenRouterStream(upstream);
}
