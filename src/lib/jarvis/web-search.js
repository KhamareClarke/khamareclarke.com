const SEARCH_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT_MS = 12_000;

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

function decodeDdgUrl(href) {
  if (!href) return null;
  try {
    if (href.includes('uddg=')) {
      const m = href.match(/uddg=([^&]+)/);
      if (m) return decodeURIComponent(m[1]);
    }
    if (href.startsWith('http')) return href;
  } catch {
    // ignore
  }
  return null;
}

function parseDuckDuckGoResults(html) {
  const results = [];
  const blockRe = /<div[^>]*class="[^"]*\bresult\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let block;
  while ((block = blockRe.exec(html)) !== null && results.length < 8) {
    const chunk = block[1];
    const linkMatch = chunk.match(/class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;
    const url = decodeDdgUrl(linkMatch[1].replace(/&amp;/g, '&'));
    if (!url || !url.startsWith('http')) continue;
    const title = stripHtml(linkMatch[2]);
    const snippetMatch = chunk.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
    const snippet = snippetMatch ? stripHtml(snippetMatch[1]) : '';
    results.push({ title: title || url, url, snippet });
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
      },
      body: `q=${encodeURIComponent(query)}&b=`,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Search HTTP ${res.status}`);
    const html = await res.text();
    const results = parseDuckDuckGoResults(html);
    if (results.length) return results;
    throw new Error('No search results parsed');
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/** Run a web search — Brave API if configured, else DuckDuckGo HTML. */
export async function searchWeb(query) {
  const q = String(query || '').trim();
  if (!q) return { query: q, results: [], source: 'none' };

  const brave = await searchBrave(q);
  if (brave?.length) return { query: q, results: brave, source: 'brave' };

  const ddg = await searchDuckDuckGo(q);
  return { query: q, results: ddg, source: 'duckduckgo' };
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
  return /\b(price|cost|how much|what is|what's|who is|when did|latest|news|weather|today|inr|usd|£|\$|buy|review|compare|search|google)\b/i.test(
    t
  );
}
