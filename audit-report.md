# khamareclarke.com — Dashboard Audit

**Audit date:** 2026-07-08  
**Repo:** khamareclarke.com-main  
**Stack:** Next.js 13 · Supabase · Vercel  
**Verdict:** ⚠ REBUILD RECOMMENDED

---

## 🔴 PRIORITY: Live Security — Dashboard Route Protection (Production)

> **CRITICAL:** `middleware.js` returns `Response.next()` with an empty matcher (`[]`). No route is protected by Next.js middleware. Every dashboard route below is reachable by the public without authentication **right now**.

| Route | Auth Check? | Protection Status | Risk |
|---|---|---|---|
| `/login` | N/A | PUBLIC (intended) | Default password `admin123` if env var not set |
| `/onboarding` | None | **PUBLIC (unintended)** | Anyone can access — no auth gate |
| `/dashboard` | Client-side JS only | PARTIAL | JS can be disabled; page HTML served to unauthenticated users |
| `/dashboard/empire` | **None** | **UNPROTECTED** | Empire OS fully accessible — lead data, agent controls, git push |
| `/dashboard/empire/activity` | **None** | **UNPROTECTED** | Live feed of user emails, IPs, payments across all projects — fully public |
| `/api/auth/login` | N/A (is login) | PUBLIC (intended) | No rate limit, brute-forceable |
| `/api/submissions` GET | `isAuthenticated()` ✓ | PROTECTED | Correct |
| `/api/submissions` POST | None | PUBLIC (intentional) | Contact forms — open write is correct |
| `/api/onboarding` GET | `isAuthenticated()` ✓ | PROTECTED | Correct |
| `/api/onboarding` POST | None | PUBLIC | Anyone can insert fake records |
| `/api/empire/worker/run` | **None** | **UNPROTECTED** | CRITICAL — runs LLM code-editing agent against repos |
| `/api/empire/worker/push` | **None** | **UNPROTECTED** | CRITICAL — git commit and push; anyone can trigger if env var enabled |
| `/api/empire/leads/send-outreach` | **None** | **UNPROTECTED** | Anyone can trigger mass emails from your Gmail |
| `/api/empire/activity/list` | **None** | **UNPROTECTED** | Exposes emails, IPs, user activity across all projects |
| `/api/empire/supervisor/run-team` | **None** | **UNPROTECTED** | Anyone can fire agent teams |
| `/api/empire/run-task` | **None** | **UNPROTECTED** | Consumes LLM credits; open to anyone |
| `/api/empire/cron/*` | **None** | **UNPROTECTED** | Cron endpoints publicly triggerable |
| `/api/empire/analyze-all` | **None** | UNPROTECTED | Triggers fleet analysis |
| `/api/empire/fleet-status` | **None** | UNPROTECTED | Exposes project intelligence |
| `/api/empire/webhook/trigger` | Bearer `EMPIRE_WEBHOOK_SECRET` ✓ | PROTECTED | Correct (if secret is set) |
| `/api/empire/activity/ingest` | Bearer `EMPIRE_INGEST_SECRET` ✓ | PROTECTED | Correct (if secret is set) |

---

## At-a-Glance Scorecard

| Metric | Count |
|---|---|
| Features Working | 2 |
| Features Partial | 3 |
| Features Broken / Dead | 4 |
| Connectors Configured | 2 |
| Connectors Missing Credentials | 6 |
| Hardcoded Secrets Found | 1 |
| Unprotected API Routes | 10 |
| Client Login System | 0 |

---

## Codebase Boundary

### Public Marketing Site
- `/` (homepage), `/about`, `/services/*`, `/expertise/*`
- `/glossary`, `/glossary/[term]`
- `/blog`, `/blog/[slug]`
- `/case-studies`, `/locations`, `/business-bundle`
- `/privacy-policy`, `/terms`, `/sitemap-page`
- `/api/send`, `/api/send-email` (contact forms)
- `/api/submissions` POST (form intake)
- `/api/chat` (AI chatbot)

### Control Panel / Dashboard
- `/login`
- `/dashboard` (leads + onboarding viewer)
- `/dashboard/empire` (Empire OS control)
- `/dashboard/empire/activity` (user event feed)
- `/onboarding` (client intake form)
- `/api/auth/*` (login, logout, check)
- `/api/submissions` GET, `/api/onboarding` GET + POST
- `/api/empire/*` (29+ AI agent routes)
- `src/lib/auth.js`, `src/lib/supabase.js`, `src/lib/empire-*.js`
- `middleware.js` (empty), `scripts/empire-*.js`
- `supabase/migrations/*`, `config/teams.json`, `config/worker.json`
- `.agents/skills/*` (29 skill definitions), `docs/EMPIRE_*.md`

