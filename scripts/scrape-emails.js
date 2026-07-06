#!/usr/bin/env node
/**
 * Scrape emails from one or more webpage URLs.
 * Usage:
 *   node scripts/scrape-emails.js "https://example.com/page1"
 *   node scripts/scrape-emails.js "https://a.com" "https://b.com"
 *   EMPIRE_LEAD_SCRAPE_URL=https://example.com node scripts/scrape-emails.js
 * Output: JSON array to stdout, e.g. [{"email":"x@y.com","name":"x","source":"scrape"}]
 */

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;
const SKIP_DOMAINS = /@(example\.com|test\.com|domain\.com|email\.com|mail\.com|\.local|wixpress|sentry\.io|google|youtube|facebook|github\.com)/i;
const MAX_PER_PAGE = 500;
const MAX_PAGES = 50;

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmpireScraper/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function extractEmails(html) {
  const seen = new Set();
  const list = [];
  let m;
  const re = new RegExp(EMAIL_REGEX.source, 'gi');
  while ((m = re.exec(html)) !== null) {
    const email = m[0].toLowerCase();
    if (seen.has(email)) continue;
    if (SKIP_DOMAINS.test(email)) continue;
    seen.add(email);
    list.push({
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').trim() || 'Contact',
      source: 'scrape',
    });
    if (list.length >= MAX_PER_PAGE) break;
  }
  return list;
}

async function main() {
  let urls = process.argv.slice(2).filter(Boolean);
  if (urls.length === 0 && process.env.EMPIRE_LEAD_SCRAPE_URL) {
    urls = process.env.EMPIRE_LEAD_SCRAPE_URL.split(',').map((u) => u.trim()).filter(Boolean);
  }
  if (urls.length === 0) {
    console.error('Usage: node scripts/scrape-emails.js <url1> [url2] ...');
    console.error('   or: EMPIRE_LEAD_SCRAPE_URL=https://example.com node scripts/scrape-emails.js');
    process.exit(1);
  }

  const all = [];
  const seen = new Set();
  const pages = urls.slice(0, MAX_PAGES);

  for (const url of pages) {
    try {
      const html = await fetchText(url);
      const leads = extractEmails(html);
      for (const lead of leads) {
        if (!seen.has(lead.email)) {
          seen.add(lead.email);
          all.push(lead);
        }
      }
    } catch (e) {
      console.error(`Error ${url}:`, e.message);
    }
  }

  console.log(JSON.stringify(all, null, 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
