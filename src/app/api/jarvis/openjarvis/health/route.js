import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

function openJarvisBase() {
  return (process.env.OPENJARVIS_URL || process.env.NEXT_PUBLIC_OPENJARVIS_URL || 'http://127.0.0.1:8000').replace(
    /\/$/,
    ''
  );
}

/** Admin-only health check for OpenJarvis backend. */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const base = openJarvisBase();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const headers = {};
    const apiKey = process.env.OPENJARVIS_API_KEY;
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const res = await fetch(`${base}/health`, {
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);

    if (!res.ok) {
      return Response.json({ ok: false, base, status: res.status }, { status: 200 });
    }

    let body = null;
    try {
      body = await res.json();
    } catch {
      body = { raw: 'ok' };
    }

    return Response.json({ ok: true, base, health: body });
  } catch (err) {
    clearTimeout(timer);
    return Response.json({ ok: false, base, error: err.message || 'unreachable' }, { status: 200 });
  }
}
