import { streamGeminiCompletion, transformGeminiStream, isGeminiConfigured } from '@/lib/jarvis/gemini';
import { streamOpenRouterCompletion, transformOpenRouterStream, isOpenRouterConfigured } from '@/lib/jarvis/openrouter';
import { formatSearchResultsForPrompt, messageNeedsWebSearch, searchWeb } from '@/lib/jarvis/web-search';

/**
 * Pick LLM provider: Gemini (free tier) first, then OpenRouter.
 */
export function getJarvisLlmProvider() {
  if (isGeminiConfigured()) return 'gemini';
  if (isOpenRouterConfigured()) return 'openrouter';
  return null;
}

async function enrichPromptWithWebSearch(systemPrompt, messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content;
  if (!lastUser || !messageNeedsWebSearch(lastUser)) return systemPrompt;
  try {
    const { results } = await searchWeb(lastUser);
    if (!results?.length) return systemPrompt;
    return `${systemPrompt}\n\nLive web search results (use for factual answers):\n${formatSearchResultsForPrompt(results)}`;
  } catch {
    return systemPrompt;
  }
}

export async function streamJarvisCompletion(systemPrompt, messages, options = {}) {
  const provider = getJarvisLlmProvider();
  const useGoogleSearch = options.useGoogleSearch !== false;
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

  if (provider === 'gemini') {
    let prompt = systemPrompt;
    if (useGoogleSearch && messageNeedsWebSearch(lastUser)) {
      prompt = await enrichPromptWithWebSearch(systemPrompt, messages);
    }
    return {
      provider,
      body: await streamGeminiCompletion(prompt, messages, { useGoogleSearch: false }),
    };
  }
  if (provider === 'openrouter') {
    let prompt = systemPrompt;
    if (useGoogleSearch) {
      prompt = await enrichPromptWithWebSearch(systemPrompt, messages);
    }
    return { provider, body: await streamOpenRouterCompletion(prompt, messages) };
  }
  throw new Error('LLM_NOT_CONFIGURED');
}

export function transformJarvisStream(upstream, provider) {
  if (provider === 'gemini') return transformGeminiStream(upstream);
  return transformOpenRouterStream(upstream);
}
