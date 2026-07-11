/**
 * Run an Empire task: uses ZeroClaw if ZEROCLAW_URL is set; otherwise uses OpenRouter (or LLM API) directly — no ZeroClaw install needed.
 */
import { getProjectLabel, getProjectRootUrl } from './empire-projects';
import { getSkillLabel } from './empire-skills';

const DEFAULT_TIMEOUT_MS = 90_000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';

/**
 * Build the prompt so the agent acts as the selected skill and performs the task.
 * @param {string} [contextFromPreviousAgent] - When running in handoff mode, previous agent's result to pass in.
 */
export function buildPrompt(projectId, agentId, taskDescription, contextFromPreviousAgent = '') {
  const projectName = getProjectLabel(projectId);
  const projectUrl = getProjectRootUrl(projectId) || '(no URL configured)';
  const skillLabel = getSkillLabel(agentId);

  const parts = [
    `You are the **${skillLabel}** agent for Empire.`,
    `Project: ${projectName} (${projectUrl})`,
    '',
    `Task: ${taskDescription}`,
  ];
  if (contextFromPreviousAgent && contextFromPreviousAgent.trim()) {
    parts.push('', '--- Context from previous agent in this chain ---', contextFromPreviousAgent.trim().slice(0, 6000), '--- End context ---', '');
  }
  parts.push('', 'Perform this task. Reply with a concise report or outcome: what you did or found, and any recommendations. End with a short summary.');
  return parts.join('\n');
}

/**
 * Run the task via OpenRouter (or any OpenAI-compatible API). No ZeroClaw install required.
 * Set OPENROUTER_API_KEY or EMPIRE_LLM_API_KEY in .env.local. Optional: OPENROUTER_MODEL or EMPIRE_LLM_MODEL.
 */
async function runTaskWithDirectLLM(projectId, agentId, taskDescription, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY;
  if (!apiKey) {
    throw new Error('Set OPENROUTER_API_KEY or EMPIRE_LLM_API_KEY in .env.local to run agents without ZeroClaw.');
  }

  const model = process.env.OPENROUTER_MODEL || process.env.EMPIRE_LLM_MODEL || DEFAULT_OPENROUTER_MODEL;
  const prompt = buildPrompt(projectId, agentId, taskDescription, options.contextFromPreviousAgent);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://khamareclarke.com',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter returned ${res.status}: ${errText.slice(0, 400)}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? data.message?.content ?? data.content;
    if (content != null) return String(content).trim();
    throw new Error('No content in LLM response');
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('LLM request timed out.');
    }
    throw e;
  }
}

/**
 * Parse SSE stream and return concatenated content from assistant messages.
 */
async function readSSEResponse(res) {
  const text = await res.text();
  const lines = text.split('\n');
  let content = '';
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const data = line.slice(5).trim();
      if (data === '[DONE]' || data === '') continue;
      try {
        const parsed = JSON.parse(data);
        if (parsed.content) content += parsed.content;
        if (parsed.text) content += parsed.text;
        if (parsed.delta?.content) content += parsed.delta.content;
      } catch (_) {
        // ignore non-JSON lines
      }
    }
  }
  return content || text.slice(0, 8000);
}

/**
 * Run the task: uses ZeroClaw if ZEROCLAW_URL is set; otherwise uses OpenRouter directly (no ZeroClaw install).
 * @param {string} projectId
 * @param {string} agentId
 * @param {string} taskDescription
 * @param {{ timeoutMs?: number }} options
 * @returns {Promise<string>}
 */
export async function runTaskWithZeroClaw(projectId, agentId, taskDescription, options = {}) {
  const hasOpenRouter = !!(process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY);
  const baseUrl = (process.env.ZEROCLAW_URL || process.env.ZERO_CLAW_URL || '').replace(/\/$/, '');

  // Prefer OpenRouter when key is set (no ZeroClaw install). Use ZeroClaw only when URL is set and no OpenRouter key.
  if (hasOpenRouter) {
    return runTaskWithDirectLLM(projectId, agentId, taskDescription, options);
  }
  if (!baseUrl) {
    throw new Error('Set OPENROUTER_API_KEY in .env.local (openrouter.ai) to run agents without ZeroClaw, or set ZEROCLAW_URL and run ZeroClaw.');
  }

  const url = `${baseUrl}/api/chat`;
  const prompt = buildPrompt(projectId, agentId, taskDescription, options.contextFromPreviousAgent);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    const isSSE = contentType.includes('text/event-stream') || res.headers.get('accept') === 'text/event-stream';

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`ZeroClaw returned ${res.status}: ${errText.slice(0, 500)}`);
    }

    if (isSSE) {
      return await readSSEResponse(res);
    }

    const data = await res.json();
    if (data.content != null) return String(data.content);
    if (data.text != null) return String(data.text);
    if (data.message?.content) return String(data.message.content);
    if (data.choices?.[0]?.message?.content) return String(data.choices[0].message.content);
    if (data.response) return String(data.response);
    return JSON.stringify(data).slice(0, 8000);
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('ZeroClaw request timed out. Increase timeout or check agent.');
    }
    const msg = e.message || String(e);
    if (msg === 'fetch failed' || e.cause?.code === 'ECONNREFUSED' || e.cause?.code === 'ENOTFOUND') {
      throw new Error(
        `Cannot reach ZeroClaw at ${baseUrl}. Check ZEROCLAW_URL in .env.local and that the ZeroClaw service is running. (${msg})`
      );
    }
    throw e;
  }
}
