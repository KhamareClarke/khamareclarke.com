/**
 * Empire auto 24h run — runs Growth (SEO), Sales (Leads), Ops (Maintenance) for one or ALL projects.
 * Does not get stuck: each worker call has a timeout; we move to the next project/task.
 * GET/POST: ?projectId=myapproved (one project) or ?projectId=all (rotate through all). Default: all (2 projects per run).
 */
import { createClient } from '@supabase/supabase-js';
import { getProjectLabel, ALL_EMPIRE_PROJECT_IDS } from '@/lib/empire-projects';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const TEAM_NAMES = ['Growth (SEO)', 'Sales (Leads)', 'Ops (Maintenance)'];
const TASK_INDICES = [0, 1, 2];
const WORKER_TIMEOUT_MS = 50000;
const DASHBOARD_PROJECT_IDS = (ALL_EMPIRE_PROJECT_IDS || []).filter(
  (id) => id !== 'empire' && id !== 'empire-phase11-test'
);

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  return 'http://localhost:3000';
}

export async function GET(req) {
  return runAuto24h(req);
}

export async function POST(req) {
  return runAuto24h(req);
}

async function runWorkerWithTimeout(baseUrl, projectId, taskIndex, timeoutMs) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/api/empire/worker/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIndex, projectId }),
      signal: controller.signal,
    });
    clearTimeout(to);
    const data = await res.json().catch(() => ({}));
    return {
      ok: res.ok && data.ok,
      result: typeof data.result === 'string' ? data.result : (data.error || 'No result'),
    };
  } catch (err) {
    clearTimeout(to);
    const msg = err.name === 'AbortError' ? `Timeout after ${timeoutMs / 1000}s` : (err?.message || String(err));
    return { ok: false, result: msg };
  }
}

async function runAuto24h(req) {
  try {
    let taskParam = null;
    let projectParam = '';
    try {
      const url = new URL(req.url || '', getBaseUrl());
      taskParam = url.searchParams.get('task');
      projectParam = url.searchParams.get('projectId') || '';
    } catch (_) {}
    if (req.method === 'POST') {
      try {
        const body = await req.json().catch(() => ({}));
        if (body.task !== undefined) taskParam = String(body.task);
        if (body.projectId) projectParam = body.projectId;
      } catch (_) {}
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const baseUrl = getBaseUrl();
    const taskIndices = taskParam !== null && taskParam !== ''
      ? [Math.max(0, Math.min(2, parseInt(taskParam, 10) || 0))]
      : TASK_INDICES;

    const wantAll = String(projectParam || '').toLowerCase() === 'all';
    const projectIds = wantAll
      ? (() => {
          const n = DASHBOARD_PROJECT_IDS.length;
          if (n === 0) return ['myapproved'];
          const batch = Math.min(2, n);
          const start = Math.floor(Date.now() / (6 * 60 * 60 * 1000)) * batch % n;
          return Array.from({ length: batch }, (_, i) => DASHBOARD_PROJECT_IDS[(start + i) % n]);
        })()
      : [(projectParam || process.env.EMPIRE_AUTO_24H_PROJECT_ID || 'myapproved').trim().toLowerCase()];

    const runs = [];
    for (const projectId of projectIds) {
      for (const taskIndex of taskIndices) {
        const teamName = TEAM_NAMES[taskIndex];
        let resultSummary = '';
        let fullFindings = '';
        let ok = false;
        const { result, ok: taskOk } = await runWorkerWithTimeout(baseUrl, projectId, taskIndex, WORKER_TIMEOUT_MS);
        ok = taskOk;
        resultSummary = result.slice(0, 500);
        fullFindings = (result || '').slice(0, 50000);
        runs.push({ projectId, taskIndex, teamId: teamName, ok, result: resultSummary });

        const projectName = typeof getProjectLabel === 'function' ? getProjectLabel(projectId) : projectId;
        const message = `Auto 24h [${projectName}]: ${teamName} — ${ok ? 'Done' : 'Failed'}. ${resultSummary.slice(0, 200)}${resultSummary.length > 200 ? '…' : ''}`;
        const insertPayload = {
          message,
          project_id: projectId,
          team_id: 'AUTO_24H',
          task_type: 'auto_24h',
          findings: fullFindings || resultSummary,
        };
        let { error: insertErr } = await supabase.from('empire_supervisor_log').insert(insertPayload);
        if (insertErr) {
          const { findings: _f, ...rest } = insertPayload;
          await supabase.from('empire_supervisor_log').insert(rest);
        }
        // Save to empire_seo_runs / empire_ops_runs (like leads) for dashboard
        if (taskIndex === 0) {
          await supabase.from('empire_seo_runs').insert({
            project_id: projectId,
            run_type: 'auto_24h',
            success: ok,
            push_ok: false,
            result_summary: (resultSummary || '').slice(0, 5000),
            push_message: null,
          });
        } else if (taskIndex === 2) {
          await supabase.from('empire_ops_runs').insert({
            project_id: projectId,
            run_type: 'auto_24h',
            success: ok,
            push_ok: false,
            result_summary: (resultSummary || '').slice(0, 5000),
            push_message: null,
          });
        }
      }
    }

    return Response.json({
      ok: true,
      projectIds,
      runs,
      message: `Auto 24h: ran ${runs.length} task(s) across ${projectIds.length} project(s). Logs written.`,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Auto 24h run failed' },
      { status: 500 }
    );
  }
}
