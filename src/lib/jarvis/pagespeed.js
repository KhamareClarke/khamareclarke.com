/**
 * PageSpeed Insights connector — server-side only.
 * Env: PAGESPEED_API_KEY
 * Strategy: mobile (covers both mobile and desktop scores when requested).
 * 15-minute in-process TTL cache per URL.
 */

const PAGESPEED_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const CACHE_TTL_MS = 15 * 60 * 1000;

const urlCache = new Map();

/**
 * Returns structured PageSpeed data or null on failure.
 * @param {string} url  - The URL to audit (must be http/https).
 * @param {'mobile'|'desktop'} strategy
 */
export async function runPageSpeedAudit(url, strategy = 'mobile') {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    console.error('[pagespeed] PAGESPEED_API_KEY is not set.');
    return null;
  }

  const cacheKey = `${strategy}:${url}`;
  const cached = urlCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  try {
    const endpoint = new URL(PAGESPEED_API);
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('strategy', strategy);
    endpoint.searchParams.set('key', apiKey);
    // Request only the categories we need to keep response size small.
    endpoint.searchParams.append('category', 'PERFORMANCE');
    endpoint.searchParams.append('category', 'ACCESSIBILITY');
    endpoint.searchParams.append('category', 'BEST_PRACTICES');
    endpoint.searchParams.append('category', 'SEO');

    const res = await fetch(endpoint.toString(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.status === 429) {
      console.error('[pagespeed] Rate limit hit (429).');
      return null;
    }
    if (!res.ok) {
      console.error(`[pagespeed] HTTP ${res.status} from PageSpeed API.`);
      return null;
    }

    const json = await res.json();
    const lhr = json.lighthouseResult;
    if (!lhr) {
      console.error('[pagespeed] No lighthouseResult in response.');
      return null;
    }

    const cats = lhr.categories || {};
    const audits = lhr.audits || {};

    const score = (key) => {
      const s = cats[key]?.score;
      return s != null ? Math.round(s * 100) : null;
    };

    const metric = (key) => {
      const a = audits[key];
      if (!a) return null;
      return {
        displayValue: a.displayValue ?? null,
        numericValue: a.numericValue != null ? Math.round(a.numericValue) : null,
        score: a.score != null ? Math.round(a.score * 100) : null,
      };
    };

    // Top 3 failing opportunities (score < 0.9), sorted by impact (wastedMs desc).
    const opportunities = Object.values(audits)
      .filter(
        (a) =>
          a.details?.type === 'opportunity' &&
          a.score != null &&
          a.score < 0.9 &&
          (a.details?.overallSavingsMs ?? 0) > 0
      )
      .sort((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
      .slice(0, 3)
      .map((a) => ({
        title: a.title ?? null,
        description: a.description ?? null,
        savingsMs: Math.round(a.details?.overallSavingsMs ?? 0),
      }));

    const data = {
      url: json.id ?? url,
      strategy,
      fetchTime: lhr.fetchTime ?? null,
      scores: {
        performance: score('performance'),
        accessibility: score('accessibility'),
        bestPractices: score('best-practices'),
        seo: score('seo'),
      },
      vitals: {
        fcp: metric('first-contentful-paint'),
        lcp: metric('largest-contentful-paint'),
        tbt: metric('total-blocking-time'),
        cls: metric('cumulative-layout-shift'),
        si: metric('speed-index'),
        tti: metric('interactive'),
      },
      opportunities,
    };

    urlCache.set(cacheKey, { ts: Date.now(), data });
    return data;
  } catch (err) {
    console.error('[pagespeed] audit error:', err.message);
    return null;
  }
}
