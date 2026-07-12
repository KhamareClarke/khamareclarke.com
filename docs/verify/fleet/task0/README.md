# Task 0 — Central fleet ingest verify

## Prereqs

1. Run `supabase/migrations/fleet_events.sql` in the Supabase SQL Editor (khamareclarke hub).
2. Set `FLEET_INGEST_SECRET` in Vercel (khamareclarke) and locally in `.env.local`.
3. Deploy khamareclarke.com (or run `npm run dev` locally for local verify).

## curl — good bearer (expect 200)

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST "https://www.khamareclarke.com/api/fleet/ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FLEET_INGEST_SECRET" \
  -d '{"project":"test","event_type":"lead","summary":"curl test"}'
```

Expected: `{"ok":true,"id":"..."}` and HTTP 200.

## curl — wrong bearer (expect 401)

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST "https://www.khamareclarke.com/api/fleet/ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong-secret" \
  -d '{"project":"test","event_type":"lead","summary":"curl test"}'
```

Expected: `{"ok":false,"error":"Unauthorized"}` and HTTP 401.

## JARVIS verify

1. Open `/dashboard/jarvis` (admin login).
2. Toast should fire: **"New lead on test, sir."**
3. Ask JARVIS: **"any fleet events?"** — response must include the curl test row in **FLEET EVENTS (all projects)** block.

## Automated script

```bash
node docs/verify/fleet/task0/verify-ingest.mjs
```

Paste curl output + JARVIS response into this folder as evidence before marking Task 0 done.
