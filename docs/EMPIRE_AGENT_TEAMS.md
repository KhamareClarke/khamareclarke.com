# Empire Agent Teams — What the Agent Does

The Empire worker (agent) runs from the dashboard and performs tasks by team. After editing code, the agent can commit and push changes to the repo.

**Auto 24h runs:** Growth (SEO), Sales (Leads), and Ops (Maintenance) also run **automatically every 24 hours** (no user action). The cron job calls `/api/empire/cron/run-auto-24h` daily at midnight UTC. Each run is logged to the supervisor feed with `task_type: auto_24h`. On the dashboard, see the **Auto runs (24h)** section for logs and use **Run 24h loop now** to trigger the same sequence manually. Set `EMPIRE_AUTO_24H_PROJECT_ID` (e.g. `myapproved`) to choose which project the auto run uses.

---

## Continuous SEO (Growth Team)

- **Scan all websites daily** — Check each project in the fleet for SEO health.
- **Find missing or weak SEO elements** — Missing meta tags, weak titles, thin content, broken structure.
- **Automatically update meta tags, titles, and SEO code** — Apply fixes in the repo (e.g. `layout.tsx`, `metadata`, sitemaps, Open Graph).

Use the **Growth** task preset or a custom task like “audit SEO and fix meta tags for [site]”.

---

## Lead Generation (Sales Team)

- **Scrape potential business leads** — From configured sources (e.g. directories, search, APIs). Only **real** leads; the agent must not invent or fabricate leads (e.g. Company1, contact@company1.com).
- **Collect around 500+ leads regularly** — Target volume when real data is available.
- **Save leads to the dashboard/database** — Write to `empire_leads` via the `save_leads` tool. Only call it with leads from real scraping or real data.
- **Draft outreach emails** — Generate personalized outreach copy for leads.

Use the **Sales** task preset. To get real leads, set **EMPIRE_LEAD_SOURCE_URL** (in `.env.local` or your deployment env) to a URL that returns a JSON array of leads, e.g. `[{ "email": "a@b.com", "name": "Acme", "source": "directory" }]`. The agent will call `fetch_leads()` then `save_leads(leads_json)`. Optional: **EMPIRE_LEAD_SOURCE_AUTH** for an `Authorization` header. Without this URL, the agent reports "No real leads" and does not save fake data.

---

## Website Maintenance (Ops Team)

- **Scan websites for bugs, broken links, or errors** — Crawl pages, check links, run build/lint.
- **Automatically fix code issues** — Apply patches for build errors, lint, type errors.
- **Update UI when needed** — Implement small UI/UX changes (e.g. button styles, header/footer) from task descriptions.

Use the **Ops** task preset or quick tasks (e.g. “hide homepage buttons”, “header to navy”). The agent edits the repo and can push; use “Auto-fix build” when Vercel build fails.

---

## Running the Agent

1. Open the Empire dashboard → **Worker** section.
2. Select **Connected to repo** (project).
3. Choose a **Task preset** (Growth / Sales / Ops / Intel) or type a **custom task**.
4. Click **Run worker (edit code)**. Result and log appear below.
5. Optionally **Commit & push to repo** to deploy changes.

No Cursor integration is required; the agent performs code edits and fixes from the dashboard.
