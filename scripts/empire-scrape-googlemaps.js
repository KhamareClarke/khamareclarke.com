#!/usr/bin/env node
/**
 * Scrape business leads from Google Maps search (Node + Puppeteer).
 * Install: npm install puppeteer
 * Run: node scripts/empire-scrape-googlemaps.js "web design agency uk"
 * Or set SEARCH_QUERY and run: node scripts/empire-scrape-googlemaps.js
 * Output: JSON array of { name, rating?, email?, website?, phone?, source: "google_maps" } to stdout.
 */
const searchQuery = process.env.SEARCH_QUERY || process.argv[2] || 'web design agency uk';
const maxResults = Math.min(Number(process.env.MAX_MAPS_RESULTS) || 50, 100);

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Install Puppeteer first: npm install puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  await page.waitForTimeout(3000);

  const leads = await page.evaluate((max) => {
    const results = [];
    const cards = document.querySelectorAll('.Nv2PK, [role="feed"] > div > div > a');
    const seen = new Set();
    for (const el of cards) {
      if (results.length >= max) break;
      const link = el.getAttribute('href') || '';
      const nameEl = el.querySelector('.qBF1Pd') || el.querySelector('[class*="fontHeadline"]');
      const name = nameEl ? nameEl.innerText.trim() : null;
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const ratingEl = el.querySelector('.MW4etd') || el.querySelector('[class*="rating"]');
      results.push({
        name,
        rating: ratingEl ? ratingEl.innerText.trim() : null,
        placeUrl: link.startsWith('/') ? 'https://www.google.com/maps' + link : link,
        source: 'google_maps',
      });
    }
    return results;
  }, maxResults);

  await browser.close();

  const withEmail = leads.map((l) => ({ ...l, email: null, website: null, phone: null }));
  console.log(JSON.stringify(withEmail, null, 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
