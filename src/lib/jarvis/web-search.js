const SEARCH_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT_MS = 14_000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SEARX_INSTANCES = [
  'https://search.searxng.org',
  'https://searx.be',
  'https://search.bus-hit.me',
];

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

/** Fix common voice/text typos before parsing. */
export function fixSearchTypos(text) {
  return String(text || '')
    .replace(/\bserach\b/gi, 'search')
    .replace(/\bserch\b/gi, 'search')
    .replace(/\bsarch\b/gi, 'search')
    .replace(/\bserachin\b/gi, 'searching')
    .trim();
}

const WAKE_PREFIX_RE =
  /^(?:hello\s+|hey\s+|ok(?:ay)?\s+)?(?:jarvis|jarvus|jervis|darbis|darwis|darwise|darwin|gervais|service)\s*[,:\s]*/gi;

function stripWakePrefix(text) {
  return fixSearchTypos(String(text || '').trim())
    .replace(WAKE_PREFIX_RE, '')
    .trim();
}

/** Build a clean web search query from voice/text (news, photos, tell me about, etc.). */
export function buildWebSearchQuery(raw) {
  let text = stripWakePrefix(raw);
  if (!text) text = fixSearchTypos(String(raw || '').trim());

  const tellAbout = text.match(/\b(?:tell|give)\s+me\s+(?:about\s+)?(.+)$/i);
  if (tellAbout) {
    const q = normalizeSearchQuery(tellAbout[1]);
    if (q.length > 2) return q;
  }

  const photosOf = text.match(/\bphotos?\s+of\s+(.+)$/i);
  if (photosOf) {
    const q = normalizeSearchQuery(photosOf[1]);
    if (q.length > 2) return q;
  }

  if (/\b(?:news|headlines|weather|price|prices)\b/i.test(text)) {
    const q = normalizeSearchQuery(text);
    if (q.length > 2) return q;
  }

  if (/\b(?:today|latest|breaking|current)\b/i.test(text)) {
    const q = normalizeSearchQuery(text);
    if (q.length > 2) return q;
  }

  const about = text.match(/\babout\s+(.+)$/i);
  if (about) {
    const q = normalizeSearchQuery(about[1]);
    if (q.length > 2) return q;
  }

  return extractSearchQueryFromTranscript(raw);
}

/** Pull a search query from messy voice transcripts. */
export function extractSearchQueryFromTranscript(raw) {
  let text = stripWakePrefix(raw);
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
  return fixSearchTypos(String(query || ''))
    .trim()
    .replace(/^(?:please\s+)+/i, '')
    .replace(/^(?:do it|just search|search for me)[,:\s]*/i, '')
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

  // Alternate DDG HTML layout
  const altLinkRe = /<a[^>]*class="[^"]*result-link[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let alt;
  while ((alt = altLinkRe.exec(html)) !== null && results.length < 8) {
    const url = decodeDdgUrl(alt[1]);
    if (!url) continue;
    add(stripHtml(alt[2]), url, '');
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

/** DuckDuckGo Instant Answer API — works when HTML scraping is blocked. */
async function searchDuckDuckGoApi(query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`,
      {
        headers: { 'User-Agent': SEARCH_UA, Accept: 'application/json' },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const json = await res.json();
    const results = [];
    const seen = new Set();
    const add = (title, url, snippet = '') => {
      if (!url || seen.has(url) || SKIP_HOST.test(url)) return;
      seen.add(url);
      results.push({ title: title || url, url, snippet });
    };

    if (json.AbstractURL && json.Abstract) {
      add(json.Heading || json.AbstractSource || query, json.AbstractURL, json.Abstract);
    }
    for (const t of json.RelatedTopics || []) {
      if (t.FirstURL && t.Text) add(t.Text.slice(0, 100), t.FirstURL, t.Text);
      if (Array.isArray(t.Topics)) {
        for (const st of t.Topics) {
          if (st.FirstURL && st.Text) add(st.Text.slice(0, 100), st.FirstURL, st.Text);
        }
      }
      if (results.length >= 8) break;
    }
    return results;
  } catch {
    clearTimeout(timer);
    return [];
  }
}

function fallbackSearchLinks(query) {
  const q = encodeURIComponent(query);
  return [
    {
      title: `Google search: ${query}`,
      url: `https://www.google.com/search?q=${q}`,
      snippet: 'Open full Google results for this query.',
    },
    {
      title: `Bing search: ${query}`,
      url: `https://www.bing.com/search?q=${q}`,
      snippet: 'Open full Bing results for this query.',
    },
  ];
}

function isFallbackLinkResult(results) {
  return (
    results?.length > 0 &&
    results.every((r) => /google\.com\/search|bing\.com\/search/i.test(r.url || ''))
  );
}

function openRouterReferer() {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (url) return url.startsWith('http') ? url : `https://${url}`;
  return 'https://khamareclarke.com';
}

function getOpenRouterKey() {
  return (process.env.OPENROUTER_API_KEY || process.env.EMPIRE_LLM_API_KEY || '').trim();
}

