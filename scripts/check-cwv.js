#!/usr/bin/env node
/**
 * Core Web Vitals checker using PageSpeed Insights API v5.
 *
 * Usage:
 *   node scripts/check-cwv.js <url> [mobile|desktop|both]
 *
 * Examples:
 *   node scripts/check-cwv.js https://khamareclarke.com
 *   node scripts/check-cwv.js https://khamareclarke.com both
 *   PAGESPEED_API_KEY=... node scripts/check-cwv.js https://khamareclarke.com/glossary/seo
 *
 * Reads PAGESPEED_API_KEY from .env.local automatically.
 * Exit code 0 = all Core Web Vitals pass. Exit code 1 = one or more fail.
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Load .env.local ──────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

// ── Core Web Vitals thresholds ────────────────────────────────────────────────

const THRESHOLDS = {
  lcp:  { good: 2500,  ni: 4000,  unit: 'ms',  label: 'LCP  (Largest Contentful Paint)' },
  inp:  { good: 200,   ni: 500,   unit: 'ms',  label: 'INP  (Interaction to Next Paint)' },
  cls:  { good: 0.1,   ni: 0.25,  unit: '',    label: 'CLS  (Cumulative Layout Shift)' },
  fcp:  { good: 1800,  ni: 3000,  unit: 'ms',  label: 'FCP  (First Contentful Paint)' },
  ttfb: { good: 800,   ni: 1800,  unit: 'ms',  label: 'TTFB (Time to First Byte)' },
  si:   { good: 3400,  ni: 5800,  unit: 'ms',  label: 'SI   (Speed Index)' },
};

const CWV_KEYS = ['lcp', 'inp', 'cls'];

function rating(key, value) {
  const t = THRESHOLDS[key];
  if (value === null) return 'N/A';
  if (value <= t.good) return 'GOOD';
  if (value <= t.ni)   return 'NEEDS IMPROVEMENT';
  return 'POOR';
}

function colour(r) {
  if (r === 'GOOD') return '\x1b[32m';
  if (r === 'NEEDS IMPROVEMENT') return '\x1b[33m';
  if (r === 'POOR') return '\x1b[31m';
  return '\x1b[90m';
}

const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';
const DIM   = '\x1b[2m';

// ── API call ──────────────────────────────────────────────────────────────────

function fetchPSI(url, strategy, apiKey) {
  return new Promise((resolve, reject) => {
    const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('strategy', strategy);
    endpoint.searchParams.set('category', 'performance');
    if (apiKey) endpoint.searchParams.set('key', apiKey);

    https.get(endpoint.toString(), (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid JSON response from PSI API'));
        }
      });
    }).on('error', reject);
  });
}

// ── Extract metrics ───────────────────────────────────────────────────────────

function extractMetrics(data) {
  const lhr = data.lighthouseResult;
  if (!lhr) throw new Error(data.error?.message || 'No lighthouseResult in response');

  const audits = lhr.audits;
  const perf   = Math.round((lhr.categories?.performance?.score ?? 0) * 100);

  function ms(id) {
    const a = audits[id];
    if (!a || a.numericValue == null) return null;
    return Math.round(a.numericValue);
  }

  function raw(id) {
    const a = audits[id];
    if (!a || a.numericValue == null) return null;
    return a.numericValue;
  }

  // Field data (CrUX) — may not exist for low-traffic pages
  const field = data.loadingExperience?.metrics ?? {};

  function fieldMetric(key) {
    const m = field[key];
    if (!m) return null;
    return { p75: m.percentile, category: m.category };
  }

  return {
    perfScore: perf,
    lab: {
      lcp:  ms('largest-contentful-paint'),
      inp:  ms('interaction-to-next-paint'),
      cls:  +(raw('cumulative-layout-shift')?.toFixed(3) ?? null),
      fcp:  ms('first-contentful-paint'),
      ttfb: ms('server-response-time'),
      si:   ms('speed-index'),
    },
    field: {
      lcp:  fieldMetric('LARGEST_CONTENTFUL_PAINT_MS'),
      inp:  fieldMetric('INTERACTION_TO_NEXT_PAINT'),
      cls:  fieldMetric('CUMULATIVE_LAYOUT_SHIFT_SCORE'),
      fcp:  fieldMetric('FIRST_CONTENTFUL_PAINT_MS'),
    },
  };
}

// ── Render ────────────────────────────────────────────────────────────────────

function formatValue(key, value) {
  if (value === null) return DIM + 'n/a' + RESET;
  const t = THRESHOLDS[key];
  return t.unit === 'ms' ? `${value}ms` : String(value);
}

function printResult(strategy, metrics) {
  const { perfScore, lab, field } = metrics;
  const scoreColour = perfScore >= 90 ? '\x1b[32m' : perfScore >= 50 ? '\x1b[33m' : '\x1b[31m';

  console.log(`\n${BOLD}── ${strategy.toUpperCase()} ──────────────────────────────────────────${RESET}`);
  console.log(`${BOLD}Performance score:${RESET} ${scoreColour}${BOLD}${perfScore}/100${RESET}\n`);

  console.log(`${BOLD}  Core Web Vitals (lab data)${RESET}  ${DIM}← determines pass/fail${RESET}`);
  console.log(`  ${'─'.repeat(62)}`);

  let allCwvPass = true;

  for (const key of ['lcp', 'inp', 'cls', 'fcp', 'ttfb', 'si']) {
    const value  = lab[key];
    const r      = rating(key, value);
    const isCwv  = CWV_KEYS.includes(key);
    const pass   = r === 'GOOD';
    if (isCwv && !pass && value !== null) allCwvPass = false;

    const label   = THRESHOLDS[key].label;
    const vStr    = formatValue(key, value);
    const rStr    = colour(r) + r + RESET;
    const cwvMark = isCwv ? `${BOLD}★${RESET}` : ' ';

    console.log(`  ${cwvMark} ${label.padEnd(38)} ${vStr.padStart(8)}   ${rStr}`);
  }

  // Field data if available
  const hasField = Object.values(field).some(Boolean);
  if (hasField) {
    console.log(`\n${BOLD}  Field data (CrUX — real-user 75th percentile)${RESET}`);
    console.log(`  ${'─'.repeat(62)}`);
    const fieldMap = { lcp: 'LCP', inp: 'INP', cls: 'CLS', fcp: 'FCP' };
    for (const [key, label] of Object.entries(fieldMap)) {
      const f = field[key];
      if (!f) continue;
      const catColour = f.category === 'FAST' ? '\x1b[32m' : f.category === 'AVERAGE' ? '\x1b[33m' : '\x1b[31m';
      const catLabel  = f.category === 'FAST' ? 'GOOD' : f.category === 'AVERAGE' ? 'NEEDS IMPROVEMENT' : 'POOR';
      const vStr = key === 'cls'
        ? String(+(f.p75 / 100).toFixed(3))
        : `${f.p75}ms`;
      console.log(`    ${label.padEnd(5)} p75 ${vStr.padStart(8)}   ${catColour}${catLabel}${RESET}`);
    }
  } else {
    console.log(`\n  ${DIM}Field data (CrUX): not enough traffic for real-user data${RESET}`);
  }

  console.log(`\n  ${BOLD}★ = Core Web Vital${RESET}`);
  return allCwvPass;
}

// ── JSON output for programmatic use ─────────────────────────────────────────

function buildJson(url, results) {
  return {
    url,
    timestamp: new Date().toISOString(),
    results: Object.fromEntries(
      results.map(({ strategy, metrics, pass }) => [
        strategy,
        { perfScore: metrics.perfScore, lab: metrics.lab, field: metrics.field, cwvPass: pass },
      ])
    ),
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const [,, urlArg, strategyArg = 'mobile', ...flags] = process.argv;

  if (!urlArg || urlArg === '--help' || urlArg === '-h') {
    console.log(`Usage: node scripts/check-cwv.js <url> [mobile|desktop|both] [--json]`);
    process.exit(0);
  }

  const apiKey    = process.env.PAGESPEED_API_KEY;
  const jsonMode  = flags.includes('--json') || strategyArg === '--json';
  const strategies = strategyArg === 'both' ? ['mobile', 'desktop']
    : strategyArg === 'desktop'             ? ['desktop']
    : ['mobile'];

  if (!apiKey) {
    console.warn('Warning: PAGESPEED_API_KEY not set. Requests will be rate-limited (1 req/2 min).');
  }

  if (!jsonMode) {
    console.log(`\n${BOLD}PageSpeed Insights — Core Web Vitals${RESET}`);
    console.log(`URL: ${DIM}${urlArg}${RESET}`);
    console.log(`Fetching ${strategies.join(' + ')} data...`);
  }

  const allResults = [];
  let overallPass = true;

  for (const strategy of strategies) {
    try {
      const data    = await fetchPSI(urlArg, strategy, apiKey);
      const metrics = extractMetrics(data);
      const pass    = jsonMode ? true : printResult(strategy, metrics);
      if (!pass) overallPass = false;
      allResults.push({ strategy, metrics, pass });
    } catch (err) {
      console.error(`\nError fetching ${strategy} data: ${err.message}`);
      overallPass = false;
    }
  }

  if (jsonMode) {
    process.stdout.write(JSON.stringify(buildJson(urlArg, allResults), null, 2) + '\n');
    process.exit(0);
  }

  console.log('\n' + '─'.repeat(66));
  if (overallPass) {
    console.log(`${BOLD}\x1b[32m✓ All Core Web Vitals pass${RESET}`);
  } else {
    console.log(`${BOLD}\x1b[31m✗ One or more Core Web Vitals need attention${RESET}`);
  }
  console.log('─'.repeat(66) + '\n');

  process.exit(overallPass ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
