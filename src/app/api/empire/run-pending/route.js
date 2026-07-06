/**
 * Empire run-pending — run all pending tasks (optionally for one project), with optional handoff (pass each result to next agent in same project).
 * POST body: { projectId?: string, limit?: number, handoff?: boolean }
 */
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { executeOneTask } from '@/lib/empire-execute-one-task';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function loadTeamsConfig() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'teams.json');
    const raw = fs.readFileSync(configPath, 'utf8');
    const data = JSON.parse(raw);
    return data.empire_config || data;
  } catch (_) {
    return { teams: {}, domains: [] };
  }
}

/** Return skill order for a team (index of agent_id in that team's skills). */
function getSkillOrder(config) {
  const order = {};
  for (const [teamId, team] of Object.entries(config.teams || {})) {
    (team.skills || []).forEach((skillId, i) => {
      order[skillId] = order[skillId] ?? i;
    });
  }
  return order;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const projectId = body?.projectId || null;
    const limit = Math.min(Number(body?.limit) || 50, 50);
    const handoff = Boolean(body?.handoff);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    let query = supabase
      .from('empire_tasks')
      .select('id, project_id, agent_id, task_description')
      .eq('status', 'pending')
      .order('id', { ascending: true })
      .limit(limit);

    if (projectId) query = query.eq('project_id', projectId);
    const { data: pending, error: fetchError } = await query;

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 });
    }
    if (!pending || pending.length === 0) {
      return Response.json({ ok: true, run: 0, done: 0, failed: 0, message: 'No pending tasks' });
    }

    let previousResult = '';
    let previousProject = '';
    const config = loadTeamsConfig();
    const skillOrder = getSkillOrder(config);
    const sorted = handoff
      ? [...pending].sort((a, b) => {
          const orderA = skillOrder[a.agent_id] ?? 999;
          const orderB = skillOrder[b.agent_id] ?? 999;
          if (a.project_id !== b.project_id) return a.project_id.localeCompare(b.project_id);
          return orderA - orderB;
        })
      : pending;

    let done = 0;
    let failed = 0;
    for (const task of sorted) {
      const context = handoff && task.project_id === previousProject ? previousResult : '';
      const { status, resultMessage } = await executeOneTask(supabase, task, { contextFromPreviousAgent: context });
      if (status === 'done') {
        done++;
        previousResult = resultMessage || '';
        previousProject = task.project_id;
      } else {
        failed++;
        previousResult = '';
        previousProject = '';
      }
    }

    return Response.json({
      ok: true,
      run: sorted.length,
      done,
      failed,
      message: `Ran ${sorted.length} pending task(s): ${done} done, ${failed} failed`,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Run pending failed' },
      { status: 500 }
    );
  }
}
