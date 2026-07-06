#!/usr/bin/env node
/**
 * Empire Worker — runs one task with Tool Calling (read_file, write_file, run_command).
 * Run from repo root: node scripts/empire-worker.js [taskIndex]
 * Env: OPENROUTER_API_KEY, EMPIRE_WORKER_ALLOWED_PATHS (comma-separated), EMPIRE_WORKER_ALLOWED_COMMANDS (optional).
 * See docs/EMPIRE_WORKER_MODE.md.
 */
try { require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') }); } catch (_) {}

const path = require('path');
const fs = require('fs');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_TOOL_ITERATIONS = 20;

function getWorkerLLMConfig() {
  const openRouterKey = (process.env.OPENROUTER_API_KEY || '').trim();
  if (openRouterKey) {
    return { url: OPENROUTER_URL, apiKey: openRouterKey, name: 'OpenRouter' };
  }
  const customUrl = (process.env.EMPIRE_LLM_API_URL || process.env.ZEROCLAW_LLM_URL || '').trim().replace(/\/$/, '');
  if (customUrl) {
    const base = customUrl.includes('/chat/completions') ? customUrl : `${customUrl}/chat/completions`;
    const key = (process.env.EMPIRE_LLM_API_KEY || process.env.ZEROCLAW_API_KEY || '').trim();
    return { url: base, apiKey: key, name: 'Custom LLM' };
  }
  const key = (process.env.EMPIRE_LLM_API_KEY || '').trim();
  return { url: OPENROUTER_URL, apiKey: key, name: 'OpenRouter' };
}

const { getToolDefinitions, executeToolCall } = require(path.join(process.cwd(), 'src/lib/empire-tools.js'));

const MASTER_ORDER = [
  'Growth Team (Continuous SEO). STRICT RULES: (1) ONLY edit app/layout.tsx (or app/layout.js) and existing metadata files—do NOT create new files in app/ for robots or sitemap. (2) For robots: edit public/robots.txt only (plain text). For sitemap: edit public/sitemap.xml only. NEVER write app/robots.txt/route.ts or app/sitemap.xml/route.ts—that breaks the build (tool will reject it). (3) Improve only: meta title, description, og:image, og:title, og:description, robots in layout. Use write_file with FULL file content; use double quotes; never truncate. (4) BEFORE reporting success you MUST run "npm run build". Only report success if build passes. If build fails, fix the reported error or report failure. CRITICAL: .ts/.tsx/.js files must contain valid code only; never put plain text (e.g. User-agent: *) in a code file. Report what you changed.',
  'Sales Team (Lead Generation). YOU MUST: (1) Call scrape_leads() only. It uses EMPIRE_LEAD_SOURCE_URL (JSON API) or EMPIRE_LEAD_SCRAPE_URL (external directories only — never your own site). (2) Only if scrape_leads returns ok: true and leads_json with count > 0, call save_leads(leads_json) with that exact string — do NOT build or add any leads yourself; emails from your own domain (e.g. support@myapproved.com) are rejected by save_leads. (3) Draft outreach to docs/outreach-draft.md. (4) If scrape_leads fails or returns 0 leads, report: "No business leads. Set EMPIRE_LEAD_SOURCE_URL to a JSON API of real businesses, or EMPIRE_LEAD_SCRAPE_URL to external listing URLs (not your own site)."',
  'Ops Team (Website Maintenance). You may edit to fix build errors but must never introduce new errors. (1) Run "npm run build". (2) If it fails: read_file the FULL file, make the smallest fix, write_file the COMPLETE file (never truncate—same or more content). (3) Never use backslash-quote in file content; use normal double or single quotes. For apostrophes use double-quoted strings. For VERCEL_URL use "https://" + process.env.VERCEL_URL. (4) Only report success when build passes. Fix only app/, src/, components/, project root—never node_modules. Report what you fixed.',
  'Intel Team: Perform a competitor analysis. Research the top 3 UK tradesperson / job board sites (you can use your knowledge). Write a short report and use write_file to save it to docs/intel-competitor-report.md.',
];

function getTask(index) {
  const i = index >= 0 ? index % MASTER_ORDER.length : 0;
  return { index: i, instruction: MASTER_ORDER[i] };
}

function safeStringify(obj) {
  const seen = new Set();
  function replacer(key, value) {
    if (value !== null && typeof value === 'object') {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    if (typeof value === 'function' || (typeof value === 'object' && value !== null && (value.constructor?.name === 'HTMLButtonElement' || value.constructor?.name === 'FiberNode'))) return undefined;
    return value;
  }
  try {
    return JSON.stringify(obj, replacer);
  } catch (e) {
    return JSON.stringify({ error: 'Serialization failed', message: String(e.message) });
  }
}

async function chatWithTools(messages, apiKey, model, llmConfig) {
  const tools = getToolDefinitions();
  let iter = 0;
  let currentMessages = [...messages];

  while (iter < MAX_TOOL_ITERATIONS) {
    const maxTokens = parseInt(process.env.EMPIRE_WORKER_MAX_TOKENS, 10) || 2048;
    const body = {
      model: model || process.env.EMPIRE_LLM_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      messages: currentMessages,
      tools,
      tool_choice: 'auto',
      max_tokens: Math.min(4096, Math.max(512, maxTokens)),
    };

    let bodyStr;
    try {
      bodyStr = JSON.stringify(body);
    } catch (stringifyErr) {
      bodyStr = safeStringify(body);
      if (!bodyStr || bodyStr.startsWith('{"error"')) {
        console.error('[Empire Worker] JSON.stringify failed:', stringifyErr?.message);
        throw new Error('Request serialization failed. Try a shorter or simpler task.');
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    };
    if (OPENROUTER_URL === llmConfig.url) {
      headers['HTTP-Referer'] = process.env.NEXT_PUBLIC_APP_URL || 'https://khamareclarke.com';
    }
    let res;
    try {
      res = await fetch(llmConfig.url, {
        method: 'POST',
        headers,
        body: bodyStr,
      });
    } catch (fetchErr) {
      const msg = fetchErr?.message || String(fetchErr);
      const hint = /localhost:11434|127\.0\.0\.1:11434/.test(llmConfig.url)
        ? ' Is Ollama running? Start it (e.g. run "ollama run llama3.2" in a terminal). See docs/EMPIRE_WORKER_OLLAMA.md.'
        : '';
      throw new Error(`${llmConfig.name} request failed: ${msg}.${hint}`);
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`${llmConfig.name} ${res.status}: ${text.slice(0, 300)}`);
    }
    if (!contentType.includes('application/json')) {
      const snippet = text.slice(0, 200);
      throw new Error(`${llmConfig.name} returned HTML or non-JSON (content-type: ${contentType}). Often means API error page, rate limit, or wrong URL. Response start: ${snippet}`);
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`${llmConfig.name} response is not valid JSON (e.g. got HTML error page). ${parseErr.message}. Response start: ${text.slice(0, 150)}`);
    }
    const choice = data.choices && data.choices[0];
    if (!choice) throw new Error('No choices in response');
    const msg = choice.message || {};

    const content = msg.content != null ? String(msg.content) : null;
    const toolCalls = msg.tool_calls && Array.isArray(msg.tool_calls) ? msg.tool_calls.map((tc) => ({
      id: String(tc.id || ''),
      type: 'function',
      function: {
        name: String(tc.function?.name || ''),
        arguments: typeof tc.function?.arguments === 'string' ? tc.function.arguments : JSON.stringify(tc.function?.arguments || {}),
      },
    })) : [];

    currentMessages.push({
      role: 'assistant',
      content,
      tool_calls: toolCalls.length ? toolCalls : undefined,
    });

    if (toolCalls.length === 0) {
      return { finalMessage: content || '', messages: currentMessages };
    }

    for (let i = 0; i < toolCalls.length; i++) {
      const tc = toolCalls[i];
      const name = tc.function?.name || '';
      let args = {};
      try {
        args = JSON.parse(tc.function?.arguments || '{}');
      } catch (_) {}
      const argDesc = name === 'search_files' ? (args.query || '') : name === 'read_file' || name === 'write_file' ? (args.file_path || args.filePath) : name === 'list_dir' ? (args.dir_path ?? args.dirPath ?? '.') : name === 'run_command' ? (args.command || '') : '';
      console.log(`[Empire Worker] ${name} ${argDesc ? argDesc : ''}`);
      let result;
      try {
        result = executeToolCall(name, args);
        if (result && typeof result.then === 'function') result = await result;
      } catch (e) {
        result = { ok: false, error: e.message };
      }
      let resultStr;
      try {
        resultStr = JSON.stringify(result);
      } catch (stringifyErr) {
        resultStr = JSON.stringify({ ok: false, error: String(stringifyErr.message || 'Result not serializable') });
      }
      const maxToolResultChars = 16000;
      if (resultStr.length > maxToolResultChars && result && typeof result.content === 'string') {
        const truncated = result.content.slice(0, maxToolResultChars - 80) + '\n...[truncated for context]';
        resultStr = JSON.stringify({ ...result, content: truncated });
      }
      if (resultStr.length > 18000) {
        resultStr = JSON.stringify({ ok: false, error: 'Result too large for context limit. Read fewer or smaller files (e.g. only components/ui/button.tsx for button tasks).' });
      }
      currentMessages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: resultStr,
      });
    }
    iter++;
  }

  return { finalMessage: '(max tool iterations reached)', messages: currentMessages };
}

