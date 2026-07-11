/**
 * GET /api/empire/activity/list
 * Returns recent end-user events for the Empire dashboard.
 *
 * Query: ?projectId=&eventType=&limit=&since=ISO
 * Uses the service role so anon RLS doesn't restrict.
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
  const projectId = searchParams.get('projectId')?.trim().toLowerCase() || null;
  const eventType = searchParams.get('eventType')?.trim().toLowerCase() || null;
  const since = searchParams.get('since')?.trim() || null;
  const rawLimit = Number.parseInt(searchParams.get('limit') || '100', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 100;

  let query = supabaseAdmin
    .from('empire_user_activity')
    .select(
      'id, project_id, event_type, status, user_email, user_id, user_name, source, ip, user_agent, message, metadata, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (projectId) query = query.eq('project_id', projectId);
  if (eventType) query = query.eq('event_type', eventType);
  if (since) query = query.gte('created_at', since);

  const { data, error } = await query;
  if (error) {
    return Response.json({ ok: false, events: [], error: error.message }, { status: 200 });
  }

  // Quick aggregate counts for the last 24h.
  const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: counts } = await supabaseAdmin
    .from('empire_user_activity')
    .select('project_id, event_type, status, created_at')
    .gte('created_at', since24)
    .limit(2000);

  const summary = { total24h: 0, byProject: {}, byEvent: {}, failed24h: 0 };
  for (const row of counts || []) {
    summary.total24h += 1;
    summary.byProject[row.project_id] = (summary.byProject[row.project_id] || 0) + 1;
    summary.byEvent[row.event_type] = (summary.byEvent[row.event_type] || 0) + 1;
    if (row.status === 'failed') summary.failed24h += 1;
  }

  return Response.json({ ok: true, events: data || [], summary });
}