function parseWebSearchPayload(text) {
  const raw = String(text || '').trim();
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    const json = JSON.parse(cleaned);
    const results = (json.results || [])
      .filter((r) => r?.url)
      .slice(0, 8)
      .map((r) => ({
        title: String(r.title || r.url).slice(0, 200),
        url: String(r.url),
        snippet: String(r.snippet || '').slice(0, 300),
      }));
    if (results.length) {
      return { summary: String(json.summary || '').slice(0, 700), results };
    }
  } catch {
    // not JSON
  }

  const results = [];
  const seen = new Set();
  const urlRe = /https?:\/\/[^\s)\]"'<>]+/g;
  for (const url of raw.match(urlRe) || []) {
    const clean = url.replace(/[.,;]+$/, '');
    if (seen.has(clean) || SKIP_HOST.test(clean)) continue;
    seen.add(clean);
    results.push({ title: clean.replace(/^https?:\/\/(www\.)?/, '').slice(0, 80), url: clean, snippet: '' });
    if (results.length >= 6) break;
  }
  if (!results.length && raw.length > 20) {
    return { summary: raw.slice(0, 700), results: [] };
  }
  return null;
}

/** SearXNG JSON — often works from serverless when HTML scrapers are blocked. */
async function searchSearx(query) {
  for (const base of SEARX_INSTANCES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(
        `${base}/search?q=${encodeURIComponent(query)}&format=json&language=en`,
        {
          headers: { 'User-Agent': SEARCH_UA, Accept: 'application/json' },
          signal: controller.signal,
        }
      );
      clearTimeout(timer);
      if (!res.ok) continue;
      const json = await res.json();
      const rows = (json.results || [])
        .filter((r) => r.url && !SKIP_HOST.test(r.url))
        .slice(0, 8)
        .map((r) => ({
          title: r.title || r.url,
          url: r.url,
          snippet: r.content || r.snippet || '',
        }));
      if (rows.length) return rows;
    } catch {
      clearTimeout(timer);
    }
  }
  return [];
}

/** OpenRouter web model (Perplexity Sonar etc.) when scrapers return nothing. */
async function searchOpenRouterWeb(query) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) return null;

  const model = process.env.OPENROUTER_SEARCH_MODEL || 'perplexity/sonar';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28_000);
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': openRouterReferer(),
        'X-Title': 'Khamare Clarke JARVIS Search',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You search the web and return ONLY valid JSON (no markdown): {"summary":"2-4 sentence factual answer","results":[{"title":"...","url":"https://...","snippet":"..."}]}. Include 5 real results with real https URLs and useful snippets.',
          },
          { role: 'user', content: `Search the web for: ${query}` },
        ],
        max_tokens: 1200,
        temperature: 0.2,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = parseWebSearchPayload(text);
    if (!parsed) return null;
    if (!parsed.results?.length && parsed.summary) {
      return {
        summary: parsed.summary,
        results: [
          {
            title: `Web answer: ${query}`,
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            snippet: parsed.summary.slice(0, 280),
          },
        ],
      };
    }
    return parsed;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/** Build a spoken summary from result rows without LLM. */
