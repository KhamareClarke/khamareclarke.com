import { requireAuth } from '@/lib/api-guard';
import { buildJarvisContext } from '@/lib/jarvis/context';

export const dynamic = 'force-dynamic';

/** KPI snapshot for boot toast — admin only. */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const ctx = await buildJarvisContext();
    return Response.json({
      ok: true,
      ...ctx.snapshot,
      clients: ctx.clients,
      projects: ctx.projects,
      activity: ctx.activity,
      tasksRecent: ctx.tasksRecent,
      fleet: ctx.fleet,
      fleetEvents: ctx.fleetEvents,
      recentLeads: ctx.recentLeads,
      leadsHistory: ctx.leadsHistory,
    });
  } catch (err) {
    console.error('[jarvis/snapshot]', err);
    return Response.json({ ok: false, error: 'Snapshot unavailable' }, { status: 500 });
  }
}
