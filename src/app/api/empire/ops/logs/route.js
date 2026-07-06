/**
 * GET /api/empire/ops/logs
 * Returns empire_supervisor_log rows for the dashboard "Bugs & broken links" section:
 * - task_type = 'ops_cron' (dedicated Ops cron), and
 * - task_type = 'auto_24h' with message containing "Ops (Maintenance)" for myapproved.
 */
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function getClient() {
  if (supabaseAdmin) return supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) return createClient(url, key, { auth: { persistSession: false } });
  return null;
}

export async function GET() {
  const client = getClient();
  if (!client) {
    return Response.json({ ok: false, logs: [], error: 'Supabase not configured' }, { status: 200 });
  }
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  try {
    const [opsRes, autoRes] = await Promise.all([
      client
        .from('empire_supervisor_log')
        .select('id, message, project_id, task_type, created_at')
        .eq('task_type', 'ops_cron')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(100),
      client
        .from('empire_supervisor_log')
        .select('id, message, project_id, task_type, created_at')
        .eq('task_type', 'auto_24h')
        .ilike('message', '%Ops (Maintenance)%')
        .eq('project_id', 'myapproved')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(100),
    ]);

    const opsLogs = opsRes.data || [];
    const autoLogs = autoRes.data || [];
    const merged = [...opsLogs, ...autoLogs]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 100);

    return Response.json({ ok: true, logs: merged });
  } catch (e) {
    return Response.json({ ok: false, logs: [], error: e?.message || 'Failed to fetch logs' }, { status: 200 });
  }
}
