/**
 * Companies House connector — server-side only.
 * HTTP Basic auth: COMPANIES_HOUSE_API_KEY env var.
 * 10-minute in-process TTL cache per query/company number.
 */

const BASE = 'https://api.company-information.service.gov.uk';
const CACHE_TTL_MS = 10 * 60 * 1000;

const searchCache = new Map();
const profileCache = new Map();

function authHeader() {
  const key = process.env.COMPANIES_HOUSE_API_KEY;
  if (!key) {
    console.error('[companies-house] COMPANIES_HOUSE_API_KEY is not set.');
    return null;
  }
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
}

async function chFetch(path) {
  const auth = authHeader();
  if (!auth) throw new Error('no-api-key');
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: auth, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (res.status === 429) throw new Error('rate-limit');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Returns the top search result item or null. */
export async function searchCompany(query) {
  const key = query.toLowerCase().trim();
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;
  try {
    const data = await chFetch(`/search/companies?q=${encodeURIComponent(query)}&items_per_page=1`);
    const item = data?.items?.[0] ?? null;
    searchCache.set(key, { ts: Date.now(), data: item });
    return item;
  } catch (err) {
    console.error('[companies-house] searchCompany error:', err.message);
    return null;
  }
}

export async function getCompanyProfile(companyNumber) {
  const cached = profileCache.get(companyNumber);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;
  try {
    const data = await chFetch(`/company/${encodeURIComponent(companyNumber)}`);
    profileCache.set(companyNumber, { ts: Date.now(), data });
    return data;
  } catch (err) {
    console.error('[companies-house] getCompanyProfile error:', err.message);
    return null;
  }
}

export async function getCompanyOfficers(companyNumber) {
  try {
    const data = await chFetch(
      `/company/${encodeURIComponent(companyNumber)}/officers?items_per_page=10`
    );
    return data?.items ?? [];
  } catch (err) {
    console.error('[companies-house] getCompanyOfficers error:', err.message);
    return [];
  }
}

export async function getPersonsWithSignificantControl(companyNumber) {
  try {
    const data = await chFetch(
      `/company/${encodeURIComponent(companyNumber)}/persons-with-significant-control?items_per_page=5`
    );
    return data?.items ?? [];
  } catch (err) {
    console.error('[companies-house] getPSC error:', err.message);
    return [];
  }
}

export async function getFilingHistory(companyNumber, itemsPerPage = 3) {
  try {
    const data = await chFetch(
      `/company/${encodeURIComponent(companyNumber)}/filing-history?items_per_page=${itemsPerPage}`
    );
    return data?.items ?? [];
  } catch (err) {
    console.error('[companies-house] getFilingHistory error:', err.message);
    return [];
  }
}
