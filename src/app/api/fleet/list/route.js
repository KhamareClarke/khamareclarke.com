/**
 * GET /api/fleet/list
 * Recent cross-project fleet events for JARVIS + health checks.
 *
 * Query: ?project=&eventType=&limit=&since=ISO
 */
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!supabaseAdmin) {
    return Response.json({ ok: false, events: [], error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const project = searchParams.get('project')?.trim().toLowerCase() || null;
  const eventType = searchParams.get('eventType')?.trim().toLowerCase() || null;
  const since = searchParams.get('since')?.trim() || null;
  const rawLimit = Number.parseInt(searchParams.get('limit') || '20', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 20;

  let query = supabaseAdmin
    .from('fleet_events')
    .select('id, project, event_type, summary, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (project) query = query.eq('project', project);
  if (eventType) query = query.eq('event_type', eventType);
  if (since) query = query.gte('created_at', since);

  const { data, error } = await query;
  if (error) {
    return Response.json({ ok: false, events: [], error: error.message }, { status: 200 });
  }

  const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: counts } = await supabaseAdmin
    .from('fleet_events')
    .select('project, event_type, created_at')
    .gte('created_at', since24)
    .limit(2000);

  const summary = { total24h: 0, byProject: {}, byEvent: {} };
  for (const row of counts || []) {
    summary.total24h += 1;
    summary.byProject[row.project] = (summary.byProject[row.project] || 0) + 1;
    summary.byEvent[row.event_type] = (summary.byEvent[row.event_type] || 0) + 1;
  }

  return Response.json({ ok: true, events: data || [], summary });
}
