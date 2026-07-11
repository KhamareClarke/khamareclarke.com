/**
 * Generate a plain-English monthly client report for a given project.
 * Pulls: GHL data (if available), recent empire_tasks for the project,
 * recent lead volume from empire_leads. Sends to the LLM used by Empire
 * (OpenRouter first, ZeroClaw fallback — same behaviour as runTaskWithZeroClaw).
 *
 * Stored on client_projects.{last_report_text,last_report_at} for retrieval
 * by the admin dashboard + the client portal.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { getClientGHLData } from '@/lib/ghl';
import { runTaskWithZeroClaw } from '@/lib/empire-run-zeroclaw';

function daysAgoIso(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function loadContext({ clientId, projectId }) {
  if (!supabaseAdmin) throw new Error('SUPABASE_SERVICE_ROLE_KEY required');

  const [{ data: project }, { data: profile }] = await Promise.all([
    supabaseAdmin.from('client_projects').select('*').eq('id', projectId).maybeSingle(),
    supabaseAdmin.from('profiles').select('*').eq('id', clientId).maybeSingle(),
  ]);
  if (!project) throw new Error('project not found');
  if (project.client_id !== clientId) throw new Error('project does not belong to client');

  const thirtyDaysAgo = daysAgoIso(30);

  const [tasksRes, leadsRes] = await Promise.all([
    supabaseAdmin
      .from('empire_tasks')
      .select('id, agent_id, task_description, status, result_message, assigned_at, completed_at')
      .gte('assigned_at', thirtyDaysAgo)
      .order('assigned_at', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('empire_leads')
      .select('id, source, created_at')
      .gte('created_at', thirtyDaysAgo),
  ]);
  const tasks = tasksRes.data || [];
  const leadsCount = (leadsRes.data || []).length;

  let ghl = null;
  if (project.ghl_contact_id) {
    try {
      ghl = await getClientGHLData(project.ghl_contact_id);
    } catch {
      ghl = null;
    }
  }

  return { project, profile, tasks, leadsCount, ghl };
}

function buildReportPrompt(ctx) {
  const { project, profile, tasks, leadsCount, ghl } = ctx;
  const displayName = profile?.full_name || 'the client';
  const company = profile?.company || '';
  const tasksSummary = tasks.length
    ? tasks
        .slice(0, 10)
        .map((t) => `- [${t.status}] ${t.agent_id}: ${String(t.task_description).slice(0, 160)}`)
        .join('\n')
    : '- No agent tasks executed in the last 30 days.';

  const stage = ghl?.opportunities?.[0]?.pipelineStageName || ghl?.opportunities?.[0]?.stage;
  const nextAppt = ghl?.appointments?.[0];
  const ghlBlock = ghl
    ? [
        `- Pipeline stage: ${stage || 'unknown'}`,
        `- Opportunities: ${ghl.opportunities?.length ?? 0}`,
        `- Next appointment: ${
          nextAppt
            ? new Date(nextAppt.startTime || nextAppt.start_time).toLocaleString()
            : 'none scheduled'
        }`,
      ].join('\n')
    : '- GHL data not available (no ghl_contact_id or GHL_API_KEY unset).';

  return [
    `Write a plain-English monthly progress report for ${displayName}${company ? ` at ${company}` : ''}.`,
    `Project: ${project.project_name} (status: ${project.status}${project.tier ? `, tier ${project.tier}` : ''}).`,
    '',
    'Recent work (last 30 days):',
    tasksSummary,
    '',
    `New leads captured in the last 30 days: ${leadsCount}.`,
    '',
    'GoHighLevel snapshot:',
    ghlBlock,
    '',
    'Write 4–6 short paragraphs, no headings, no bullet points, no markdown.',
    'Speak directly to the client ("this month we…"). Cover: what was delivered,',
    'what the numbers look like, what the next steps are. Be honest about anything',
    'that was paused or failed. Keep the tone confident and calm.',
  ].join('\n');
}

/**
 * Generate + persist a client monthly report.
 * Returns { text, at }.
 */
export async function generateClientReport({ clientId, projectId }) {
  const ctx = await loadContext({ clientId, projectId });
  const prompt = buildReportPrompt(ctx);

  // Reuse runTaskWithZeroClaw as our LLM entry point. Pass a "client-report" agent id
  // so downstream logs make sense. The function ignores unknown agent ids gracefully.
  const text = await runTaskWithZeroClaw(
    ctx.project.id, // used as project label
    'client-report',
    prompt,
    { timeoutMs: 90_000 }
  );

  const now = new Date().toISOString();
  await supabaseAdmin
    .from('client_projects')
    .update({ last_report_text: text, last_report_at: now, updated_at: now })
    .eq('id', projectId);

  return { text, at: now };
}
