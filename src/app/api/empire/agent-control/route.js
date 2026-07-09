/**
 * POST /api/empire/agent-control
 * Admin-only pause/resume registry for Empire agents (logged to supervisor feed).
 * Body: { agent_id: string, action: 'pause' | 'resume' }
 */
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const agentId = String(body.agent_id || body.agentId || '').trim();
    const action = String(body.action || '').trim().toLowerCase();
    if (!agentId) return Response.json({ error: 'agent_id required' }, { status: 400 });
    if (action !== 'pause' && action !== 'resume') {
      return Response.json({ error: 'action must be pause or resume' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const message =
      action === 'pause'
        ? `JARVIS: Agent "${agentId}" paused by operator`
        : `JARVIS: Agent "${agentId}" resumed by operator`;

    const { data: logRow, error } = await supabase
      .from('empire_supervisor_log')
      .insert({
        message,
        project_id: 'khamareclarke',
        team_id: agentId,
        task_type: `agent-${action}`,
      })
      .select('id')
      .single();

    if (error) throw error;

    return Response.json({ ok: true, action, agent_id: agentId, logId: logRow?.id });
  } catch (err) {
    return Response.json({ error: err?.message || 'Agent control failed' }, { status: 500 });
  }
}
