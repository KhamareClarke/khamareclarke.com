/**
 * Run Empire worker for a task (preset or custom).
 * POST body: { taskIndex?: number, projectId?: string, customTask?: string }
 * If customTask is non-empty, it is written to a temp file and EMPIRE_WORKER_CUSTOM_TASK_FILE is set.
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

function pathExists(p) {
  try {
    return fs.existsSync(p);
  } catch (_) {
    return false;
  }
}

function looksLikeNextProject(dir) {
  return pathExists(path.join(dir, 'package.json')) && (pathExists(path.join(dir, 'next.config.js')) || pathExists(path.join(dir, 'next.config.mjs')));
}

function getProjectRepoPath(projectId) {
  const id = (projectId || '').toLowerCase();
  const envKey = `EMPIRE_REPO_${id.toUpperCase().replace(/-/g, '_')}`;
  const envPath = process.env[envKey];
  if (envPath) {
    const resolved = path.resolve(envPath);
    if (pathExists(resolved)) return resolved;
  }
  let config = { project_paths: {} };
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'config', 'worker.json'), 'utf8');
    config = JSON.parse(raw);
  } catch (_) {}
  const relative = config.project_paths?.[id];
  if (!relative) return null;
  const cwd = process.cwd();
  // Try config path first, then common alternatives so "npm run build" runs in the real app folder
  const candidates = [
    path.resolve(cwd, relative),
    path.resolve(cwd, 'myapproved.com'),   // when cwd is projectredesigns
    path.resolve(cwd, '..', 'myapproved.com'),
  ];
  if (id === 'myapproved') {
    for (const dir of candidates) {
      if (pathExists(dir) && looksLikeNextProject(dir)) return dir;
    }
    return path.resolve(cwd, relative);
  }
  return path.resolve(cwd, relative);
}

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const taskIndex = Math.max(0, Math.min(3, parseInt(body.taskIndex, 10) || 0));
    const projectId = (body.projectId || body.project_id || 'khamareclarke').toString().trim().toLowerCase();
    const customTask = typeof body.customTask === 'string' ? body.customTask.trim() : '';

    const customLlmUrl = (process.env.EMPIRE_LLM_API_URL || process.env.ZEROCLAW_LLM_URL || '').trim();
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY || process.env.ZEROCLAW_API_KEY || '';
    if (!customLlmUrl && !apiKey) {
      return Response.json({ error: 'Set OPENROUTER_API_KEY or EMPIRE_LLM_API_KEY, or set EMPIRE_LLM_API_URL (e.g. for ZeroClaw/Ollama)' }, { status: 500 });
    }

    const repoPath = getProjectRepoPath(projectId);
    const allowedPaths = process.env.EMPIRE_WORKER_ALLOWED_PATHS || (repoPath ? repoPath : process.cwd());

    const env = {
      ...process.env,
      OPENROUTER_API_KEY: apiKey,
      EMPIRE_WORKER_ALLOWED_PATHS: allowedPaths,
      EMPIRE_WORKER_PROJECT_ID: projectId,
    };
    // So worker can run git/npm in the target repo when run_command is used
    env.EMPIRE_WORKER_ALLOWED_COMMANDS = process.env.EMPIRE_WORKER_ALLOWED_COMMANDS
      || 'git status,git add,git add -A,git commit,git push,npm run build,npx next build';

    let customTaskFile = null;
    if (customTask.length > 0) {
      customTaskFile = path.join(process.cwd(), 'empire-worker-custom-task.txt');
      fs.writeFileSync(customTaskFile, customTask, 'utf8');
      env.EMPIRE_WORKER_CUSTOM_TASK_FILE = customTaskFile;
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'empire-worker.js');
    const liveLogPath = path.join(process.cwd(), 'empire-worker-live.log');
    fs.writeFileSync(liveLogPath, '', 'utf8');
    let log = '';
    const appendLive = (chunk) => {
      const s = chunk.toString();
      log += s;
      try { fs.appendFileSync(liveLogPath, s, 'utf8'); } catch (_) {}
    };
    const child = spawn('node', [scriptPath, String(taskIndex)], {
      env,
      shell: false,
      cwd: process.cwd(),
    });
    child.stdout?.on('data', appendLive);
    child.stderr?.on('data', appendLive);
    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) return resolve();
        const err = new Error(`exit ${code}`);
        err.workerLog = log;
        reject(err);
      });
      child.on('error', reject);
    });

    if (customTaskFile && fs.existsSync(customTaskFile)) {
      try { fs.unlinkSync(customTaskFile); } catch (_) {}
    }

    const logPath = path.join(process.cwd(), 'empire-worker-last.log');
    let result = {};
    if (fs.existsSync(logPath)) {
      try {
        result = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (_) {}
    }

    const resultText = result && typeof result.result === 'string' ? result.result : 'Done';
    return Response.json({
      ok: true,
      log: String(log).slice(-4000),
      result: resultText,
      taskIndex,
      projectId,
      repoPath: allowedPaths,
      customTask: customTask.length > 0,
    });
  } catch (e) {
    const workerLog = e.workerLog || (e.stdout || '') + (e.stderr || '') + (e.message || '');
    const log = String(workerLog).slice(-4000);
    const customTaskFile = path.join(process.cwd(), 'empire-worker-custom-task.txt');
    if (fs.existsSync(customTaskFile)) {
      try { fs.unlinkSync(customTaskFile); } catch (_) {}
    }
    const errMsg = e && typeof e.message === 'string' ? e.message : 'Worker failed';
    return Response.json({
      ok: false,
      log,
      result: errMsg + (log ? ' — see log below for details.' : ''),
    });
  }
}
