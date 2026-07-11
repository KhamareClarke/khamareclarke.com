/**
 * Queue a task for Cursor to process (instead of the LLM agent).
 * POST body: { projectId?: string, customTask?: string, taskIndex?: number }
 * Writes empire-cursor-task.json to the target project repo. User then opens that project
 * in Cursor and says "Process empire task" — Cursor AI does the edit and writes result to empire-worker-last.log.
 */
import path from 'path';
import fs from 'fs';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

const PRESETS = [
  'Growth Team: Perform a full Technical SEO audit on the first available repo. Read the main layout or index file, identify missing or weak meta tags (title, description, og tags), and use write_file to fix them. Report what you changed.',
  'Sales Team: List the steps you would take to scrape 500 potential leads for MyApproved (UK tradesperson leads). If run_command is allowed, run one approved script; otherwise output the exact script content and where to save it.',
  'Ops Team: Read the MyApproved homepage component (e.g. app/page.tsx or app/page.jsx). Identify where to apply a Bento Box layout with Navy (#0F172A) and Yellow (#EAB308) brand colors. Use write_file to apply the change if you can, or output the exact code diff.',
  'Intel Team: Perform a competitor analysis. Research the top 3 UK tradesperson / job board sites (you can use your knowledge). Write a short report and use write_file to save it to docs/intel-competitor-report.md.',
];

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
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const projectId = (body.projectId || body.project_id || 'khamareclarke').toString().trim().toLowerCase();
    const customTask = typeof body.customTask === 'string' ? body.customTask.trim() : '';
    const taskIndex = Math.max(0, Math.min(3, parseInt(body.taskIndex, 10) || 0));

    const repoPath = getProjectRepoPath(projectId);
    if (!repoPath || !fs.existsSync(repoPath)) {
      return Response.json({ error: `Project repo not found: ${projectId}. Check config/worker.json project_paths.` }, { status: 400 });
    }

    const task = customTask || PRESETS[taskIndex] || PRESETS[0];
    const taskFile = {
      projectId,
      task,
      taskIndex: customTask ? undefined : taskIndex,
      timestamp: new Date().toISOString(),
    };

    const filePath = path.join(repoPath, 'empire-cursor-task.json');
    fs.writeFileSync(filePath, JSON.stringify(taskFile, null, 2), 'utf8');

    return Response.json({
      ok: true,
      repoPath,
      filePath,
      message: 'Task queued for Cursor. Open this project in Cursor and say "Process empire task" (or "Run the empire task").',
    });
  } catch (err) {
    return Response.json({ error: err?.message || 'Failed to queue task' }, { status: 500 });
  }
}
