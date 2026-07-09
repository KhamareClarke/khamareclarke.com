import { requireAuth } from '@/lib/api-guard';
import { buildJarvisContext } from '@/lib/jarvis/context';
import { verifyJarvisKpiAlignment } from '@/lib/jarvis/kpi';

export const dynamic = 'force-dynamic';

/** GET /api/jarvis/verify — admin KPI alignment check for Phase E exam. */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const ctx = await buildJarvisContext();
    const result = await verifyJarvisKpiAlignment(ctx.snapshot);
    return Response.json({ ok: result.ok, checks: result.checks });
  } catch (err) {
    console.error('[jarvis/verify]', err);
    return Response.json({ ok: false, error: 'Verification unavailable, sir.' }, { status: 500 });
  }
}
