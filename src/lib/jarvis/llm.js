import { generateGeminiCompletion, streamGeminiCompletion, transformGeminiStream, isGeminiConfigured } from '@/lib/jarvis/gemini';
import {
  generateOpenRouterCompletion,
  streamOpenRouterCompletion,
  transformOpenRouterStream,
  isOpenRouterConfigured,
} from '@/lib/jarvis/openrouter';
import { formatSearchResultsForPrompt, messageNeedsWebSearch, searchWeb } from '@/lib/jarvis/web-search';

/**
 * Pick LLM provider. OpenRouter preferred when configured (set JARVIS_LLM_PROVIDER=gemini to force Gemini).
 */
export function getJarvisLlmProvider() {
  const pref = (process.env.JARVIS_LLM_PROVIDER || '').trim().toLowerCase();
  const hasOpenRouter = isOpenRouterConfigured();
  const hasGemini = isGeminiConfigured();

  if (pref === 'gemini' && hasGemini) return 'gemini';
  if (pref === 'openrouter' && hasOpenRouter) return 'openrouter';
  if (hasOpenRouter) return 'openrouter';
  if (hasGemini) return 'gemini';
  return null;
}

async function enrichPromptWithWebSearch(systemPrompt, messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content;
  if (!lastUser || !messageNeedsWebSearch(lastUser)) return systemPrompt;
  try {
    const { results } = await searchWeb(lastUser);
    if (!results?.length) return systemPrompt;
    return `${systemPrompt}\n\nLive web search results (answer from these — do NOT say you lack real-time access):\n${formatSearchResultsForPrompt(results)}`;
  } catch {
    return systemPrompt;
  }
}

export async function streamJarvisCompletion(systemPrompt, messages, options = {}) {
  const provider = getJarvisLlmProvider();
  const useGoogleSearch = options.useGoogleSearch !== false;
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

  if (provider === 'openrouter') {
    let prompt = systemPrompt;
    if (useGoogleSearch) {
      prompt = await enrichPromptWithWebSearch(systemPrompt, messages);
    }
    return { provider, body: await streamOpenRouterCompletion(prompt, messages) };
  }
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
  throw new Error('LLM_NOT_CONFIGURED');
}

export async function generateJarvisCompletion(systemPrompt, messages) {
  const provider = getJarvisLlmProvider();
  if (provider === 'openrouter') {
    return generateOpenRouterCompletion(systemPrompt, messages);
  }
  if (provider === 'gemini') {
    return generateGeminiCompletion(systemPrompt, messages, { useGoogleSearch: false });
  }
  throw new Error('LLM_NOT_CONFIGURED');
}

export function transformJarvisStream(upstream, provider) {
  if (provider === 'gemini') return transformGeminiStream(upstream);
  return transformOpenRouterStream(upstream);
}
