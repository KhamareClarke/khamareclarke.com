/**
 * GET /api/empire/task-status?id=<uuid>
 * Admin-only single task status for JARVIS outcome polling.
 */
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  const id = new URL(req.url).searchParams.get('id')?.trim();
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('empire_tasks')
    .select('id, status, result_message, task_description, agent_id, project_id')
    .eq('id', id)
    .single();

  if (error || !data) return Response.json({ error: 'Task not found' }, { status: 404 });
  return Response.json({ ok: true, task: data });
}
