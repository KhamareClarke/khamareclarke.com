# Empire: From Chatbot to Worker — Technical Guide

**Status:** Agents today run in **Chat Mode** (LLM returns text; no file edits, no terminal). To get **Worker Mode** (agents that edit code, run scripts, fix SEO in repos), you need **Tool Calling + File System + Terminal** access.

---

## 1. Chat Mode vs Worker Mode

| | Chat Mode (current) | Worker Mode (target) |
|---|---------------------|------------------------|
| **What the agent does** | Returns a report or recommendations as text | Calls functions: read file, write file, run command |
| **Where it runs** | Web dashboard / API (OpenRouter) | Server script (Node.js or Python) with access to repo paths |
| **Output** | PDF, dashboard message | **Files changed**, **scripts run**, **DB updated** |
| **Example** | "Here’s how to fix the meta tag" | Agent calls `writeFile('myapproved/app/layout.tsx', content)` and the file is updated |

**Bottom line:** If the agent only talks, it’s a chatbot. If it can **read/write project files** and **run allowed commands**, it’s a worker.

---

## 2. The "How": Tool Calling + File System

To **execute** a task, the agent uses **tools** (functions the runtime runs for it):

- **Task:** "Update SEO for MyApproved."
- **Execution:** The agent issues a tool call, e.g. `write_file(path, content)`, and the runner **writes the file** in the repo. It does not just send a PDF.

You need:

1. **Tool definitions** — e.g. `read_file(path)`, `write_file(path, content)`, `run_command(cmd)`.
2. **Allowlists** — Only certain paths and commands are permitted (so the agent can’t overwrite anything or run arbitrary shell).
3. **A runner** — A script that calls the LLM with these tools, receives tool_calls, runs them, and sends results back until the task is done.

---

## 3. The Connection (The Bridge)

The agent must know **where the repos are** and be allowed to read/write there.

- **Command example:** "Agent, go to `./myapproved/` and set the header to Navy/Yellow."
- **Implementation:** Configure **allowed paths** (e.g. `projectredesigns/myapproved.com`, `projectredesigns/khamareclarke.com-main`). The worker script runs with a **workspace root**; all `read_file` / `write_file` paths are resolved under that root and checked against the allowlist.

---

## 4. The Supervisory Loop (The "General")

The Supervisor should run a **loop**, not wait for you to click "Run" every time:

1. **Read** — Scan the project (or read queue / health).
2. **Act** — Decide what’s wrong (e.g. missing SEO tag, broken link).
3. **Execute** — Call tools to fix it (write file, run script).
4. **Repeat** — Loop on a schedule (e.g. every hour) or continuously.

So: **Check status → Find problem → Execute fix → Repeat.**

---

## 5. Give the Agent "Terminal" Access (Safely)

For lead-gen, deploys, or scrapers, the agent needs to run **allowed** commands:

- **Example:** Run a Python scraper, save results to DB, then ping the dashboard.
- **Implementation:** Define a tool `run_command(cmd)`. Only commands in an **allowlist** (e.g. `node scripts/lead-gen.js`, `python scripts/scrape.py`) are executed. Everything else is refused.

---

## 6. Fiza’s Quick Start: 4 Steps to Execution

1. **Environment** — Run the agent as a **server or cron job** (Node.js or Python), not only in the web chat. Use `scripts/empire-worker.js` (or equivalent).
2. **Permissions** — Set **allowed paths** (and optionally allowed commands) in config or env. The worker must have read/write access to those folders.
3. **Functions** — Implement **SaveFile** and **RunCommand** (and ReadFile) as **tools** the LLM can call. Pass these tools to the model in the API request.
4. **First task** — Ask the agent: *"Open myapproved/app/layout.tsx and set the page background to #0F172A."* If the file on disk changes, the agent has **executed** a task.

---

## 7. Master Order (Initial Execution Flows)

The Supervisor should drive these **without** you assigning each step by hand:

| Team | Initial flow |
|------|----------------|
| **Growth** | Technical SEO audit on all 11 repos; rewrite meta tags in code. |
| **Sales** | Scrape potential leads for MyApproved (e.g. 500); sync to dashboard. |
| **Ops** | Apply Bento Box Navy/Yellow UI to MyApproved homepage code. |
| **Intel** | Competitor analysis on top 3 UK tradesperson sites; report to dashboard. |

If the agent keeps asking "what to do next?", the **Supervisor loop** is not finished: the Supervisor should always choose the next task from a queue or a fixed list (e.g. Master Order).

---

## 8. What’s in This Repo for Worker Mode

- **`config/worker.json`** (optional) — `allowed_paths`, `allowed_commands`, `workspace_root`. Overridden by env.
- **`src/lib/empire-tools.js`** — `readFile`, `writeFile`, `runCommand` with allowlists. Used by the worker.
- **`scripts/empire-worker.js`** — One cycle: load task from Master Order → call OpenRouter with tools → execute tool_calls → log to `empire-worker-last.log`. Run via cron for a 24/7 loop.

**Quick run (from repo root):**
```bash
# Allow current repo (and optionally sibling repos) for file access
export EMPIRE_WORKER_ALLOWED_PATHS="/path/to/khamareclarke.com-main,/path/to/myapproved.com"
export OPENROUTER_API_KEY=your_key
node scripts/empire-worker.js 0
# Task 0 = Growth (SEO). Task 1 = Sales, 2 = Ops, 3 = Intel.
```

Set **EMPIRE_WORKER_ALLOWED_PATHS** (comma-separated absolute paths) so the worker can read/write only those folders. Set **EMPIRE_WORKER_ALLOWED_COMMANDS** (comma-separated) to allow specific terminal commands; if empty, `run_command` denies all.

---

## 9. Summary

- **Chat mode** = agent returns text (reports, suggestions). **Worker mode** = agent **changes files** and **runs commands** via tools.
- **Bridge** = allowed repo paths + tool implementations (read/write/run).
- **Loop** = Check → Find problem → Execute fix → Repeat (scheduled or continuous).
- **Goal** = 24/7 workforce: SEO, lead gen, maintenance, brand checks — without you handing every single task to the agent.
