#!/usr/bin/env node
/**
 * Run the queued Empire task with a minimal-edit approach (search → LLM returns old_string/new_string → replace).
 * Called by the dashboard "Queue for Cursor" flow so the task runs on the server and result shows on dashboard.
 * Env: EMPIRE_WORKER_ALLOWED_PATHS (project repo path), EMPIRE_CURSOR_TASK_FILE (path to empire-cursor-task.json),
 *      OPENROUTER_API_KEY or EMPIRE_LLM_API_KEY.
 */
try { require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') }); } catch (_) {}

const path = require('path');
const fs = require('fs');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const taskFilePath = process.env.EMPIRE_CURSOR_TASK_FILE || path.join(process.env.EMPIRE_WORKER_ALLOWED_PATHS || process.cwd(), 'empire-cursor-task.json');
// Use repo root where task file lives so we always target the right project (avoids picking admin dashboard)
const projectRoot = process.env.EMPIRE_CURSOR_TASK_FILE
  ? path.dirname(path.resolve(process.env.EMPIRE_CURSOR_TASK_FILE))
  : (process.env.EMPIRE_WORKER_ALLOWED_PATHS ? path.resolve(process.env.EMPIRE_WORKER_ALLOWED_PATHS.trim()) : process.cwd());

const { searchFiles, readFile, writeFile, getProjectRoot } = require(path.join(process.cwd(), 'src/lib/empire-tools.js'));

function getLLMConfig() {
  const apiKey = (process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY || '').trim();
  return { url: OPENROUTER_URL, apiKey };
}

function extractSearchPhrase(task) {
  const t = (task || '').toLowerCase();
  if (t.includes('button')) return 'button';
  if (t.includes('header')) return 'header';
  if (t.includes('homepage')) return 'homepage';
  if (t.includes('footer')) return 'footer';
  const words = task.split(/\s+/).filter(Boolean).slice(0, 3);
  return words.length ? words.join(' ') : task.slice(0, 40);
}

/** When task mentions "homepage", prefer app/page.tsx or app/page.jsx over admin or other pages. */
function pickBestFile(task, matches) {
  if (!matches || matches.length === 0) return null;
  const t = (task || '').toLowerCase();
  const isHomepage = t.includes('homepage') || t.includes('home page');
  if (isHomepage) {
    const homepage = matches.find((m) => m.file === 'app/page.tsx' || m.file === 'app/page.jsx');
    if (homepage) return homepage.file;
    const appPage = matches.find((m) => /^app\/page\.(tsx|jsx)$/.test(m.file));
    if (appPage) return appPage.file;
  }
  return matches[0].file;
}

async function run() {
  if (!fs.existsSync(taskFilePath)) {
    console.error('[empire-cursor-runner] No task file at', taskFilePath);
    process.exit(1);
  }
  const taskData = JSON.parse(fs.readFileSync(taskFilePath, 'utf8'));
  const task = taskData.task || '';
  if (!task) {
    console.error('[empire-cursor-runner] Empty task');
    process.exit(1);
  }

  const { url, apiKey } = getLLMConfig();
  if (!apiKey) {
    console.error('[empire-cursor-runner] Set OPENROUTER_API_KEY or EMPIRE_LLM_API_KEY');
    process.exit(1);
  }

  const phrase = extractSearchPhrase(task);
  const taskLower = (task || '').toLowerCase();
  // API can pass targetFile in task JSON so we never pick the wrong file (e.g. admin dashboard)
  let targetFile = typeof taskData.targetFile === 'string' && taskData.targetFile.trim() ? taskData.targetFile.trim() : null;
  if (targetFile) {
    if (!targetFile.startsWith('app/') && !targetFile.startsWith('components/')) targetFile = 'app/page.tsx';
  }
  const normalized = taskLower
    .replace(/\bhomapge\b/g, 'homepage')
    .replace(/\bdispapered\b/g, 'disappeared')
    .replace(/\bdisapear/g, 'disappear');
  const wantHomepage = normalized.includes('homepage') || normalized.includes('home page');
  const wantHideButtons = normalized.includes('button') && (
    normalized.includes('disappear') || normalized.includes('hide') || normalized.includes('hidden') ||
    normalized.includes('remove') || normalized.includes('gone')
  );

  if (!targetFile && (wantHomepage || wantHideButtons)) {
    const appPagePath = path.join(projectRoot, 'app', 'page.tsx');
    const appPageJsx = path.join(projectRoot, 'app', 'page.jsx');
    if (fs.existsSync(appPagePath)) targetFile = 'app/page.tsx';
    else if (fs.existsSync(appPageJsx)) targetFile = 'app/page.jsx';
    else targetFile = 'app/page.tsx'; // force homepage so we never pick admin dashboard for this intent
  }
  if (!targetFile) {
    const searchResult = searchFiles(phrase);
    if (searchResult.ok && searchResult.matches && searchResult.matches.length > 0) {
      targetFile = pickBestFile(task, searchResult.matches) || searchResult.matches[0].file;
      // If intent is "hide buttons" or "homepage" but we got admin/other, prefer app/page
      if ((wantHomepage || wantHideButtons) && targetFile && targetFile.includes('admin')) {
        const appPage = searchResult.matches.find((m) => m.file === 'app/page.tsx' || m.file === 'app/page.jsx');
        if (appPage) targetFile = appPage.file;
        else targetFile = 'app/page.tsx'; // force even if not in search results
      }
    }
  }
  if (!targetFile) {
    const result = { instruction: task, result: `Search for "${phrase}" found no matches. Run from Cursor with "Process empire task" for complex edits.` };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    console.log('[empire-cursor-runner]', result.result);
    return;
  }
  // Failsafe: never use admin dashboard for homepage/header/button/footer/CTA tasks (even if API or search picked it)
  if (targetFile.includes('admin') && (wantHomepage || wantHideButtons || normalized.includes('header') || normalized.includes('footer') || normalized.includes('cta') || normalized.includes('meta'))) {
    const appPagePath = path.join(projectRoot, 'app', 'page.tsx');
    const appPageJsx = path.join(projectRoot, 'app', 'page.jsx');
    targetFile = fs.existsSync(appPagePath) ? 'app/page.tsx' : fs.existsSync(appPageJsx) ? 'app/page.jsx' : 'app/page.tsx';
  }
  let content;
  try {
    const out = readFile(targetFile);
    content = out.content || '';
  } catch (e) {
    const result = { instruction: task, result: `Failed to read ${targetFile}: ${e.message}` };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    console.error('[empire-cursor-runner]', result.result);
    process.exit(1);
  }

  const t = (task || '').toLowerCase();
  const norm = t.replace(/\bhomapge\b/g, 'homepage').replace(/\bdispapered\b/g, 'disappeared').replace(/\bdisapear/g, 'disappear');
  const isHomepagePage = targetFile === 'app/page.tsx' || targetFile === 'app/page.jsx';
  const hideButtons = isHomepagePage && norm.includes('button') && (
    norm.includes('disappear') || norm.includes('hide') || norm.includes('hidden') || norm.includes('remove') || norm.includes('gone')
  );
  if (hideButtons) {
    // readFile() truncates to ~12k chars; root div is far down in app/page.tsx — read full file for this fix
    let fullContent = content;
    const fullPath = path.join(projectRoot, targetFile);
    if (fs.existsSync(fullPath)) {
      try {
        fullContent = fs.readFileSync(fullPath, 'utf8');
      } catch (_) {}
    }
    const newBlock = '<div suppressHydrationWarning className="homepage-hide-buttons"><style dangerouslySetInnerHTML={{ __html: \'.homepage-hide-buttons button, .homepage-hide-buttons [class*="Button"], .homepage-hide-buttons [role="button"] { display: none !important; }\' }} />';
    const withIndent = fullContent.replace(/(\s*)<div\s+suppressHydrationWarning\s*>/, '$1' + newBlock);
    if (withIndent !== fullContent) {
      writeFile(targetFile, withIndent);
      const result = { instruction: task, result: 'Done. Homepage buttons are now hidden via CSS (homepage-hide-buttons class).' };
      fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
      console.log('[empire-cursor-runner]', result.result);
      return;
    }
  }

  const excerpt = content.slice(0, 10000);
  const systemPrompt = `You are a precise code editor. Respond with ONLY a valid JSON object, no markdown or explanation. Keys: "file_path" (string, must be "${targetFile}"), "old_string" (string, a contiguous block from the content below - copy it exactly including spaces and newlines), "new_string" (string, the replacement - for hiding buttons add className="hidden" to the opening tag or use style={{ display: 'none' }}). For "make buttons disappeared" pick a single <Button or <button element (one opening tag to closing tag) and add hidden. Keep old_string short: 2-10 lines max so it matches.`;
  const userMsg = `Task: ${task}\n\nFile: ${targetFile}\n\nContent (copy a short block from here for old_string):\n${excerpt}`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify({
        model: process.env.EMPIRE_LLM_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMsg },
        ],
        max_tokens: 1024,
      }),
    });
  } catch (e) {
    const result = { instruction: task, result: `LLM request failed: ${e.message}` };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    console.error('[empire-cursor-runner]', result.result);
    process.exit(1);
  }

  if (!res.ok) {
    const text = await res.text();
    const result = { instruction: task, result: `LLM ${res.status}: ${text.slice(0, 200)}` };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    process.exit(1);
  }

  const data = await res.json();
  const raw = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
  const jsonStr = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  let edit;
  try {
    edit = JSON.parse(jsonStr);
  } catch (e) {
    const result = { instruction: task, result: `LLM did not return valid JSON. Response: ${raw.slice(0, 300)}` };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    console.error('[empire-cursor-runner]', result.result);
    process.exit(1);
  }

  const file_path = edit.file_path || targetFile;
  const old_string = (edit.old_string || '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  const new_string = (edit.new_string || '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');

  if (!old_string) {
    const result = { instruction: task, result: 'LLM returned empty old_string.' };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    process.exit(1);
  }

  const fullContent = content;
  const norm = (s) => (s || '').replace(/\r\n/g, '\n');
  const oldNorm = norm(old_string).trim();
  let newContent;
  if (fullContent.includes(old_string)) {
    newContent = fullContent.replace(old_string, new_string);
  } else if (norm(fullContent).includes(oldNorm)) {
    const fullNorm = norm(fullContent);
    newContent = fullNorm.replace(oldNorm, norm(new_string));
  } else {
    const escaped = old_string.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flexibleRegex = new RegExp(escaped.replace(/\s+/g, '\\s+'));
    const match = fullContent.match(flexibleRegex);
    if (match) {
      newContent = fullContent.replace(match[0], new_string);
    } else {
      const normRegex = new RegExp(escaped.replace(/\s+/g, '\\s+'));
      const normMatch = norm(fullContent).match(normRegex);
      if (normMatch) {
        const fullNorm = norm(fullContent);
        newContent = fullNorm.replace(normMatch[0], norm(new_string));
      } else {
        const result = { instruction: task, result: `old_string not found in ${file_path}. Run from Cursor with "Process empire task" for manual edit.` };
        fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
        console.log('[empire-cursor-runner]', result.result);
        return;
      }
    }
  }
  try {
    writeFile(file_path, newContent);
  } catch (e) {
    const result = { instruction: task, result: `Write failed: ${e.message}` };
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify(result, null, 2), 'utf8');
    process.exit(1);
  }

  const result = { instruction: task, result: `Done. Updated ${file_path} with minimal edit (replaced specified block).` };
  const logPath = path.join(projectRoot, 'empire-worker-last.log');
  fs.writeFileSync(logPath, JSON.stringify(result, null, 2), 'utf8');
  console.log('[empire-cursor-runner]', result.result);
}

run().catch((err) => {
  console.error('[empire-cursor-runner]', err.message);
  const projectRoot = process.env.EMPIRE_WORKER_ALLOWED_PATHS ? path.resolve(process.env.EMPIRE_WORKER_ALLOWED_PATHS.trim()) : process.cwd();
  try {
    fs.writeFileSync(path.join(projectRoot, 'empire-worker-last.log'), JSON.stringify({ result: err.message }, null, 2), 'utf8');
  } catch (_) {}
  process.exit(1);
});
