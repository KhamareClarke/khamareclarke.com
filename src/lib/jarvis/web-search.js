const SEARCH_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT_MS = 14_000;

const SKIP_HOST =
  /duckduckgo|bing\.|microsoft\.|wikipedia|facebook|youtube|twitter|linkedin|accounts\.|login|google\.|gstatic\./i;

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull a search query from messy voice transcripts. */
export function extractSearchQueryFromTranscript(raw) {
  let text = String(raw || '').trim();
  text = text.replace(/^(?:hello\s+)?(?:hey\s+)?jarvis[,:\s]+/i, '').trim();
  const lower = text.toLowerCase();
  const idx = lower.search(/\bsearch\b/);
  if (idx >= 0) {
    let tail = text.slice(idx).replace(/^search/i, '').trim();
    tail = tail.replace(/^(?:\s*on\s+google\s*)+/i, '');
    tail = tail.replace(/^(?:\s*about\s*)+/i, '');
    tail = tail.replace(/(?:\s*search\s*(?:on\s+)?(?:google\s+)?(?:about\s+)?)+/gi, ' ');
    tail = tail.split(/\s+in the case\b/i)[0];
    tail = tail.split(/\s+i was\b/i)[0];
    const q = normalizeSearchQuery(tail);
    if (q.length > 2) return q;
  }
  const about = text.match(/\babout\s+(.+)$/i);
  if (about) {
    const q = normalizeSearchQuery(about[1].split(/\s+in the case\b/i)[0]);
    if (q.length > 2) return q;
  }
  return normalizeSearchQuery(text);
}

/** Clean voice/text queries like "on google about gold price". */
export function normalizeSearchQuery(query) {
  return String(query || '')
    .trim()
    .replace(/^(?:on\s+google\s+)*/i, '')
    .replace(/^(?:about\s+)+/i, '')
    .replace(/^(?:for\s+)+/i, '')
    .trim();
}

function decodeDdgUrl(href) {
  if (!href) return null;
  try {
    const h = href.replace(/&amp;/g, '&');
    if (h.includes('uddg=')) {
      const m = h.match(/uddg=([^&]+)/);
      if (m) return decodeURIComponent(m[1].replace(/%25/g, '%'));
    }
    if (h.startsWith('http') && !SKIP_HOST.test(h)) return h;
  } catch {
    // ignore
  }
  return null;
}

function parseDuckDuckGoResults(html) {
  const results = [];
  const seen = new Set();

  const add = (title, url, snippet = '') => {
    if (!url || seen.has(url) || SKIP_HOST.test(url)) return;
    seen.add(url);
    results.push({ title: title || url, url, snippet });
  };

  // Modern DDG HTML blocks
  const blockRe = /<div[^>]*class="[^"]*\bresult\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let block;
  while ((block = blockRe.exec(html)) !== null && results.length < 8) {
    const chunk = block[1];
    const linkMatch = chunk.match(/class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;
    const url = decodeDdgUrl(linkMatch[1]);
    if (!url) continue;
    const title = stripHtml(linkMatch[2]);
    const snippetMatch = chunk.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
    add(title, url, snippetMatch ? stripHtml(snippetMatch[1]) : '');
  }

  if (results.length) return results;

  // Fallback: uddg redirect links anywhere in page
  const uddgRe = /uddg=([^&"'\s]+)/gi;
  let m;
  while ((m = uddgRe.exec(html)) !== null && results.length < 8) {
    try {
      const url = decodeURIComponent(m[1].replace(/%25/g, '%'));
      if (url.startsWith('http') && !SKIP_HOST.test(url)) add(url, url, '');
    } catch {
      // ignore
    }
  }

  return results;
}

function parseBingResults(html) {
  const results = [];
  const seen = new Set();

  const add = (title, url, snippet = '') => {
    if (!url || seen.has(url) || SKIP_HOST.test(url)) return;
    seen.add(url);
    results.push({ title: title || url, url, snippet });
  };

  // Bing organic results: h2 > a with cite snippet
  const itemRe = /<li[^>]*class="[^"]*b_algo[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  let item;
  while ((item = itemRe.exec(html)) !== null && results.length < 8) {
    const chunk = item[1];
    const linkMatch = chunk.match(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;
    const url = linkMatch[1].replace(/&amp;/g, '&');
    const title = stripHtml(linkMatch[2]);
    const snippetMatch = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    add(title, url, snippetMatch ? stripHtml(snippetMatch[1]) : '');
  }

  if (results.length) return results;

  // URL-only fallback
  const dataUrl = /data-url="(https?:\/\/[^"]+)"/g;
  let m;
  while ((m = dataUrl.exec(html)) !== null && results.length < 8) {
    const url = m[1].replace(/&amp;/g, '&');
    if (!SKIP_HOST.test(url)) add(url, url, '');
  }

  return results;
}

async function searchBrave(query) {
  const key = (process.env.BRAVE_SEARCH_API_KEY || '').trim();
  if (!key) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'X-Subscription-Token': key },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    const web = json.web?.results || [];
    return web.map((r) => ({
      title: r.title || r.url,
      url: r.url,
      snippet: r.description || '',
    }));
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function searchDuckDuckGo(query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': SEARCH_UA,
        Accept: 'text/html',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
      body: `q=${encodeURIComponent(query)}&b=`,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const html = await res.text();
    return parseDuckDuckGoResults(html);
  } catch {
    clearTimeout(timer);
    return [];
  }
}

async function searchBing(query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`,
      {
        headers: {
          'User-Agent': SEARCH_UA,
          Accept: 'text/html',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const html = await res.text();
    return parseBingResults(html);
  } catch {
    clearTimeout(timer);
    return [];
  }
}

/** Run a web search — Brave → Bing → DuckDuckGo. Never throws. */
export async function searchWeb(query) {
  const q = normalizeSearchQuery(query);
  if (!q) return { query: q, results: [], source: 'none' };

  const brave = await searchBrave(q);
  if (brave?.length) return { query: q, results: brave, source: 'brave' };

  const bing = await searchBing(q);
  if (bing?.length) return { query: q, results: bing, source: 'bing' };

  const ddg = await searchDuckDuckGo(q);
  if (ddg?.length) return { query: q, results: ddg, source: 'duckduckgo' };

  return { query: q, results: [], source: 'none' };
}

export function formatSearchResultsForPrompt(results) {
  if (!results?.length) return 'No web results found.';
  return results
    .slice(0, 6)
    .map((r, i) => `${i + 1}. ${r.title}\n   ${r.url}\n   ${r.snippet || ''}`)
    .join('\n\n');
}

/** Heuristic: message likely needs live web data (not ops dashboard). */
export function messageNeedsWebSearch(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return false;
  if (/^(status|fleet|leads|briefing|help|open\s+(fleet|clients|leads))/i.test(t)) return false;
  return /\b(price|cost|how much|what is|what's|who is|when did|latest|news|weather|today|inr|usd|£|\$|buy|review|compare|search|google|gold|silver|stock)\b/i.test(
    t
  );
}
