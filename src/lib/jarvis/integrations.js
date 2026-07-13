/**
 * JarvisIntegrations — background data engine for the JARVIS dashboard.
 * Server-side only (API routes / Route Handlers). Do not import from client components.
 *
 * Every method is independently error-isolated: a failed pipeline returns null / []
 * and logs a descriptive message without breaking the caller.
 */

const OPEN_METEO_BASE      = 'https://api.open-meteo.com/v1/forecast';
const COINGECKO_BASE       = 'https://api.coingecko.com/api/v3/simple/price';
const TODOIST_BASE         = 'https://api.todoist.com/rest/v2/tasks';
const NEWS_API_BASE        = 'https://newsapi.org/v2/top-headlines';
const COMPANIES_HOUSE_BASE = 'https://api.company-information.service.gov.uk';
const GOOGLE_CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

const WMO_CODES = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy rain showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm with hail',
};

export const JarvisIntegrations = {

  // ─── 1. Weather & Environment Pipeline (Open-Meteo) ───────────────────────
  //
  // No auth required. Default coords: Stoke-on-Trent, UK.
  // Returns: { temperature, windspeed, weathercode, condition } or null on failure.

  async getWeather({ latitude = 53.0027, longitude = -2.1794 } = {}) {
    try {
      const url = new URL(OPEN_METEO_BASE);
      url.searchParams.set('latitude',        latitude.toFixed(4));
      url.searchParams.set('longitude',       longitude.toFixed(4));
      url.searchParams.set('current_weather', 'true');
      url.searchParams.set('temperature_unit','celsius');
      url.searchParams.set('windspeed_unit',  'mph');
      url.searchParams.set('forecast_days',   '1');

      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) {
        console.error(`[JarvisIntegrations] Weather: HTTP ${res.status} from Open-Meteo.`);
        return null;
      }
      const data = await res.json();
      const cw   = data.current_weather;
      return {
        temperature: Math.round(cw.temperature),
        windspeed:   Math.round(cw.windspeed),
        weathercode: cw.weathercode,
        condition:   WMO_CODES[cw.weathercode] ?? 'Unknown',
      };
    } catch (err) {
      console.error('[JarvisIntegrations] Weather pipeline error:', err.message);
      return null;
    }
  },

  // ─── 2. Market & Asset Tracker (CoinGecko Public) ─────────────────────────
  //
  // No auth required on the free public tier.
  // Returns: raw CoinGecko price object or null on failure / rate-limit.

  async getMarketPrices({
    coins      = ['bitcoin', 'ethereum', 'solana'],
    currencies = ['usd', 'gbp'],
  } = {}) {
    try {
      const url = new URL(COINGECKO_BASE);
      url.searchParams.set('ids',              coins.join(','));
      url.searchParams.set('vs_currencies',    currencies.join(','));
      url.searchParams.set('include_24hr_change', 'true');

      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (res.status === 429) {
        console.error('[JarvisIntegrations] Market tracker: CoinGecko rate limit hit (429). Backing off.');
        return null;
      }
      if (!res.ok) {
        console.error(`[JarvisIntegrations] Market tracker: HTTP ${res.status} from CoinGecko.`);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error('[JarvisIntegrations] Market tracker pipeline error:', err.message);
      return null;
    }
  },

  // ─── 3. Task & Flow Synchronization Engine (Todoist REST v2) ──────────────
  //
  // Env: TODOIST_API_TOKEN
  // Returns: array of active task objects, or [] on failure / missing token.

  async getTasks() {
    const token = process.env.TODOIST_API_TOKEN;
    if (!token) {
      console.error('[JarvisIntegrations] Task sync: TODOIST_API_TOKEN is not set in environment.');
      return [];
    }
    try {
      const res = await fetch(TODOIST_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });
      if (res.status === 429) {
        console.error('[JarvisIntegrations] Task sync: Todoist rate limit hit (429). Backing off.');
        return [];
      }
      if (!res.ok) {
        console.error(`[JarvisIntegrations] Task sync: HTTP ${res.status} from Todoist.`);
        return [];
      }
      return await res.json();
    } catch (err) {
      console.error('[JarvisIntegrations] Task sync pipeline error:', err.message);
      return [];
    }
  },

  // ─── 4. Intelligence News Feed (NewsAPI) ───────────────────────────────────
  //
  // Env: NEWS_API_KEY (injected via X-Api-Key header — not a query param).
  // Returns: array of stripped article objects, or [] on failure / missing key.

  async getHeadlines({ country = 'gb', category = 'business', pageSize = 10 } = {}) {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.error('[JarvisIntegrations] News feed: NEWS_API_KEY is not set in environment.');
      return [];
    }
    try {
      const url = new URL(NEWS_API_BASE);
      url.searchParams.set('country',  country);
      url.searchParams.set('category', category);
      url.searchParams.set('pageSize', String(pageSize));

      const res = await fetch(url.toString(), {
        headers: {
          'X-Api-Key': apiKey,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });
      if (res.status === 429) {
        console.error('[JarvisIntegrations] News feed: NewsAPI rate limit hit (429). Backing off.');
        return [];
      }
      if (!res.ok) {
        console.error(`[JarvisIntegrations] News feed: HTTP ${res.status} from NewsAPI.`);
        return [];
      }
      const data = await res.json();
      return (data.articles || []).map(({ source, author, title, description, url: articleUrl, publishedAt }) => ({
        source:      source?.name ?? null,
        author:      author ?? null,
        title,
        description: description ?? null,
        url:         articleUrl,
        publishedAt,
      }));
    } catch (err) {
      console.error('[JarvisIntegrations] News feed pipeline error:', err.message);
      return [];
    }
  },

  // ─── 5. UK Corporate Registry Ingestion (Companies House API) ─────────────
  //
  // Env: COMPANIES_HOUSE_API_KEY
  // Auth: HTTP Basic — key as username, password blank: Authorization: Basic base64(key:)
  // Node.js Buffer.from used for reliable server-side base64 encoding.

  companiesHouse: {
    _authHeader() {
      const key = process.env.COMPANIES_HOUSE_API_KEY;
      if (!key) {
        console.error('[JarvisIntegrations] Companies House: COMPANIES_HOUSE_API_KEY is not set in environment.');
        return null;
      }
      return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
    },

    async searchCompanies(query) {
      const auth = this._authHeader();
      if (!auth) return [];
      try {
        const url = new URL(`${COMPANIES_HOUSE_BASE}/search/companies`);
        url.searchParams.set('q', query);

        const res = await fetch(url.toString(), {
          headers: { Authorization: auth, Accept: 'application/json' },
          cache: 'no-store',
        });
        if (res.status === 429) {
          console.error('[JarvisIntegrations] Companies House: rate limit hit (429). Backing off.');
          return [];
        }
        if (!res.ok) {
          console.error(`[JarvisIntegrations] Companies House search: HTTP ${res.status}.`);
          return [];
        }
        const data = await res.json();
        return data.items || [];
      } catch (err) {
        console.error('[JarvisIntegrations] Companies House search error:', err.message);
        return [];
      }
    },

    async getCompanyProfile(companyNumber) {
      const auth = this._authHeader();
      if (!auth) return null;
      try {
        const res = await fetch(
          `${COMPANIES_HOUSE_BASE}/company/${encodeURIComponent(companyNumber)}`,
          {
            headers: { Authorization: auth, Accept: 'application/json' },
            cache: 'no-store',
          }
        );
        if (res.status === 429) {
          console.error('[JarvisIntegrations] Companies House: rate limit hit (429). Backing off.');
          return null;
        }
        if (!res.ok) {
          console.error(`[JarvisIntegrations] Companies House profile: HTTP ${res.status} for ${companyNumber}.`);
          return null;
        }
        return await res.json();
      } catch (err) {
        console.error('[JarvisIntegrations] Companies House profile error:', err.message);
        return null;
      }
    },
  },

  // ─── 6. Google Workspace Agenda Synchronizer (Google Calendar API) ─────────
  //
  // Auth: OAuth 2.0 Bearer token passed by the caller (session-scoped — not stored here).
  // Quota: Calendar List costs 1 unit/request against the 1,000,000 unit/day free ceiling.
  // maxResults defaults to 5 to keep quota consumption minimal per call.

  googleCalendar: {
    async getUpcomingEvents(accessToken, maxResults = 5) {
      if (!accessToken) {
        console.error('[JarvisIntegrations] Google Calendar: accessToken is required. Pass the active OAuth token.');
        return [];
      }
      try {
        const url = new URL(GOOGLE_CALENDAR_BASE);
        url.searchParams.set('maxResults',    String(maxResults));
        url.searchParams.set('singleEvents',  'true');
        url.searchParams.set('orderBy',       'startTime');
        url.searchParams.set('timeMin',       new Date().toISOString());

        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
          cache: 'no-store',
        });
        if (res.status === 429) {
          console.error('[JarvisIntegrations] Google Calendar: quota limit hit (429). Protecting daily free-tier ceiling.');
          return [];
        }
        if (res.status === 401) {
          console.error('[JarvisIntegrations] Google Calendar: access token is expired or invalid (401). Re-authenticate.');
          return [];
        }
        if (!res.ok) {
          console.error(`[JarvisIntegrations] Google Calendar: HTTP ${res.status}.`);
          return [];
        }
        const data = await res.json();
        return (data.items || []).map(({ id, summary, description, start, end, location, htmlLink }) => ({
          id,
          summary:     summary ?? '(No title)',
          description: description ?? null,
          start:       start?.dateTime ?? start?.date ?? null,
          end:         end?.dateTime   ?? end?.date   ?? null,
          location:    location ?? null,
          link:        htmlLink ?? null,
        }));
      } catch (err) {
        console.error('[JarvisIntegrations] Google Calendar pipeline error:', err.message);
        return [];
      }
    },
  },
};
