import { requireAuth } from '@/lib/api-guard';
import { runPageSpeedAudit } from '@/lib/jarvis/pagespeed';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  let url, strategy;
  try {
    ({ url, strategy } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!url?.trim()) {
    return Response.json({ error: 'url is required' }, { status: 400 });
  }

  // Normalise: add https:// if no protocol supplied.
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  const data = await runPageSpeedAudit(targetUrl, strategy === 'desktop' ? 'desktop' : 'mobile');
  if (!data) {
    return Response.json({ error: 'PageSpeed audit failed or API key not configured.' }, { status: 502 });
  }

  return Response.json(data);
}
