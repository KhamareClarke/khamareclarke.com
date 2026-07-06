/**
 * Run the queued Cursor task on the server (minimal-edit runner) and return the result to the dashboard.
 * POST body: same as queue-cursor { projectId?, customTask?, taskIndex? }.
 * Writes task file, spawns empire-cursor-task-runner.js, reads result from empire-worker-last.log, returns to dashboard.
 */
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';
export const maxDuration = 90;

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
  let repoPath = null;
  try {
    const body = await req.json().catch(() => ({}));
    const projectId = (body.projectId || body.project_id || 'khamareclarke').toString().trim().toLowerCase();
    const customTask = typeof body.customTask === 'string' ? body.customTask.trim() : '';
    const taskIndex = Math.max(0, Math.min(3, parseInt(body.taskIndex, 10) || 0));

    repoPath = getProjectRepoPath(projectId);
    if (!repoPath || !fs.existsSync(repoPath)) {
      return Response.json({ error: `Project repo not found: ${projectId}. Check config/worker.json project_paths.` }, { status: 400 });
    }

    const task = customTask || PRESETS[taskIndex] || PRESETS[0];
    const taskLower = (task || '').trim().toLowerCase();
    const quickTaskPhrases = ['homepage buttons', 'header to navy', 'header navy', 'login button blue', 'footer dark', 'ctas yellow', 'cta yellow', 'seo meta', 'meta tags'];
    const isQuickTask = quickTaskPhrases.some((p) => taskLower.includes(p));
    const isHomepageTask = isQuickTask || taskLower.includes('homepage') || taskLower.includes('home page') ||
      (taskLower.includes('header') && taskLower.includes('navy')) ||
      (taskLower.includes('button') && (taskLower.includes('disappear') || taskLower.includes('hide') || taskLower.includes('blue'))) ||
      taskLower.includes('footer') || taskLower.includes('cta') || taskLower.includes('meta');
    const targetFile = isHomepageTask ? (fs.existsSync(path.join(repoPath, 'app', 'page.tsx')) ? 'app/page.tsx' : fs.existsSync(path.join(repoPath, 'app', 'page.jsx')) ? 'app/page.jsx' : 'app/page.tsx') : undefined;
    const taskFile = { projectId, task, taskIndex: customTask ? undefined : taskIndex, timestamp: new Date().toISOString(), ...(targetFile && { targetFile }) };
    const taskFilePath = path.join(repoPath, 'empire-cursor-task.json');
    fs.writeFileSync(taskFilePath, JSON.stringify(taskFile, null, 2), 'utf8');

    const isHideButtons = /homepage.*button|button.*homepage/i.test(task) && /disappear|hide|hidden/.test(taskLower);
    if (isHideButtons && targetFile === 'app/page.tsx') {
      const pagePath = path.join(repoPath, 'app', 'page.tsx');
      if (fs.existsSync(pagePath)) {
        let pageContent = fs.readFileSync(pagePath, 'utf8');
        const newBlock = '<div suppressHydrationWarning className="homepage-hide-buttons"><style dangerouslySetInnerHTML={{ __html: \'.homepage-hide-buttons button, .homepage-hide-buttons [class*="Button"], .homepage-hide-buttons [role="button"] { display: none !important; }\' }} />';
        const updated = pageContent.replace(/(\s*)<div\s+suppressHydrationWarning\s*>/, (_, indent) => indent + newBlock);
        if (updated !== pageContent) {
          fs.writeFileSync(pagePath, updated, 'utf8');
          const logData = { instruction: task, result: 'Done. Homepage buttons are now hidden via CSS (homepage-hide-buttons class).' };
          fs.writeFileSync(path.join(repoPath, 'empire-worker-last.log'), JSON.stringify(logData, null, 2), 'utf8');
          return Response.json({
            ok: true,
            result: logData.result,
            log: '[API applied hide-buttons edit to app/page.tsx]',
            repoPath,
          });
        }
      }
    }

    const isHeaderNavy = /header.*navy|navy.*header/i.test(task);
    if (isHeaderNavy) {
      const headerPath = path.join(repoPath, 'components', 'EnhancedHeader.tsx');
      if (fs.existsSync(headerPath)) {
        let headerContent = fs.readFileSync(headerPath, 'utf8');
        const navyHeader = 'className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] backdrop-blur-sm py-1 sm:py-2 shadow-xl"';
        const updated = headerContent.replace(
          /className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-\[#0056D2\] via-blue-800 to-blue-900 backdrop-blur-sm py-1 sm:py-2 shadow-xl"/,
          navyHeader
        );
        if (updated !== headerContent) {
          fs.writeFileSync(headerPath, updated, 'utf8');
          const logData = { instruction: task, result: 'Done. Header background changed to navy (#0F172A).' };
          fs.writeFileSync(path.join(repoPath, 'empire-worker-last.log'), JSON.stringify(logData, null, 2), 'utf8');
          return Response.json({
            ok: true,
            result: logData.result,
            log: '[API applied header navy to components/EnhancedHeader.tsx]',
            repoPath,
          });
        }
      }
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'empire-cursor-task-runner.js');
    if (!fs.existsSync(scriptPath)) {
      return Response.json({ error: 'empire-cursor-task-runner.js not found' }, { status: 500 });
    }

    const env = {
      ...process.env,
      EMPIRE_WORKER_ALLOWED_PATHS: repoPath,
      EMPIRE_CURSOR_TASK_FILE: taskFilePath,
    };
    if (process.env.OPENROUTER_API_KEY) env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (process.env.EMPIRE_LLM_API_KEY) env.EMPIRE_LLM_API_KEY = process.env.EMPIRE_LLM_API_KEY;

    let log = '';
    const child = spawn('node', [scriptPath], {
      env,
      cwd: process.cwd(),
      shell: false,
    });
    child.stdout?.on('data', (chunk) => { log += chunk.toString(); });
    child.stderr?.on('data', (chunk) => { log += chunk.toString(); });

    await new Promise((resolve, reject) => {
      child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
      child.on('error', reject);
    });

    const logPath = path.join(repoPath, 'empire-worker-last.log');
    let resultText = 'Done.';
    if (fs.existsSync(logPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        resultText = data.result || resultText;
      } catch (_) {}
    }

    return Response.json({
      ok: true,
      result: resultText,
      log: log.slice(-2000),
      repoPath,
    });
  } catch (err) {
    if (!repoPath) repoPath = getProjectRepoPath('myapproved');
    let resultText = err.message || 'Task failed';
    if (repoPath) {
      const logPath = path.join(repoPath, 'empire-worker-last.log');
      if (fs.existsSync(logPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(logPath, 'utf8'));
          resultText = data.result || resultText;
        } catch (_) {}
      }
    }
    return Response.json({
      ok: false,
      result: resultText,
      error: err.message,
    }, { status: 500 });
  }
}
