/**
 * Execute a single Empire task (fetch, run agent, update DB). Used by run-task API and run-pending.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{ id: string, project_id: string, agent_id: string, task_description: string }} task
 * @param {{ contextFromPreviousAgent?: string }} options
 * @returns {Promise<{ status: 'done' | 'failed', resultMessage: string }>}
 */
export async function executeOneTask(supabase, task, options = {}) {
  const taskId = task.id;
  const contextFromPreviousAgent = options.contextFromPreviousAgent || '';

  const now = new Date().toISOString();
  await supabase
    .from('empire_tasks')
    .update({ status: 'running', started_at: now })
    .eq('id', taskId);

  let activityId = null;
  const { data: act } = await supabase
    .from('empire_agent_activity')
    .insert({
      project_id: task.project_id,
      agent_id: task.agent_id,
      status: 'running',
      started_at: now,
    })
    .select('id')
    .single();
  if (act) activityId = act.id;

  const { runTaskWithZeroClaw } = await import('@/lib/empire-run-zeroclaw');
  const { runSeoAudit } = await import('@/lib/empire-run-seo-audit');

  let resultMessage = '';
  let status = 'done';
  try {
    if (task.agent_id === 'seo-audit') {
      resultMessage = await runSeoAudit(task.project_id);
    } else if (task.agent_id === 'client-report') {
      // Jarvis client-portal skill: task_description is expected to be
      // JSON `{"client_id":"...","project_id":"..."}`. Generates a monthly
      // report and stores it on client_projects.
      const { generateClientReport } = await import('@/lib/empire-client-report');
      let parsed;
      try {
        parsed = JSON.parse(task.task_description);
      } catch {
        throw new Error(
          'client-report task_description must be JSON: {"client_id":"...","project_id":"..."}'
        );
      }
      const { text } = await generateClientReport({
        clientId: parsed.client_id,
        projectId: parsed.project_id,
      });
      resultMessage = text;
    } else {
      resultMessage = await runTaskWithZeroClaw(
        task.project_id,
        task.agent_id,
        task.task_description,
        { timeoutMs: 100_000, contextFromPreviousAgent }
      );
    }
  } catch (err) {
    status = 'failed';
    resultMessage = err?.message || String(err);
    if (activityId) {
      await supabase
        .from('empire_agent_activity')
        .update({ status: 'failed', error_message: resultMessage })
        .eq('id', activityId);
    }
    await supabase
      .from('empire_tasks')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        result_message: resultMessage,
      })
      .eq('id', taskId);
    return { status: 'failed', resultMessage };
  }

  const completedAt = new Date().toISOString();
  if (activityId) {
    await supabase.from('empire_agent_activity').update({ status: 'done' }).eq('id', activityId);
  }
  await supabase
    .from('empire_tasks')
    .update({
      status: 'done',
      completed_at: completedAt,
      result_message: resultMessage?.slice(0, 10000) || '',
    })
    .eq('id', taskId);

  return { status: 'done', resultMessage };
}
