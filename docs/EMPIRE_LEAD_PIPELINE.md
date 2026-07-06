# Empire Lead Pipeline: Scrape → Save → Draft → Send

Automation flow for **lead scraping**, **saving to the dashboard**, **drafting outreach emails**, and **sending emails**.

---

## Pipeline overview

```
Scrape Leads (Maps / URLs / API)
       ↓
Store in empire_leads (Supabase)
       ↓
Draft outreach (worker writes docs/outreach-draft.md)
       ↓
Send outreach emails (Resend API)
       ↓
Mark contacted (payload.contacted)
       ↓
Dashboard shows Total / New today / Contacted
       ↓
Repeat (cron every 6h or hourly)
```

---

## 1. Lead scraping (find potential clients)

**Sources you can use:**

| Source        | How in Empire |
|---------------|----------------|
| **Your site** | Set `EMPIRE_LEAD_SCRAPE_URL_MYAPPROVED=https://myapproved.com` → Sales task scrapes emails from pages. |
| **JSON API**  | Set `EMPIRE_LEAD_SOURCE_URL=https://your-api.com/leads` → returns `[{ email, name, source }]`. |
| **Google Maps** | Run `node scripts/empire-scrape-googlemaps.js "web design agency uk"` (requires `npm install puppeteer`). Output is JSON; pipe to your import or paste into a JSON file and use an import API. |
| **Yelp / directories** | Scrape via Puppeteer or use their API if available; output same JSON shape and save with `save_leads` or import API. |

**Scraper script (Google Maps):**

```bash
npm install puppeteer
export SEARCH_QUERY="plumbers London"
node scripts/empire-scrape-googlemaps.js
```

Output: `[{ "name", "rating", "placeUrl", "source": "google_maps" }]`. Add email/phone by opening each place URL and scraping (or use a service). For email-only scraping from websites, use `scripts/scrape-emails.js` or the Sales task with `EMPIRE_LEAD_SCRAPE_URL`.

---

## 2. Save leads to database

- **From the Empire worker (Sales task):** The agent calls `scrape_leads()` then `save_leads(leads_json)` → leads go to **empire_leads** in Supabase.
- **From a script:** POST the JSON to your app’s import endpoint, or use Supabase client to insert into `empire_leads` with columns: `project_id`, `source`, `email`, `name`, `payload` (optional: `contacted` in payload for outreach tracking).

Schema shape per lead: `{ name, email, website?, phone?, source }`. Dashboard reads from `empire_leads`.

---

## 3. Draft outreach emails

The **Sales (Leads)** task already drafts an outreach email and writes it to **`docs/outreach-draft.md`** (subject, body, CTA). You can use that template or edit it. For **per-lead** personalisation, use the send-outreach API (it builds a short template per lead).

---

## 4. Send outreach emails automatically

**API:** `POST /api/empire/leads/send-outreach`

- Body (optional): `{ "projectId": "myapproved", "limit": 50 }`
- Fetches uncontacted leads from **empire_leads** (where `payload.contacted` is not set).
- Sends one outreach email per lead via **Resend** (subject: “Quick idea to improve your website”).
- Sets `payload.contacted = true` and `payload.contacted_at` so they are not sent again.

**Env:** `RESEND_API_KEY`, and optionally `FROM_EMAIL` or `RESEND_FROM`.

**Example (run daily or hourly):**

```bash
curl -X POST https://your-app.vercel.app/api/empire/leads/send-outreach \
  -H "Content-Type: application/json" \
  -d '{"projectId":"myapproved","limit":50}'
```

---

## 5. Dashboard

The **Empire dashboard** already shows:

- **Leads** (from `empire_leads`)
- **New leads (24h / 48h)**

To show **Contacted** count, you can filter in the dashboard where `payload.contacted === true`, or add a DB column `contacted` (see migration `empire_leads_contacted.sql`).

---

## 6. Automation loop (cron)

**Every 6 hours (already in place):**

1. Cron hits `/api/empire/cron/run-auto-24h` → runs **Growth (SEO)**, **Sales (Leads)**, **Ops (Maintenance)** for MyApproved.
2. Sales runs `scrape_leads()` → `save_leads()` → writes `docs/outreach-draft.md`.

**Add a separate cron to send outreach (e.g. daily):**

- Schedule: `0 9 * * *` (9:00 UTC).
- Request: `POST /api/empire/leads/send-outreach` with `{ "projectId": "myapproved", "limit": 50 }`.

So: **scrape + save + draft** = every 6h; **send emails** = once per day (or hourly if you prefer).

---

## 7. Daily targets

- **Scrape:** 500+ leads/day → use multiple scrape URLs or run the Google Maps scraper for several queries and merge into `empire_leads`.
- **Send:** 50–100 emails/day → call send-outreach with `limit: 50` once or twice per day.
- **Store:** All data in **empire_leads**; dashboard shows totals and new leads.

---

## Quick checklist

1. Set **EMPIRE_LEAD_SCRAPE_URL_MYAPPROVED** (or **EMPIRE_LEAD_SOURCE_URL**) so Sales can scrape/fetch leads.
2. Run **Run now** or wait for cron → leads are saved and draft is in `docs/outreach-draft.md`.
3. Set **RESEND_API_KEY** (and **FROM_EMAIL** if needed).
4. Call **POST /api/empire/leads/send-outreach** on a schedule (e.g. daily) to send 50–100 outreach emails and mark leads contacted.
5. (Optional) Run **scripts/empire-scrape-googlemaps.js** for Google Maps leads and import the JSON into `empire_leads` or feed it into your lead source URL.
