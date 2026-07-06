/**
 * Empire run-task API — run a single task. Some agents perform real actions (e.g. SEO audit); others use OpenRouter/ZeroClaw.
 */
import { createClient } from '@supabase/supabase-js';
import { executeOneTask } from '@/lib/empire-execute-one-task';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req) {
  try {
    const body = await req.json();
    const taskId = body?.taskId;
    const contextFromPreviousAgent = typeof body?.contextFromPreviousAgent === 'string' ? body.contextFromPreviousAgent : '';
    if (!taskId) {
      return Response.json({ error: 'taskId required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data: task, error: fetchErr } = await supabase
      .from('empire_tasks')
      .select('id, project_id, agent_id, task_description, status')
      .eq('id', taskId)
      .single();

    if (fetchErr || !task) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    if (task.status !== 'pending') {
      return Response.json({ error: `Task already ${task.status}` }, { status: 400 });
    }

    const { status, resultMessage } = await executeOneTask(supabase, task, { contextFromPreviousAgent });

    if (status === 'failed') {
      return Response.json({ ok: false, error: resultMessage, status: 'failed' }, { status: 200 });
    }
    return Response.json({ ok: true, status: 'done', resultMessage: resultMessage?.slice(0, 500) });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Run task failed' },
      { status: 500 }
    );
  }
}
