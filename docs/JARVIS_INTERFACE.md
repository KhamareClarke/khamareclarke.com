# JARVIS interface — WhatsApp → ZeroClaw → Portal

This document defines the external contract for updating client portal state from
outside the site (WhatsApp bots, ZeroClaw agents, GHL automations). It is the
canonical description of the "Jarvis" surface: read GHL, post status updates,
kick off monthly reports.

Everything is served by this Next.js app running on Vercel. No separate service.

---

## 1. Client-status webhook

**Endpoint:** `POST /api/empire/webhook/client-status`
**Auth:** `Authorization: Bearer <EMPIRE_WEBHOOK_SECRET>`
(also accepted: `X-Empire-Key`, `X-Webhook-Secret`)

**Request body (application/json):**
```json
{
  "client_id": "e2c1c7c0-...",
  "project_id": "6a3f9c4e-...",
  "status_update": "Kicked off keyword refresh — first 20 clusters clustered, sending shortlist tomorrow.",
  "new_status": "active"
}
```

| Field | Required | Notes |
|---|---|---|
| `client_id` | yes | `profiles.id` (= `auth.users.id`). |
| `project_id` | yes | `client_projects.id`. Must belong to `client_id`. |
| `status_update` | yes | Free text. Prepended (dated) to `client_projects.notes`. |
| `new_status` | no | `active` \| `paused` \| `completed`. Omit to leave unchanged. |

**Success response (200):**
```json
{ "ok": true, "projectId": "6a3f9c4e-...", "status": "active" }
```

**Errors:**
- `401` — bad/missing bearer secret
- `400` — bad body / invalid status
- `403` — `project_id` does not belong to `client_id`
- `404` — project not found
- `503` — `EMPIRE_WEBHOOK_SECRET` unset or Supabase service role unset

**Side effects:**
- Prepends `[<ISO ts>] <status_update>` to `client_projects.notes` (max 8000 chars).
- Updates `client_projects.status` if `new_status` was provided.
- Writes one row to `empire_supervisor_log` so it appears in the Empire supervisor feed.

The next time the client loads `/portal`, they see the note and status change on the project card.

---

## 2. WhatsApp → ZeroClaw → webhook flow

Intended pipeline (all steps are external to this repo, except the webhook target):

```
WhatsApp (Khamare)
  └─→ Twilio / Meta WhatsApp webhook
        └─→ ZeroClaw router agent (parses intent)
              ├─→ read GHL: uses GHL_API_KEY directly
              ├─→ post status: POST /api/empire/webhook/client-status
              └─→ trigger report: POST /api/empire/webhook/trigger
                    with { projectId: "khamareclarke", teamId: "client-report", taskDescription: '{"client_id":"...","project_id":"..."}' }
```

The ZeroClaw agent is the "Jarvis" persona. It should:

1. **Match the client** — resolve the free-text mention ("Sarah at Acme") to
   a `profiles.id` by searching `full_name` or `company` via a Supabase view.
2. **Match the project** — pick the most recently updated `client_projects` row
   for that client, or ask the operator to disambiguate.
3. **Read GHL state** — call the GHL v1 API (`GHL_API_KEY` env var).
   - Contact:       `GET https://rest.gohighlevel.com/v1/contacts/{contactId}`
   - Opportunities: `GET /pipelines/opportunities/search?contactId={id}`
   - Appointments:  `GET /appointments/?contactId={id}`
   Or delegate: `GET /api/admin/ghl?contactId={id}` (admin session required).
4. **Post the update** — POST to `/api/empire/webhook/client-status` (see §1).
5. **(Optional) Trigger a report** — see §3.

---

## 3. Trigger a monthly client report

Two ways to run the `client-report` skill.

### 3a. Direct admin call
`POST /api/admin/reports/generate` (admin session required — used by the
"Generate monthly report" button on `/dashboard/clients/[id]`).

Body: `{ "client_id": "...", "project_id": "..." }`
Response: `{ ok, text, at }` — also written to `client_projects.last_report_text/at`.

### 3b. Via Empire task runner (webhook-triggerable)
Insert an `empire_tasks` row with:
```
agent_id: 'client-report'
task_description: '{"client_id":"<uuid>","project_id":"<uuid>"}'
project_id: 'khamareclarke'
```
Then hit `POST /api/empire/run-pending` (or use the dashboard "Run pending"
button). `executeOneTask` recognises `client-report`, calls `generateClientReport`,
stores the output on the project row, and marks the task done.

This is the code path that WhatsApp → ZeroClaw uses when the operator says
"send Sarah her monthly update".

---

## 4. Client-report format

`empire-client-report.js` builds a prompt containing:
- Project name, status, tier.
- Last 10 `empire_tasks` in the last 30 days (`status`, `agent_id`, description).
- Lead count from `empire_leads` in the last 30 days.
- GHL snapshot: pipeline stage, opportunity count, next appointment.

Model instructions ask for 4–6 short paragraphs, no headings, no bullet points,
no markdown. Direct "this month we…" tone. This is written to
`client_projects.last_report_text` and read out both on the admin detail page
and (in future work) the client portal project card.

---

## 5. Env vars used by this interface

| Var | Purpose |
|---|---|
| `EMPIRE_WEBHOOK_SECRET` | Bearer for `/api/empire/webhook/*` — including client-status. |
| `GHL_API_KEY` | GoHighLevel REST v1 key. If unset, all GHL data is `null` and the portal shows "Connect GoHighLevel" placeholder chips. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required by the webhook to update `client_projects`. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Standard Supabase config. |
| `OPENROUTER_API_KEY` or `EMPIRE_LLM_API_KEY` | LLM used by `client-report` (and the rest of Empire). |

---

## 6. Failure modes / rules

- The webhook is **fail-closed**: no `EMPIRE_WEBHOOK_SECRET` → 503. Never anonymous.
- All external state (GHL, LLM) is optional. If any of them is down/missing, the
  portal renders the placeholder chip and the report generator surfaces the
  underlying error via the standard `empire_tasks.result_message` field.
- The client-status webhook validates the (client_id, project_id) pair — a
  ZeroClaw agent that gets the mapping wrong hits 403, not silent corruption.