async function main() {
  const llmConfig = getWorkerLLMConfig();
  const apiKey = llmConfig.apiKey;
  if (!apiKey && llmConfig.url === OPENROUTER_URL) {
    console.error('Set OPENROUTER_API_KEY or EMPIRE_LLM_API_KEY in .env.local. Or set EMPIRE_LLM_API_URL (e.g. ZeroClaw/Ollama) and optional EMPIRE_LLM_API_KEY.');
    process.exit(1);
  }
  if (llmConfig.url !== OPENROUTER_URL) {
    console.log(`[Empire Worker] Using ${llmConfig.name} at ${llmConfig.url}`);
  }

  const taskIndex = parseInt(process.argv[2], 10) || 0;
  let instruction;
  const customTaskFile = process.env.EMPIRE_WORKER_CUSTOM_TASK_FILE;
  const customTaskEnv = process.env.EMPIRE_WORKER_CUSTOM_TASK;
  if (customTaskFile && fs.existsSync(customTaskFile)) {
    instruction = fs.readFileSync(customTaskFile, 'utf8').trim();
    console.log('[Empire Worker] Using custom task from file');
  } else if (customTaskEnv && customTaskEnv.trim()) {
    instruction = customTaskEnv.trim();
    console.log('[Empire Worker] Using custom task from env');
  } else {
    const t = getTask(taskIndex);
    instruction = t.instruction;
  }
  const projectId = process.env.EMPIRE_WORKER_PROJECT_ID || 'this project';

  console.log(`[Empire Worker] Project: ${projectId} | Task: ${instruction.slice(0, 80)}...`);

  const systemPrompt = `You are the Empire Supervisor. You are connected to the repository for: ${projectId}. You MUST PERFORM the user's task—do not just list steps or describe what you would do. Actually call the tools and make changes.

Tools: search_files, list_dir, read_file, write_file, run_command, save_leads(leads_json), fetch_leads(), scrape_leads(). Paths relative to project root. save_leads saves to dashboard; scrape_leads() gets leads from EMPIRE_LEAD_SOURCE_URL (JSON) or EMPIRE_LEAD_SCRAPE_URL (webpage emails). Target 500+ leads; then draft outreach with write_file (e.g. docs/outreach-draft.md).

CRITICAL — Perform the task:
- For SEO: ONLY edit app/layout.tsx (or app/layout.js) and public/robots.txt or public/sitemap.xml. NEVER create app/robots.txt/route.ts or app/sitemap.xml/route.ts—writing to those paths is blocked and breaks the build. Use public/ for static text files.
- For Lead Gen: call scrape_leads(). If ok, call save_leads(leads_json). Then write_file docs/outreach-draft.md. Never invent fake leads.
- For Maintenance: run_command("npm run build") if allowed, then read_file the failing files and write_file fixes. Do not create new route files with plain text.
- For UI text/color changes: call search_files with the visible phrase first, then read_file and write_file the correct file.

Do NOT guess generic components—use search_files for specific page text. Never put plain text (e.g. User-agent: *, Disallow:) into a .ts/.js/.tsx file—only valid code. Use the fewest read_file calls needed, then write_file.`;
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: instruction },
  ];

  try {
    const model = process.env.EMPIRE_LLM_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    const { finalMessage } = await chatWithTools(messages, apiKey, model, llmConfig);
    console.log('[Empire Worker] Result:', finalMessage?.slice(0, 500) || '(no text)');
    const logPath = path.join(process.cwd(), 'empire-worker-last.log');
    fs.writeFileSync(logPath, JSON.stringify({ taskIndex, instruction, result: finalMessage }, null, 2), 'utf8');
    console.log('[Empire Worker] Log written to', logPath);
  } catch (err) {
    console.error('[Empire Worker] Error:', err.message);
    process.exit(1);
  }
}

main();
