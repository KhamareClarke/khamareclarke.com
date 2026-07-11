# How to set the lead source (real business leads only)

**MyApproved:** We target **all kinds of tradespersons around the globe** and **businesses that need tradespersons**. By default we **scrape Google Search** (no API key): for each search query we fetch the Google results page, extract links to business websites, then visit each site and scrape **emails and contact info** (phone/website saved in the lead payload). No API key or billing is required.

**Default behaviour:** Click **Fetch more leads** on the dashboard — we use a built-in list of queries (e.g. plumber London UK, electrician New York, property management Sydney) and scrape Google + business sites. No setup needed.

**Optional env:**  
- `EMPIRE_LEAD_SCRAPE_QUERIES` or `EMPIRE_GOOGLE_PLACES_QUERIES` = comma-separated search queries (overrides the default list).  
- `EMPIRE_LEAD_SCRAPE_MAX` = max leads per run (default 150, cap 300).

---

## (Optional) Google Places API key — only if you want API-based leads

1. **Open Google Cloud Console**  
   Go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Create or select a project**  
   Top bar: click the project name → **New Project** (e.g. "Empire Leads") or pick an existing one.

3. **Enable the Places API**  
   - Left menu: **APIs & Services** → **Library**.  
   - Search for **"Places API"**.  
   - Open **Places API** → click **Enable**.

4. **Create an API key**  
   - Left menu: **APIs & Services** → **Credentials**.  
   - Click **+ Create Credentials** → **API key**.  
   - Copy the key (you can restrict it later: **Edit API key** → set "API key restrictions" to **Places API** only).

5. **Add the key to your app**  
   - **Local:** In the Empire app folder, in **`.env.local`**, add:  
     `GOOGLE_PLACES_API_KEY=your_key_here`  
   - **Vercel:** Project → **Settings** → **Environment Variables** → add **GOOGLE_PLACES_API_KEY** with the same value → **Redeploy**.

6. **Billing (required for Places API)**  
   Google Cloud needs a billing account for Places API (there is a free tier; see [Places API pricing](https://developers.google.com/maps/billing-and-pricing)).  
   - **Billing** → **Link a billing account** (or create one).  
   You can set a budget/alert to avoid surprises.

If you add this key, the code can use the Places API as an alternative (currently the default is scraping Google Search with no API).

---

The Empire **Sales (Leads)** task will:
1. **Fetch or scrape** potential **business leads** (other companies, not your own)
2. **Save** them to the dashboard (`empire_leads`)
3. **Draft** an outreach email (`docs/outreach-draft.md`)

**Important:** We only save **real business lead emails** — e.g. other companies you want to contact. Emails from **your own domain** (e.g. `support@myapproved.com`) are **never** saved as leads; they are filtered out.

---

## Do NOT use your own site as the lead source

If you set `EMPIRE_LEAD_SCRAPE_URL_MYAPPROVED=https://myapproved.com`, the scraper only finds emails **on your site** (e.g. support@myapproved.com). That is **not** lead generation — it’s your own contact info. The system will exclude those and report **no leads**. For real leads, use one of the options below.

---

## Option A: JSON API (recommended for real business leads)

Set **`EMPIRE_LEAD_SOURCE_URL`** to a URL that returns **real business leads** (e.g. from a directory, CRM, or Google Maps export):

- Array: `[{ "email": "owner@otherbusiness.com", "name": "Other Business Ltd", "source": "directory" }, ...]`
- Or object: `{ "leads": [ ... ] }` / `{ "data": [ ... ] }`

Optional auth: **`EMPIRE_LEAD_SOURCE_AUTH`** = `Bearer YOUR_TOKEN`

---

## Option B: Scrape external pages (directories, listing sites)

Set **`EMPIRE_LEAD_SCRAPE_URL`** to **external** webpage URLs (comma-separated) — e.g. industry directories, Yellow Pages, or listing pages that show **other businesses’** emails. Do **not** use your own site URL.

**Per-project:** **`EMPIRE_LEAD_SCRAPE_URL_<PROJECT_ID>`**. Example for MyApproved (use directory/listing URLs, not myapproved.com):

```env
# Example: external directory pages (replace with real listing URLs)
EMPIRE_LEAD_SCRAPE_URL_MYAPPROVED=https://example-directory.com/plumbers-london,https://another-list.com/contractors
```

Global: **`EMPIRE_LEAD_SCRAPE_URL`** = comma-separated **external** URLs only.

Optional: **`EMPIRE_LEAD_SOURCE_AUTH`** is sent as `Authorization` if the pages require it.

---

## Where to set (local vs Vercel)

**Local** — In the Empire app repo, **`.env.local`**:

```env
# Option A (recommended): JSON API that returns real business leads
EMPIRE_LEAD_SOURCE_URL=https://your-api.com/leads/export
# EMPIRE_LEAD_SOURCE_AUTH=Bearer YOUR_TOKEN

# Option B: External directory/listing pages (NOT your own site)
# EMPIRE_LEAD_SCRAPE_URL_MYAPPROVED=https://directory.com/industry-list,https://listings.com/uk-businesses
# EMPIRE_LEAD_SCRAPE_URL=https://external-site.com/page1,https://external-site.com/page2
```

**Vercel** — Project → **Settings** → **Environment Variables** → add the same names and values → **Redeploy**.

---

## What the agent does

1. Calls **`scrape_leads()`** (tries JSON API first, then scrape URLs). Own-domain emails (e.g. *@myapproved.com) are never counted as leads.
2. Calls **`save_leads(leads_json)`** so only **real business** leads appear in the dashboard.
3. Writes **`docs/outreach-draft.md`** with a draft B2B outreach email (subject, body, CTA).

---

## Standalone tool: scrape emails from any URL

From the Empire app repo you can run a script that scrapes emails and prints JSON:

```bash
# One URL
node scripts/scrape-emails.js "https://example.com/contacts"

# Multiple URLs (comma-separated in one arg, or multiple args)
node scripts/scrape-emails.js "https://site.com/page1" "https://site.com/page2"

# Use env (same as EMPIRE_LEAD_SCRAPE_URL)
set EMPIRE_LEAD_SCRAPE_URL=https://example.com
node scripts/scrape-emails.js
```

Output is a JSON array of `{ "email", "name", "source": "scrape" }`. You can save to a file and import elsewhere, or the Sales task uses the same logic when **EMPIRE_LEAD_SCRAPE_URL** is set.

---

## Check it works

1. Set **EMPIRE_LEAD_SOURCE_URL** and/or **EMPIRE_LEAD_SCRAPE_URL**.
2. On the Empire dashboard, click **Run now** (or wait for the 6h auto run).
3. In **Auto runs (24h)** → Sales (Leads) row, **Findings** should show how many leads were saved.
4. In the repo, check **`docs/outreach-draft.md`** for the draft email.
