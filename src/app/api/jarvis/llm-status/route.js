import { requireAuth } from '@/lib/api-guard';
import { getJarvisLlmProvider } from '@/lib/jarvis/llm';
import { isGeminiConfigured, pingGemini, getModel } from '@/lib/jarvis/gemini';
import { isOpenRouterConfigured } from '@/lib/jarvis/openrouter';

export const dynamic = 'force-dynamic';

/** GET /api/jarvis/llm-status — tests Gemini key against live API. */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const provider = getJarvisLlmProvider();
  let geminiTest = null;
  if (isGeminiConfigured()) {
    geminiTest = await pingGemini();
  }

  const ready = provider === 'gemini' ? geminiTest?.ok === true : !!provider;

  return Response.json({
    ok: true,
    provider,
    gemini: isGeminiConfigured(),
    openrouter: isOpenRouterConfigured(),
    model: provider === 'gemini' ? getModel() : null,
    ready,
    geminiTest,
    hint: !ready
      ? geminiTest?.error ||
        'Set GEMINI_API_KEY from aistudio.google.com (starts with AIzaSy), then redeploy.'
      : null,
  });
}
