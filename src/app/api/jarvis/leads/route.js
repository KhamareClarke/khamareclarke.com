import { requireAuth } from '@/lib/api-guard';
import { getLeadsCountForDays } from '@/lib/jarvis/kpi';

export const dynamic = 'force-dynamic';

/** GET /api/jarvis/leads?days=7 — admin lead count for N days. */
export async function GET(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  const days = Math.min(Math.max(parseInt(new URL(req.url).searchParams.get('days') || '1', 10) || 1, 1), 90);
  const breakdown = await getLeadsCountForDays(days);
  if (breakdown === null) {
    return Response.json({ ok: false, error: 'Lead count unavailable, sir.' }, { status: 503 });
  }
  return Response.json({
    ok: true,
    days,
    count: breakdown.count,
    forms: breakdown.forms,
    onboard: breakdown.onboard,
  });
}
