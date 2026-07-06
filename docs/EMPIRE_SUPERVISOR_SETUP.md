# K-Empire Supervisor — Setup & Verification

## Directive verification (PRIORITY EXECUTION — DONE)

| Requirement | Status |
|-------------|--------|
| **teams.json** at central config (supervisor_id, 11 domains, 4 teams, 29 skills) | Done — `config/teams.json` matches directive (GROWTH 8, SALES 7, OPS 7, INTEL 7). |
| Supervisor script that reads teams.json and orchestrates team activation | Done — `scripts/supervisor.js` + `POST /api/empire/supervisor/run-team`. |
| Live activity feed: “Supervisor: Delegating … to Team Growth” | Done — Supervisor log on dashboard. |
| No 8 separate manual triggers — one command activates full team | Done — Run SALES/GROWTH/OPS/INTEL creates all tasks; **Run all pending** runs them. |
| Master Agent handoff (lead-gen → cold-email → sales-copy) | Done — **Run pending (handoff)** runs in team order and passes each result to the next. |
| 24/7 autonomy — reassign to next domain when one is done | Done — **Rotate to next project** + cron: rotate then run-pending. |
| Activate Sales Team on MyApproved first | Done — Select MyApproved, click Run SALES, then Run all pending. |
| Visible output / current work on dashboard | Done — **Current work** (pending/running/done by project), Supervisor log, Tasks given, Fleet status. |
| 29-agent structure (exact skill IDs from directive) | Done — `config/teams.json` + `src/lib/empire-skills.js` use the 29 skills. |

*Environment sync (29 skill folders symlinked to 11 projects): not used — single Next.js app serves all 11 domains; no per-repo symlinks.*

---

## What’s in place

- **config/teams.json** — Central config: 11 domains, 4 teams (GROWTH_TEAM, SALES_TEAM, OPS_TEAM, INTEL_TEAM), each with skill IDs that match the agents in `src/lib/empire-skills.js`.
- **Dashboard** (`/dashboard/empire`) — **Run team** (creates pending tasks), **Run all pending** / **Run pending (handoff)** (executes pending tasks; handoff passes each result to the next), **Rotate to next project** (24/7 queue), **Current work** (pending/running/done by project), **Supervisor log** feed, **Live Fleet Status**, **Tasks given** (Run, Download PDF).
- **API**
  - `POST /api/empire/run-task` — Run one task (OpenRouter/ZeroClaw); optional `contextFromPreviousAgent` for handoff.
  - `POST /api/empire/run-pending` — Run all pending tasks. Body: `{ projectId?, limit?, handoff? }`. With `handoff: true`, runs in team skill order and passes each result to the next agent (same project).
  - `POST /api/empire/supervisor/run-team` — Create one pending task per skill in a team; writes to `empire_supervisor_log`.
  - `POST /api/empire/supervisor/rotate` — Pick next domain in config order and run team for it (default SALES_TEAM). Body: `{ teamId? }`. For 24/7 autonomy, call from cron after run-pending.
  - **`POST /api/empire/webhook/trigger`** — **Cross-repo linking.** Secure webhook for MyApproved, Flip Republic, etc. Headers: `Authorization: Bearer <EMPIRE_WEBHOOK_SECRET>` or `X-Empire-Key: <secret>`. Body: `{ projectId, teamId?, runPending? }`. See `docs/CROSS_REPO_LINKING.md`.
- **scripts/supervisor.js** — CLI: `node scripts/supervisor.js run-team <projectId> <teamId> [taskDescription]`. Set `NEXT_PUBLIC_APP_URL` or `VERCEL_URL` for production.
- **Supabase**
  - `empire_tasks`, `empire_agent_activity`, `empire_supervisor_log`, `empire_project_analysis`, `empire_leads` (for Leads section).

## One-time setup

1. **Supabase**  
   Run in SQL Editor (same project as `empire_leads` / `empire_reports`):

   - `supabase/migrations/empire_tasks.sql` (if not already run)
   - `supabase/migrations/empire_agent_activity_and_supervisor_log.sql`
   - `supabase/migrations/empire_project_analysis.sql` (for Fleet analysis — live status for all projects)

2. **Env** (e.g. `.env.local`):

   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for run-task and run-team APIs)
   - Run agents: `OPENROUTER_API_KEY` (no install; openrouter.ai) or `ZEROCLAW_URL` (e.g. `http://localhost:42617`) so “Run” on a task actually runs the agent.

3. **Optional: ZeroClaw**  
   Only if using ZEROCLAW_URL. If OPENROUTER_API_KEY is set, agents run via OpenRouter; no ZeroClaw. Otherwise run ZeroClaw (e.g. `cargo run`) so the dashboard “Run” button can call it.

## Fleet analysis (all projects, live)

- On the Empire dashboard, use **Fleet analysis — all projects**: click **Run full analysis (all 11 projects)**.
- OpenRouter analyzes each project (health, SEO, marketing) and the table updates **live** (every few seconds) as each project completes.
- Results are stored in `empire_project_analysis` and shown in the Fleet analysis table (project, status, last updated, summary).

## Priority: MyApproved Sales first

- Choose project **MyApproved**, click **Run SALES** to create pending tasks.  
- Click **Run all pending** to execute them in one go, or **Run pending (handoff)** to run in team order and pass each agent’s output to the next.  
- **Current work** shows pending/running/done tasks by project; task results (including lead-gen/cold-email output) appear in **Tasks given**.

## Cross-repo / “connection” to all projects

- The dashboard already lists all 11 projects in **Fleet** (with links to each site) and in the **Project** dropdown.  
- Assigning a task or running a team **is** the connection: you select project (e.g. MyApproved, Omni WTMS, Flip Republic) and the task/team runs for that project’s context (URL and name are passed to ZeroClaw).  
- No per-project repo wiring is required; one Khamareclarke.com dashboard + one ZeroClaw instance serve all 11 domains.

## Optional: cron or scheduler (24/7 autonomy)

1. **Rotate then run pending** — Assign the next domain and execute all pending tasks:

```bash
# Rotate: assign SALES_TEAM to next project in queue
curl -X POST https://khamareclarke.com/api/empire/supervisor/rotate -H "Content-Type: application/json" -d '{"teamId":"SALES_TEAM"}'

# Run all pending tasks (optionally with handoff)
curl -X POST https://khamareclarke.com/api/empire/run-pending -H "Content-Type: application/json" -d '{"handoff":true}'
```

2. **Run team for one project** (e.g. daily):

```bash
NEXT_PUBLIC_APP_URL=https://khamareclarke.com node scripts/supervisor.js run-team myapproved SALES_TEAM "Daily lead gen"
```

Then call **Run all pending** from the dashboard, or trigger `POST /api/empire/run-pending` from your scheduler.

## Worker Mode (agents as workers: file system + tools)

Dashboard and run-task today are **Chat Mode** (LLM returns text only). For agents to **execute** (edit repo files, run scripts), use **Worker Mode**:

- **`docs/EMPIRE_WORKER_MODE.md`** — Full guide: Chat vs Worker, 4 steps, Master Order, loop.
- **`scripts/empire-worker.js`** — Runs one task with **tool calling** (`read_file`, `write_file`, `run_command`). Set `EMPIRE_WORKER_ALLOWED_PATHS` and `OPENROUTER_API_KEY`; run with `node scripts/empire-worker.js [0-3]`.
- **`src/lib/empire-tools.js`** — Tool implementations with allowlists. **`config/worker.json`** — Optional allowed_paths / allowed_commands.

This moves agents from “chat only” to “can edit code and run commands” on the allowed paths.
