import { requireAuth } from '@/lib/api-guard';
import { getJarvisLlmProvider } from '@/lib/jarvis/llm';
import { isGeminiConfigured } from '@/lib/jarvis/gemini';
import { isOpenRouterConfigured } from '@/lib/jarvis/openrouter';

export const dynamic = 'force-dynamic';

/** GET /api/jarvis/llm-status — which LLM provider is configured (no secrets). */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const provider = getJarvisLlmProvider();
  return Response.json({
    ok: true,
    provider,
    gemini: isGeminiConfigured(),
    openrouter: isOpenRouterConfigured(),
    ready: !!provider,
    hint: !provider
      ? 'Set GEMINI_API_KEY (aistudio.google.com — key starts with AIzaSy) or OPENROUTER_API_KEY in Vercel, then redeploy.'
      : null,
  });
}
