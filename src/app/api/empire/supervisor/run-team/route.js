/**
 * Empire supervisor run-team — create pending tasks for every skill in a team (e.g. SALES_TEAM for myapproved).
 * Writes one line to empire_supervisor_log for the live activity feed.
 * Call from dashboard "Run Sales" / "Run Growth" etc., or from scripts/supervisor.js.
 */
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function loadTeamsConfig() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'teams.json');
    const raw = fs.readFileSync(configPath, 'utf8');
    const data = JSON.parse(raw);
    return data.empire_config || data;
  } catch (e) {
    return { teams: {}, domains: [] };
  }
}

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { projectId, teamId, taskDescription, skills: skillsOverride } = body || {};
    if (!projectId || !teamId) {
      return Response.json({ error: 'projectId and teamId required' }, { status: 400 });
    }

    const config = loadTeamsConfig();
    const team = config.teams?.[teamId];
    const skills = Array.isArray(skillsOverride) && skillsOverride.length > 0
      ? skillsOverride
      : (team?.skills || []);

    if (skills.length === 0) {
      return Response.json({ error: `Team ${teamId} has no skills defined` }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const description = (taskDescription || '').trim() || `Run ${teamId} for ${projectId}`;
    const taskIds = [];

    for (const agentId of skills) {
      const { data: row, error } = await supabase
        .from('empire_tasks')
        .insert({
          project_id: projectId,
          agent_id: agentId,
          task_description: description,
          status: 'pending',
        })
        .select('id')
        .single();
      if (!error && row) taskIds.push(row.id);
    }

    const message = `Supervisor: Delegating ${teamId} (${skills.length} agents) for ${projectId} — ${description.slice(0, 60)}${description.length > 60 ? '…' : ''}`;
    const { data: logRow } = await supabase
      .from('empire_supervisor_log')
      .insert({
        message,
        project_id: projectId,
        team_id: teamId,
        task_type: teamId,
      })
      .select('id')
      .single();

    return Response.json({
      ok: true,
      taskIds,
      taskCount: taskIds.length,
      logId: logRow?.id,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Run team failed' },
      { status: 500 }
    );
  }
}