export function summarizeSearchResults(query, results) {
  if (!results?.length) {
    return `No web snippets found for "${query}", sir. Tap the links in comms or add BRAVE_SEARCH_API_KEY on Vercel for richer search.`;
  }
  const lines = results.slice(0, 4).map((r, i) => {
    const bit = r.snippet ? `${r.title}. ${r.snippet}` : r.title;
    return `${i + 1}. ${bit}`;
  });
  return `Here's what I found for "${query}", sir. ${lines.join(' ')}`.slice(0, 700);
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

/** Run a web search — Brave → SearXNG → Bing → DDG → OpenRouter web → link fallback. */
export async function searchWeb(query) {
  const q = normalizeSearchQuery(query);
  if (!q) return { query: q, results: [], source: 'none' };

  const brave = await searchBrave(q);
  if (brave?.length) return { query: q, results: brave, source: 'brave' };

  const searx = await searchSearx(q);
  if (searx?.length) return { query: q, results: searx, source: 'searxng' };

  const bing = await searchBing(q);
  if (bing?.length) return { query: q, results: bing, source: 'bing' };

  const ddgApi = await searchDuckDuckGoApi(q);
  if (ddgApi?.length) return { query: q, results: ddgApi, source: 'duckduckgo-api' };

  const ddg = await searchDuckDuckGo(q);
  if (ddg?.length) return { query: q, results: ddg, source: 'duckduckgo' };

  const orWeb = await searchOpenRouterWeb(q);
  if (orWeb?.results?.length) {
    return {
      query: q,
      results: orWeb.results,
      source: 'openrouter-web',
      prefSummary: orWeb.summary,
    };
  }

  return { query: q, results: fallbackSearchLinks(q), source: 'fallback-links' };
}

export function isRealSearchResultSet(results) {
  return results?.length > 0 && !isFallbackLinkResult(results);
}

export function formatSearchResultsForPrompt(results) {
  if (!results?.length) return 'No web results found.';
  return results
    .slice(0, 6)
    .map((r, i) => `${i + 1}. ${r.title}\n   ${r.url}\n   ${r.snippet || ''}`)
    .join('\n\n');
}

/** Draft/write/compose requests — always handled by the LLM, never ops metrics. */
export function isWritingRequest(text) {
  const t = String(text || '').trim().toLowerCase();
  if (!t) return false;
  return (
    /\b(write|draft|compose|prepare|create|generate)\s+(?:a\s+|an\s+|the\s+|me\s+)?/.test(t) ||
    /\b(sick\s+leave|leave\s+application|cover\s+letter|resignation\s+letter)\b/.test(t) ||
    /\b(?:write|draft|compose)\b.*\b(?:letter|email|application|message|document|essay|report)\b/.test(t) ||
    /\b(?:letter|email\s+body|application)\b.*\b(?:for|about|to)\b/.test(t)
  );
}

/** Conversational / ops questions that must never auto-search the web. */
export function isConversationalOrOpsMessage(text) {
  const t = String(text || '').trim().toLowerCase();
  if (!t) return true;
  if (isWritingRequest(t)) return true;
  if (/^(status|fleet|leads|briefing|help|hello|hi|hey|thanks|thank you)\b/i.test(t)) return true;
  if (/\b(your|my|our|today'?s?)\s+(work|day|plan|schedule|briefing|tasks?|agenda)\b/i.test(t)) return true;
  if (/\bhow\s+(?:is|was|are)\s+(?:work|your day|things|it going)\b/i.test(t)) return true;
  if (/\bwhat\s+(?:is|are|was|were)\s+(?:your|my|our|today'?s?)\b/i.test(t)) return true;
  if (/\bwhat\s+(?:did|do)\s+you\s+(?:do|have|work on)\b/i.test(t)) return true;
  if (/\b(?:tell me|explain)\s+(?:about\s+)?(?:yourself|your|my)\b/i.test(t)) return true;
  if (/\b(?:good morning|good night|happy birthday|how are you)\b/i.test(t)) return true;
  return false;
}

/** Explicit user intent to search the web (slash/voice search commands). */
export function hasExplicitSearchIntent(text) {
  const t = fixSearchTypos(String(text || '').trim().toLowerCase());
  if (!t) return false;
  if (/^(search|google|look\s*up|lookup|find)\b/i.test(t)) return true;
  if (/\b(search|serach|look\s*up|lookup)\s+(?:on\s+)?(?:google|the\s+web|the\s+internet|for|about)\b/i.test(t)) return true;
  if (/\bfind\s+.+\s+(?:on|via|using)\s+(?:google|the\s+web|the\s+internet|online)\b/i.test(t)) return true;
  if (/\bgoogle\s+(?:search|for)\b/i.test(t)) return true;
  return false;
}

function isTellMeAboutWebQuery(text) {
  const t = String(text || '').trim().toLowerCase();
  if (!/\b(?:tell|give)\s+me\s+(?:about\s+)?/i.test(t)) return false;
  if (/\b(?:your|my|our|today'?s?)\s+(?:work|day|plan|schedule|briefing|tasks?|agenda)\b/i.test(t)) {
    return false;
  }
  if (/\b(?:yourself|your|my)\b/i.test(t)) return false;
  return true;
}

/** Heuristic: message likely needs live web data (not ops dashboard or chat). */
export function messageNeedsWebSearch(text) {
  const t = fixSearchTypos(String(text || '').trim().toLowerCase());
  if (!t || isConversationalOrOpsMessage(t)) return false;
  if (hasExplicitSearchIntent(t)) return true;
  if (/^(status|fleet|leads|briefing|help|open\s+(fleet|clients|leads))/i.test(t)) return false;

  if (/\bnews\b/i.test(t)) return true;
  if (/\bphotos?\s+of\b/i.test(t)) return true;
  if (isTellMeAboutWebQuery(t)) return true;
  if (/\b(?:today|latest|breaking|current)\s+(?:\w+\s+){0,4}(?:news|ai|tech|technology|headlines)\b/i.test(t)) {
    return true;
  }
  if (/\b(?:today|latest|breaking)\b/i.test(t) && /\b(?:ai|tech|technology)\b/i.test(t)) return true;

  if (/\bweather\b/i.test(t)) return true;
  if (/\b(latest|breaking|today'?s?)\s+(news|headlines)\b/i.test(t)) return true;
  if (/\b(price|prices|cost|how much)\b/i.test(t) && /\b(gold|silver|bitcoin|btc|eth|oil|gas|stock|share|inr|usd|£|\$)\b/i.test(t)) return true;
  if (/\bwho\s+(?:is|was)\s+/i.test(t) && !/\b(you|jarvis|sir)\b/i.test(t)) return true;
  if (/\bwhat\s+(?:is|are)\s+the\s+(?:price|cost|weather|news)\b/i.test(t)) return true;

  return false;
}
