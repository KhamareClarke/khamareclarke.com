import { requireAuth } from '@/lib/api-guard';
import { getJarvisLlmProvider } from '@/lib/jarvis/llm';
import { isGeminiConfigured, pingGemini, getModel as getGeminiModel } from '@/lib/jarvis/gemini';
import { isOpenRouterConfigured } from '@/lib/jarvis/openrouter';

export const dynamic = 'force-dynamic';

/** GET /api/jarvis/llm-status — reports active JARVIS LLM provider. */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const provider = getJarvisLlmProvider();
  let geminiTest = null;
  if (isGeminiConfigured()) {
    geminiTest = await pingGemini();
  }

  const ready =
    provider === 'openrouter'
      ? isOpenRouterConfigured()
      : provider === 'gemini'
        ? geminiTest?.ok === true
        : false;

  return Response.json({
    ok: true,
    provider,
    openrouter: isOpenRouterConfigured(),
    gemini: isGeminiConfigured(),
    model: provider === 'gemini' ? getGeminiModel() : process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    ready,
    geminiTest,
    hint: !ready
      ? provider === 'openrouter'
        ? 'Set OPENROUTER_API_KEY in Vercel, then redeploy.'
        : geminiTest?.error ||
          'Set OPENROUTER_API_KEY (recommended) or GEMINI_API_KEY in Vercel, then redeploy.'
      : null,
  });
}
