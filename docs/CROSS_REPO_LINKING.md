# Cross-Repo Linking — Connect MyApproved, Flip Republic, etc. to Empire

This doc describes how external projects (MyApproved, Flip Republic, Leverage Academy, etc.) can trigger Empire so the 29 agents run for their project **without** using the Khamareclarke dashboard.

## 1. On Empire (Khamareclarke.com)

1. **Set webhook secret** in `.env.local` (and production env):
   ```bash
   EMPIRE_WEBHOOK_SECRET=your-long-random-secret-here
   ```
   Generate with: `openssl rand -hex 32`

2. **Webhook URL** (for external callers):
   - Production: `https://khamareclarke.com/api/empire/webhook/trigger`
   - Local: `http://localhost:3000/api/empire/webhook/trigger`

## 2. From an External Project (e.g. MyApproved, Flip Republic)

Call the webhook with:

- **Method:** `POST`
- **URL:** `https://khamareclarke.com/api/empire/webhook/trigger`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <EMPIRE_WEBHOOK_SECRET>`  
    or `X-Empire-Key: <EMPIRE_WEBHOOK_SECRET>`
- **Body (JSON):**
  - `projectId` (required) — one of: `myapproved`, `khamareclarke`, `omniwtms`, `leverageacademy`, `fliprepublic`, `leveragejournal`, `inboker`, `identitymarketing`, `adstarter`, `seoinforce`, `alkemmy`
  - `teamId` (optional) — `SALES_TEAM`, `GROWTH_TEAM`, `OPS_TEAM`, `INTEL_TEAM` (default: `SALES_TEAM`)
  - `taskDescription` (optional)
  - `runPending` (optional) — `true` to run all pending tasks for that project immediately after creating them

**Example (curl):**
```bash
curl -X POST https://khamareclarke.com/api/empire/webhook/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"projectId":"myapproved","teamId":"SALES_TEAM","runPending":true}'
```

**Example (Node.js in MyApproved repo):**
```js
const res = await fetch('https://khamareclarke.com/api/empire/webhook/trigger', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.EMPIRE_WEBHOOK_SECRET}`,
  },
  body: JSON.stringify({
    projectId: 'myapproved',
    teamId: 'SALES_TEAM',
    runPending: true,
  }),
});
const data = await res.json();
```

## 3. Script (any repo)

From the **Empire repo** you can trigger for any project using the shell script:

```bash
export EMPIRE_WEBHOOK_SECRET=your-secret
export EMPIRE_WEBHOOK_URL=https://khamareclarke.com/api/empire/webhook/trigger
./scripts/trigger-empire-from-project.sh myapproved SALES_TEAM 1
# Args: projectId, teamId, runPending (0 or 1)
```

Copy the script (or the curl call) into MyApproved, Flip Republic, etc., set the same `EMPIRE_WEBHOOK_SECRET` in their env, and run it from a cron or “Request Empire run” button.

## 4. Status

| Component           | Status |
|--------------------|--------|
| Skill definitions  | 100% — 29 skills in Empire repo |
| Cross-repo linking | **Active** — webhook `POST /api/empire/webhook/trigger` + secret; call from any project |
| Supervisor logic   | Done — `scripts/supervisor.js` + run-team, run-pending |
| Dashboard API      | Done — dashboard uses run-task, run-team, run-pending, rotate |