---

## Identity & Stack

| Aspect | Detail |
|---|---|
| Framework | Next.js 13.4.15 (App Router) — 3 major versions behind (15.x is current) |
| Language | JavaScript (no TypeScript) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS 3.3.3 + custom design tokens |
| Package manager | npm |
| Hosting | Vercel (crons in `vercel.json`) |
| Run locally | `npm install && npm run dev` — may fail due to `@empire/bridge` local path dependency |

---

## Auth System

| Aspect | Detail |
|---|---|
| Login mechanism | Single admin password → HMAC-SHA256 cookie token. No username, no roles, no sessions table. |
| Password location | Env var `ADMIN_PASSWORD`. Fallback: `'admin123'` hardcoded at `src/lib/auth.js:4`, `src/app/api/auth/login/route.js:5`, `src/app/api/auth/check/route.js:5` |
| User database | **None.** No users table. One password, one person. |
| Role system | **None.** Admin only. No client role. |
| Session expiry | 24 hours (httpOnly cookie) |
| Middleware protection | **Absent.** `middleware.js` does nothing. Matcher is `[]`. |
| Dashboard auth | Client-side JS redirect on `/dashboard` only. `/dashboard/empire` and `/dashboard/empire/activity` have **zero auth check**. |
| How to create admin | Set `ADMIN_PASSWORD=yourpassword` in Vercel env vars. No "create user" flow. |
| Brute force protection | None |

---

## Connectors & Credentials

| Service | Env Var(s) | Configured? | Notes |
|---|---|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Partial | App degrades gracefully without it; Empire needs all three |
| OpenRouter / LLM | `OPENROUTER_API_KEY`, `EMPIRE_LLM_API_KEY` | Not set | Workers 500 without this |
| Gmail SMTP | `EMAIL_USER`, `EMAIL_PASS` | Not set | Outreach route returns 500 |
| Vercel API | `VERCEL_TOKEN`, `VERCEL_PROJECT_ID_*` | Not set | Falls back to manual paste mode |
| ZeroClaw | `ZEROCLAW_URL` | Placeholder only | Not functional unless installed |
| PageSpeed Insights | `PAGESPEED_API_KEY` | Set in `.env.local` | Gitignored — OK |
| Resend | `RESEND_API_KEY` | Unknown | Package installed, contact form route exists |
| @empire/bridge | `file:../shared/empire-bridge` | **Broken** | Local path dep won't exist on Vercel — build may fail |
| GoHighLevel | N/A | **Not built** | Zero references in codebase |
| WhatsApp | N/A | **Not built** | Zero references in codebase |

---

## Security Findings

| Finding | Location | Severity | Fix |
|---|---|---|---|
| Default admin password `'admin123'` hardcoded as fallback | `src/lib/auth.js:4`, `src/app/api/auth/login/route.js:5`, `src/app/api/auth/check/route.js:5` | **CRITICAL** | Set `ADMIN_PASSWORD` in Vercel. Remove the `\|\| 'admin123'` fallback. |
| 10+ Empire API routes callable by anyone on the internet | `src/app/api/empire/*/route.js` | **CRITICAL** | Add `isAuthenticated()` or cron-secret check to every Empire route |
| `env.local` (no dot prefix) committed to git | `env.local` (root) | Medium | Currently empty — add to `.gitignore` as a precaution |
| `EMPIRE_INGEST_SECRET` / `EMPIRE_WEBHOOK_SECRET` — if not set, endpoints are non-functional (safe-fail) | API routes | Medium | Set both secrets before connecting sister projects |
| No rate limiting on `/api/auth/login` | `src/app/api/auth/login/route.js` | Medium | Add Vercel Edge rate limiting or Upstash ratelimit |
| `/api/onboarding` POST open — anyone can insert fake records | `src/app/api/onboarding/route.js:33` | Low–Medium | Add email validation + honeypot or CAPTCHA |

---

## Feature Inventory (Dashboard / Control Panel)

