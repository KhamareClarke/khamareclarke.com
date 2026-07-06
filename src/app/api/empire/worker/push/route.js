/**
 * Commit and push worker changes to the selected project's repo.
 * POST body: { message?: string, projectId? } — projectId = which repo (config/worker.json project_paths).
 */
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function getProjectRepoPath(projectId) {
  const envKey = `EMPIRE_REPO_${(projectId || '').toUpperCase().replace(/-/g, '_')}`;
  const envPath = process.env[envKey];
  if (envPath) return path.resolve(envPath);
  let config = { project_paths: {} };
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'config', 'worker.json'), 'utf8');
    config = JSON.parse(raw);
  } catch (_) {}
  const relative = config.project_paths?.[(projectId || '').toLowerCase()];
  if (!relative) return null;
  return path.resolve(process.cwd(), relative);
}

export async function POST(req) {
  try {
    if (process.env.EMPIRE_WORKER_PUSH_ENABLED !== 'true') {
      return Response.json(
        { error: 'Push disabled. Set EMPIRE_WORKER_PUSH_ENABLED=true in .env.local to allow.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = (body.message || body.commitMessage || 'Empire worker: edit code, fix bugs').trim().slice(0, 200) || 'Empire worker updates';
    const projectId = (body.projectId || body.project_id || 'khamareclarke').toString().trim().toLowerCase();

    const repoPath = getProjectRepoPath(projectId);
    const cwd = repoPath || process.cwd();
    const opts = { encoding: 'utf8', cwd, shell: true };
    let log = '';
    try {
      execSync('git add -A', opts);
      execSync(`git commit -m ${JSON.stringify(message)}`, opts);
      log = execSync('git push', opts);
    } catch (e) {
      const out = (e.stdout || '') + (e.stderr || '') + (e.message || '');
      return Response.json({
        ok: false,
        log: out.slice(-3000),
        error: e.message,
      });
    }

    return Response.json({ ok: true, log: log.slice(-2000), message, projectId, repoPath: cwd });
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Push failed' },
      { status: 500 }
    );
  }
}
