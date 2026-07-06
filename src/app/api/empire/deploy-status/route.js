/**
 * Fetch latest Vercel deployment status and build error for a project.
 * GET /api/empire/deploy-status?projectId=myapproved
 * Env: VERCEL_TOKEN, VERCEL_PROJECT_ID_<PROJECT> (e.g. VERCEL_PROJECT_ID_MYAPPROVED = Vercel project id).
 */
export const dynamic = 'force-dynamic';

function getVercelProjectId(projectId) {
  const key = `VERCEL_PROJECT_ID_${(projectId || '').toUpperCase().replace(/-/g, '_')}`;
  return process.env[key] || null;
}

export async function GET(req) {
  try {
    const token = process.env.VERCEL_TOKEN;
    const { searchParams } = new URL(req.url);
    const projectId = (searchParams.get('projectId') || 'myapproved').toString().trim().toLowerCase();

    if (!token) {
      return Response.json({
        ok: false,
        needPaste: true,
        error: 'VERCEL_TOKEN not set. Add it in .env.local to auto-read deploy errors, or paste the error manually.',
      });
    }

    const vercelProjectId = getVercelProjectId(projectId);
    if (!vercelProjectId) {
      return Response.json({
        ok: false,
        needPaste: true,
        error: `VERCEL_PROJECT_ID_${projectId.toUpperCase()} not set. Set it to your Vercel project ID, or paste the build error manually.`,
      });
    }

    const base = 'https://api.vercel.com';
    const headers = { Authorization: `Bearer ${token}` };

    const listRes = await fetch(
      `${base}/v6/deployments?projectId=${encodeURIComponent(vercelProjectId)}&limit=5`,
      { headers }
    );
    if (!listRes.ok) {
      const t = await listRes.text();
      return Response.json({
        ok: false,
        needPaste: true,
        error: `Vercel API ${listRes.status}: ${t.slice(0, 200)}`,
      });
    }

    const list = await listRes.json();
    const deployments = list.deployments || list;
    const latest = deployments[0];
    if (!latest) {
      return Response.json({
        ok: true,
        state: 'none',
        buildError: null,
        message: 'No deployments found.',
      });
    }

    const state = latest.readyState || latest.state || latest.status;
    const deploymentId = latest.uid || latest.id;

    if (state !== 'ERROR' && state !== 'BUILDING') {
      return Response.json({
        ok: true,
        state: state || 'READY',
        buildError: null,
        deploymentUrl: latest.url,
        message: state === 'READY' ? 'Last deployment succeeded.' : `State: ${state}`,
      });
    }

    if (state === 'BUILDING') {
      return Response.json({
        ok: true,
        state: 'BUILDING',
        buildError: null,
        deploymentUrl: latest.url,
        message: 'Deployment still building.',
      });
    }

    let buildLog = '';
    try {
      const eventsRes = await fetch(
        `${base}/v3/deployments/${deploymentId}/events?limit=200&direction=backward`,
        { headers }
      );
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        const items = Array.isArray(events) ? events : (events.events || []);
        const lines = [];
        for (const ev of items) {
          const type = ev.type || ev.payload?.type;
          const text = ev.payload?.text ?? ev.text ?? '';
          if (text && (type === 'stderr' || type === 'fatal' || type === 'stdout' || type === 'exit')) {
            lines.push(text);
          }
        }
        buildLog = lines.join('\n').slice(-8000);
      }
    } catch (_) {}

    const buildError = buildLog || latest.errorMessage || latest.buildError || 'Build failed (no log captured).';

    return Response.json({
      ok: true,
      state: 'ERROR',
      buildError,
      deploymentUrl: latest.url,
      deploymentId,
      message: 'Last deployment failed. Use this error for Fix build.',
    });
  } catch (err) {
    return Response.json(
      { ok: false, needPaste: true, error: err?.message || 'Failed to fetch deploy status' },
      { status: 500 }
    );
  }
}
