/**
 * POST /api/empire/assign-task
 * Admin-only. Inserts a pending empire_tasks row.
 * Body: { project_id, agent_id, task_description }
 */
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const projectId = String(body.project_id || body.projectId || '').trim();
    const agentId = String(body.agent_id || body.agentId || '').trim();
    const taskDescription = String(body.task_description || body.taskDescription || '').trim();
    if (!projectId || !agentId || !taskDescription) {
      return Response.json({ error: 'project_id, agent_id, task_description required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('empire_tasks')
      .insert({
        project_id: projectId,
        agent_id: agentId,
        task_description: taskDescription,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;
    return Response.json({ ok: true, taskId: data.id });
  } catch (err) {
    return Response.json({ error: err?.message || 'Assign failed' }, { status: 500 });
  }
}
