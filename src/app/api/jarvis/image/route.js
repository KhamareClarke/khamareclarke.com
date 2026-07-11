import { requireAuth } from '@/lib/api-guard';
import { generateJarvisImage } from '@/lib/jarvis/image';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const prompt = String(body.prompt || '').trim().slice(0, 1000);
    if (!prompt) {
      return Response.json({ error: 'prompt is required' }, { status: 400 });
    }

    const { dataUrl, model } = await generateJarvisImage(prompt);
    return Response.json({ ok: true, prompt, dataUrl, model });
  } catch (err) {
    console.error('[jarvis/image]', err);
    return Response.json(
      { error: err?.message || 'Image generation failed' },
      { status: 500 }
    );
  }
}
