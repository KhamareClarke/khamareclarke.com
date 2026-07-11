/**
 * Empire webhook — secure trigger for external projects (MyApproved, Flip Republic, etc.).
 * POST with Authorization: Bearer <EMPIRE_WEBHOOK_SECRET> or X-Empire-Key: <secret>.
 * Body: { projectId, teamId?, taskDescription?, runPending? }
 * projectId must be one of the 11 domains (myapproved, fliprepublic, etc.).
 * Set EMPIRE_WEBHOOK_SECRET in .env.local. Used by cross-repo linking.
 */
import { ALL_EMPIRE_PROJECT_IDS } from '@/lib/empire-projects';

export const dynamic = 'force-dynamic';
export const maxDuration = 90;

const ALLOWED_PROJECT_IDS = ALL_EMPIRE_PROJECT_IDS.filter(
  (id) => id !== 'empire' && id !== 'empire-phase11-test'
);

function getSecret(req) {
  const auth = req.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return req.headers.get('x-empire-key') || req.headers.get('x-webhook-secret') || '';
}

export async function POST(req) {
  try {
    const secret = process.env.EMPIRE_WEBHOOK_SECRET || process.env.EMPIRE_TRIGGER_SECRET;
    if (!secret) {
      return Response.json(
        { error: 'Empire webhook not configured (set EMPIRE_WEBHOOK_SECRET)' },
        { status: 503 }
      );
    }

    if (getSecret(req) !== secret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    let projectId = (body.projectId || body.project_id || '').toString().trim().toLowerCase();
    const teamId = body.teamId || body.team_id || 'SALES_TEAM';
    const taskDescription = body.taskDescription || body.task_description || '';
    const runPending = Boolean(body.runPending ?? body.run_pending ?? false);

    if (!projectId) {
      return Response.json({ error: 'projectId required' }, { status: 400 });
    }

    if (!ALLOWED_PROJECT_IDS.includes(projectId)) {
      return Response.json(
        { error: `projectId must be one of: ${ALLOWED_PROJECT_IDS.join(', ')}` },
        { status: 400 }
      );
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const runTeamRes = await fetch(`${baseUrl}/api/empire/supervisor/run-team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        teamId,
        taskDescription: taskDescription || `Webhook: ${teamId} for ${projectId}`,
      }),
    });

    if (!runTeamRes.ok) {
      const err = await runTeamRes.json().catch(() => ({}));
      return Response.json(
        { error: err.error || runTeamRes.statusText, triggered: false },
        { status: runTeamRes.status }
      );
    }

    const runTeamData = await runTeamRes.json();
    let runPendingResult = null;

    if (runPending && runTeamData.taskCount > 0) {
      const pendingRes = await fetch(`${baseUrl}/api/empire/run-pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, handoff: false }),
      });
      runPendingResult = pendingRes.ok ? await pendingRes.json() : { error: 'run-pending failed' };
    }

    return Response.json({
      ok: true,
      triggered: true,
      projectId,
      teamId,
      taskCount: runTeamData.taskCount,
      taskIds: runTeamData.taskIds,
      runPending: runPending ? runPendingResult : undefined,
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Webhook failed' },
      { status: 500 }
    );
  }
}
