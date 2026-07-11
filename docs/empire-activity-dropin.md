# Empire User Activity — drop-in for sister projects

Send end-user events (sign-in, sign-up, audit, payment, etc.) from any project to the Empire hub.
They show up live on `https://khamareclarke.com/dashboard/empire/activity`.

## 1. Set environment variables in the sister project

| Variable | Value | Notes |
| --- | --- | --- |
| `EMPIRE_HUB_URL` | `https://www.khamareclarke.com` | The Empire hub. **Use the `www.` host** so there is no redirect — `fetch` strips the Authorization header on cross-origin redirects. |
| `EMPIRE_INGEST_SECRET` | (long random string) | **Same** value as on khamareclarke. Keep it secret. |
| `EMPIRE_PROJECT_ID` | e.g. `seoinforce`, `myapproved`, `leveragejournal` | Slug used in the Empire dashboard. |

The hub itself needs:

| Variable | Value |
| --- | --- |
| `EMPIRE_INGEST_SECRET` | same long random string as above |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | already set on khamareclarke |

## 2. Drop-in helper (JavaScript, no dependencies)

Save this as `src/lib/empire-activity.js` (works in any Next.js / Node project):

```js
const PROJECT_ID = process.env.EMPIRE_PROJECT_ID || 'unknown';

function clientIp(req) {
  if (!req || !req.headers) return null;
  const get = (h) => (typeof req.headers.get === 'function' ? req.headers.get(h) : req.headers[h]);
  const xf = get('x-forwarded-for');
  if (xf) return String(xf).split(',')[0].trim();
  return get('x-real-ip') || null;
}

/** Follow redirects manually so the Authorization header is not stripped on cross-origin 3xx. */
async function fetchPreservingAuth(url, init, maxHops = 3) {
  let current = url;
  for (let hop = 0; hop <= maxHops; hop += 1) {
    const res = await fetch(current, { ...init, redirect: 'manual' });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) return res;
      current = new URL(loc, current).toString();
      continue;
    }
    return res;
  }
  throw new Error(`Too many redirects (>${maxHops}) from ${url}`);
}

export async function emitEmpireActivity(input = {}) {
  try {
    const url = (process.env.EMPIRE_HUB_URL || '').trim().replace(/\/$/, '');
    const secret = process.env.EMPIRE_INGEST_SECRET;
    if (!url || !secret) return;

    const body = {
      project_id: PROJECT_ID,
      event_type: input.event_type,
      status: input.status || (String(input.event_type || '').endsWith('_failed') ? 'failed' : 'ok'),
      user_email: input.user_email || null,
      user_id: input.user_id || null,
      user_name: input.user_name || null,
      source: input.source || 'web',
      message: input.message,
      metadata: input.metadata || {},
      ip: clientIp(input.request),
      user_agent: input.request && input.request.headers
        ? (typeof input.request.headers.get === 'function'
            ? input.request.headers.get('user-agent')
            : input.request.headers['user-agent']) || null
        : null,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    await fetchPreservingAuth(`${url}/api/empire/activity/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).catch(() => undefined);
    clearTimeout(timer);
  } catch {
    /* best-effort telemetry; never throws */
  }
}
```

## 3. Use it from your API routes

```js
import { emitEmpireActivity } from '@/lib/empire-activity';

export async function POST(request) {
  // ... auth logic ...

  void emitEmpireActivity({
    event_type: 'signin',
    user_email: user.email,
    user_id: user.id,
    user_name: user.full_name,
    request, // for IP + user-agent
  });

  // ... return response ...
}
```

## 4. Allowed event types

- `signin`, `signin_failed`
- `signup`, `signup_failed`
- `verify_email`
- `password_reset_request`, `password_reset_complete`
- `project_created`
- `audit_started`, `audit_completed`, `audit_failed`
- `payment_succeeded`, `payment_failed`
- `subscription_created`, `subscription_cancelled`
- `lead_created`
- `logout`
- `custom`

## 5. Wired projects

| Project | Slug (`EMPIRE_PROJECT_ID`) | Events emitted |
| --- | --- | --- |
| Seoinforce.com | `seoinforce` | sign-in, sign-up, verify-email, sign-out, project created, audits, Stripe checkout / renew / cancel |
| AdsStarter.com | `adsstarter` | sign-in, sign-in-failed, sign-up (verified), verify-email, logout |
| Identimarketing.com | `identitymarketing` | sign-in, sign-in-failed, sign-up (verified), verify-email, logout |
| inboker.com | `inboker` | sign-in, sign-in-failed, sign-up (welcome-email) |
| Omniwtms.com | `omniwtms` | sign-in (client / courier / customer), sign-in-failed, sign-up (org), sign-up-failed |
| leveragejournal.com | `leveragejournal` | sign-in (magic-code), sign-up (OTP-verified), sign-in-failed, verify-email |
| LeverageAcademy.com | `leverageacademy` | verify-email, sign-in-failed, lead_created (course applications) |
| myapproved.com | `myapproved` | lead_created (public lead form), sign-up (tradesperson registration) |
| FlipRepublic.com | `fliprepublic` | sign-up (buyers + sellers, role in metadata) |
| alkhemmy.com | `alkemmy` | password_reset_request, password_reset_complete |

### Required env vars on every wired project

```
EMPIRE_HUB_URL=https://www.khamareclarke.com
EMPIRE_INGEST_SECRET=<shared with khamareclarke.com>
EMPIRE_PROJECT_ID=<slug from the table above>
```

To wire another project, copy `lib/empire-activity.ts` (TypeScript) from any wired project, set the env vars above, then sprinkle `void emitEmpireActivity({...})` into the routes you care about. The hub does the rest.
