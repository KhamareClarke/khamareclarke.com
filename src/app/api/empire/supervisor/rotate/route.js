/**
 * Empire supervisor rotate — pick next domain in queue and run team for it (24/7 autonomy).
 * POST body: { teamId?: string } — default SALES_TEAM.
 * Uses last supervisor_log project_id to determine next domain in config order.
 */
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const teamId = body?.teamId || 'SALES_TEAM';

    const config = loadTeamsConfig();
    const domains = config.domains || [];
    if (domains.length === 0) {
      return Response.json({ error: 'No domains in config' }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data: lastLog } = await supabase
      .from('empire_supervisor_log')
      .select('project_id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const lastProject = lastLog?.project_id || '';
    const idx = domains.indexOf(lastProject);
    const nextIdx = idx < 0 ? 0 : (idx + 1) % domains.length;
    const nextProject = domains[nextIdx];

    const runTeamUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/empire/supervisor/run-team`
      : process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/empire/supervisor/run-team`
        : 'http://localhost:3000/api/empire/supervisor/run-team';

    const runRes = await fetch(runTeamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: nextProject,
        teamId,
        taskDescription: `Rotate: ${teamId} for ${nextProject} (24/7 queue)`,
      }),
    });

    if (!runRes.ok) {
      const err = await runRes.json().catch(() => ({}));
      return Response.json(
        { error: err.error || runRes.statusText, rotatedTo: nextProject },
        { status: runRes.status }
      );
    }

    const data = await runRes.json();
    return Response.json({
      ok: true,
      rotatedTo: nextProject,
      teamId,
      taskCount: data.taskCount,
      message: `Delegated ${teamId} (${data.taskCount || 0} agents) for ${nextProject}`,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Rotate failed' },
      { status: 500 }
    );
  }
}