| Feature | Route(s) | Status | Notes |
|---|---|---|---|
| Admin login | `/login`, `/api/auth/*` | **WORKING** | Single-password login works end-to-end |
| Client intake form (onboarding) | `/onboarding` | **WORKING** | 4-step form saves to Supabase. Publicly accessible — no client account tied to submission |
| Leads & submissions viewer | `/dashboard` | **PARTIAL** | UI works; client-side auth only; requires Supabase for data |
| Empire OS control panel | `/dashboard/empire` | **PARTIAL** | Extensive UI — needs Supabase + OpenRouter + Gmail; no auth check on page |
| User activity feed | `/dashboard/empire/activity` | **PARTIAL** | Needs Supabase service role; no auth check on page |
| AI agent task runner (29 skills) | `/api/empire/run-task` | **BROKEN** | Requires `OPENROUTER_API_KEY`; also unauthenticated |
| Empire worker (code editing + git push) | `/api/empire/worker/*` | **BROKEN** | Needs LLM key; on Vercel cannot access local repo; unauthenticated |
| Lead scraping + outreach | `/api/empire/leads/*` | **BROKEN** | Needs Gmail SMTP creds + lead source URL |
| SEO auto-improvement cron | `/api/empire/cron/seo-myapproved` | **BROKEN** | Cannot run `npm run build` in external repo from Vercel |
| Fleet status view | `/api/empire/fleet-status` | **PARTIAL** | Works if Supabase configured; publicly accessible |
| Client portal (per-client login) | N/A | **MISSING** | Does not exist |
| Contract / document storage | N/A | **MISSING** | No file upload, no document model |
| GoHighLevel live project status | N/A | **MISSING** | Zero code references |

---

## Gap Analysis — Target Capabilities

| Capability | Status | What Exists | Shortest Build Path |
|---|---|---|---|
| Client onboarding with their own login | **MISSING** | Single admin password only | Supabase Auth (already imported) + `profiles` table. 2–3 days |
| Intake questions / forms | **PARTIAL** | `/onboarding` form exists, saves to Supabase, not linked to client account | Add `user_id` FK to `onboarding_clients`, gate page behind session. 1 day |
| Contracts & documents stored per client | **MISSING** | Nothing | Supabase Storage + `documents` table + upload component. 2–3 days |
| Live project status from GoHighLevel | **MISSING** | Nothing | GHL REST API → Next.js route → client dashboard widget. 2–4 days |
| Central view across all projects | **PARTIAL** | Empire OS dashboard exists, needs creds and auth fix | Configure env vars + fix auth. 1–2 days |
| Empire OS / ZeroClaw / WhatsApp | **PARTIAL** | Empire infrastructure is the strongest part. No WhatsApp. | ZeroClaw: set URL + test. WhatsApp: Twilio/Meta Cloud API. 3–5 days for WhatsApp |

---

## Verdict

The marketing site half of this repo is clean and solid — the SEO content machine, glossary, services, and blog are production-ready and should not be touched. The "control panel" layer is not a sound foundation for what you need. It is a personal admin panel for one person (you), built around a single hardcoded password, where the Empire OS automation routes — including a live code-editing agent and a git-push endpoint — are completely unauthenticated and reachable by anyone on the internet right now. There is no concept of a client, no user table, no role system, no document storage, and no GoHighLevel integration.

**Recommendation: Rebuild the portal layer on your existing Supabase + Next.js stack.** You already have all the right pieces — Supabase Auth (magic links, OAuth, email+password), Supabase Storage for documents, and the Next.js App Router. The rebuild is not starting from scratch: the public site stays untouched, the onboarding UI is reusable, and the Empire OS infrastructure (agent skills, supervisor, task runner) is the strongest part of the codebase and should be secured and preserved, not discarded.

### Top 5 Next Actions

1. **TODAY — Set `ADMIN_PASSWORD` in Vercel env vars.** Remove the `|| 'admin123'` fallback from `src/lib/auth.js:4`, `src/app/api/auth/login/route.js:5`, and `src/app/api/auth/check/route.js:5`. Takes 10 minutes.

2. **TODAY — Add `isAuthenticated()` to every `/api/empire/*` route** (or a shared wrapper). Cron routes should check a `CRON_SECRET` header instead. Until this is done, anyone can trigger code editing, git pushes, and mass emails from your server.

3. **THIS WEEK — Fix middleware protection.** Populate the middleware matcher with `/dashboard/:path*` and add server-side auth checks. `/dashboard/empire` and `/dashboard/empire/activity` must be protected.

4. **THIS WEEK — Migrate auth to Supabase Auth.** Drop the single-password system. Use Supabase's built-in auth with email+password or magic link. This gives you a real users table and unlocks the client portal entirely.

5. **NEXT SPRINT — Build client portal data model:** `profiles`, `client_projects`, `documents` tables in Supabase → add `user_id` FK to `onboarding_clients` → add GoHighLevel API connector → wire project status to client dashboard view.
