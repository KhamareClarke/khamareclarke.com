/**
 * GoHighLevel REST API v1 connector.
 * Env: GHL_API_KEY (set in Vercel — leave unset in local dev to skip GHL calls).
 * Cache: 5-minute in-memory cache per contactId. Cache is per Node process,
 * so on Vercel each cold-started function gets its own; that is fine — TTL is
 * short and API is idempotent.
 *
 * All calls fail closed: any network/auth/parse error returns null, callers
 * render a placeholder.
 */

const BASE = 'https://rest.gohighlevel.com/v1';
const TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map(); // contactId -> { data, expiresAt }

function apiKey() {
  return process.env.GHL_API_KEY || '';
}

async function ghlFetch(path) {
  const key = apiKey();
  if (!key) return null;
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    // Vercel edge cache off; we manage cache in-process.
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GHL ${path} ${res.status}`);
  return res.json();
}

/**
 * Create a contact in GoHighLevel via the v1 API. Fails closed: any
 * network/auth/parse error returns null, never throws.
 * @param {object} data - { firstName, lastName, email, phone, tags?, customField? }
 */
export async function createGHLContact(data = {}) {
  const key = apiKey();
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}/contacts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.warn('[ghl] create contact failed', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('[ghl] create contact failed', err?.message);
    return null;
  }
}

export async function getGHLContact(contactId) {
  if (!contactId) return null;
  try {
    const data = await ghlFetch(`/contacts/${encodeURIComponent(contactId)}`);
    return data?.contact || data || null;
  } catch (err) {
    console.warn('[ghl] contact fetch failed', err?.message);
    return null;
  }
}

export async function getGHLOpportunities(contactId) {
  if (!contactId) return [];
  try {
    // v1 opportunities are pipeline-scoped; the "search by contact" endpoint works
    // across all pipelines. Fall back to /pipelines only if v2 auth is later added.
    const data = await ghlFetch(`/pipelines/opportunities/search?contactId=${encodeURIComponent(contactId)}`);
    return data?.opportunities || data?.data || [];
  } catch (err) {
    console.warn('[ghl] opportunities fetch failed', err?.message);
    return [];
  }
}

export async function getGHLAppointments(contactId) {
  if (!contactId) return [];
  try {
    const data = await ghlFetch(`/appointments/?contactId=${encodeURIComponent(contactId)}`);
    const appts = data?.appointments || data?.data || [];
    return appts
      .filter((a) => a.startTime || a.start_time)
      .sort((a, b) => {
        const ta = new Date(a.startTime || a.start_time).getTime();
        const tb = new Date(b.startTime || b.start_time).getTime();
        return ta - tb;
      });
  } catch (err) {
    console.warn('[ghl] appointments fetch failed', err?.message);
    return [];
  }
}

/**
 * Aggregate call: returns { contact, opportunities, appointments } for a given
 * contactId, or null when GHL_API_KEY is unset / contactId is null.
 * 5-minute in-memory cache per contactId. Always safe to call.
 */
export async function getClientGHLData(contactId) {
  if (!apiKey() || !contactId) return null;
  const now = Date.now();
  const cached = cache.get(contactId);
  if (cached && now < cached.expiresAt) return cached.data;

  try {
    const [contact, opportunities, appointments] = await Promise.all([
      getGHLContact(contactId),
      getGHLOpportunities(contactId),
      getGHLAppointments(contactId),
    ]);
    const data = { contact, opportunities, appointments };
    cache.set(contactId, { data, expiresAt: now + TTL });
    return data;
  } catch (err) {
    console.warn('[ghl] aggregate fetch failed', err?.message);
    return null;
  }
}

/**
 * Invalidate a cached contact (e.g. after a webhook update).
 */
export function invalidateGHLCache(contactId) {
  if (contactId) cache.delete(contactId);
  else cache.clear();
}
