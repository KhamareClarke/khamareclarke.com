/**
 * GET /api/empire/leads/logs
 * Returns background logs (leads_cron + outreach_sent) from empire_supervisor_log using service role,
 * so the dashboard always sees the same entries the API writes.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!supabaseAdmin) {
    return Response.json({ ok: false, logs: [], error: 'Supabase not configured' }, { status: 500 });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('empire_supervisor_log')
      .select('id, message, project_id, task_type, created_at')
      .in('task_type', ['leads_cron', 'outreach_sent'])
      .order('created_at', { ascending: false })
      .limit(150);

    if (error) {
      return Response.json({ ok: false, logs: [], error: error.message }, { status: 200 });
    }
    const logs = (data || []).map((row) => ({ ...row, findings: row.findings ?? null }));
    return Response.json({ ok: true, logs });
  } catch (e) {
    return Response.json({ ok: false, logs: [], error: e?.message || 'Failed to fetch logs' }, { status: 500 });
  }
}
