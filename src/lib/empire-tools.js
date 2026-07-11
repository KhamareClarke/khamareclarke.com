/**
 * Empire worker tools — read_file, write_file, run_command, save_leads.
 * Used by empire-worker.js so the LLM can actually edit repos and run scripts.
 * All paths and commands are allowlisted via config/worker.json or env.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let _supabaseAdmin = null;
function getSupabaseAdmin() {
  if (_supabaseAdmin !== null) return _supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    _supabaseAdmin = createClient(url, key, { auth: { persistSession: false } });
  } catch (_) {}
  return _supabaseAdmin;
}

const DEFAULT_WORKSPACE = process.cwd();

function loadWorkerConfig() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'config', 'worker.json'), 'utf8');
    const data = JSON.parse(raw);
    return data;
  } catch (_) {
    return { allowed_paths: [], allowed_commands: [], workspace_root: '' };
  }
}

function getAllowedPaths() {
  const envPaths = process.env.EMPIRE_WORKER_ALLOWED_PATHS;
  if (envPaths && typeof envPaths === 'string') {
    return envPaths.split(',').map((p) => path.normalize(path.resolve(p.trim()))).filter(Boolean);
  }
  const config = loadWorkerConfig();
  const root = config.workspace_root ? path.resolve(config.workspace_root) : DEFAULT_WORKSPACE;
  const list = (config.allowed_paths || []).map((p) => path.normalize(path.resolve(root, p)));
  return list.length ? list : [path.normalize(root)];
}

/** Project root = first allowed path. Used as cwd for run_command so git/npm run in the target repo. */
function getProjectRoot() {
  const allowed = getAllowedPaths();
  return allowed.length ? allowed[0] : DEFAULT_WORKSPACE;
}

function getAllowedCommands() {
  const envCmds = process.env.EMPIRE_WORKER_ALLOWED_COMMANDS;
  if (envCmds && typeof envCmds === 'string') {
    return envCmds.split(',').map((c) => c.trim()).filter(Boolean);
  }
  const config = loadWorkerConfig();
  return config.allowed_commands || [];
}

function resolveAndCheck(filePath) {
  if (filePath == null || String(filePath).trim() === '') {
    throw new Error('file_path is required and must be non-empty (e.g. app/page.tsx)');
  }
  const allowed = getAllowedPaths();
  const base = allowed.length >= 1 ? allowed[0] : DEFAULT_WORKSPACE;
  const normalizedBase = base.replace(/[/\\]+$/, '');
  const resolved = path.normalize(path.resolve(normalizedBase, filePath));
  const ok = allowed.some((root) => {
    const r = path.normalize(root).replace(/[/\\]+$/, '');
    return resolved === r || resolved.startsWith(r + path.sep);
  });
  if (!ok) {
    throw new Error(`Path not allowed: ${filePath}. Resolved: ${resolved}. Allowed roots: ${allowed.join(', ')}`);
  }
  return resolved;
}

/**
 * List directory contents. Path is relative to project root (e.g. "app", "components").
 */
function listDir(dirPath) {
  const resolved = resolveAndCheck(dirPath || '.');
  const entries = fs.readdirSync(resolved, { withFileTypes: true });
  const list = entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
  return { ok: true, path: dirPath || '.', entries: list.slice(0, 200) };
}

const SEARCH_EXT = ['.tsx', '.ts', '.jsx', '.js', '.css', '.md', '.mdx'];
const SEARCH_SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.cache']);
const SEARCH_MAX_FILES = 200;
const SEARCH_MAX_MATCHES = 30;
const SEARCH_SNIPPET_CHARS = 80;

/**
 * Search for text in project files. Use this FIRST when the user asks to change specific
 * visible text (e.g. a heading, subtitle, button label) so you edit the right file.
 * Returns file paths (relative to project root) and line numbers where the query appears.
 */
function searchFiles(query) {
  if (typeof query !== 'string' || query.trim().length === 0) {
    return { ok: false, error: 'search_files requires a non-empty query string.' };
  }
  const root = getProjectRoot();
  const q = query.trim();
  const matches = [];
  let filesChecked = 0;

  function walk(dir) {
    if (filesChecked >= SEARCH_MAX_FILES || matches.length >= SEARCH_MAX_MATCHES) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const e of entries) {
      if (matches.length >= SEARCH_MAX_MATCHES) break;
      const full = path.join(dir, e.name);
      const rel = path.relative(root, full).replace(/\\/g, '/');
      if (e.isDirectory()) {
        if (!SEARCH_SKIP_DIRS.has(e.name)) walk(full);
        continue;
      }
      if (!SEARCH_EXT.includes(path.extname(e.name).toLowerCase())) continue;
      filesChecked++;
      if (filesChecked > SEARCH_MAX_FILES) break;
      let content;
      try {
        content = fs.readFileSync(full, 'utf8');
      } catch (_) {
        continue;
      }
      const lines = content.split(/\r?\n/);
      for (let i = 0; i < lines.length && matches.length < SEARCH_MAX_MATCHES; i++) {
        if (lines[i].includes(q)) {
          const snippet = lines[i].trim().slice(0, SEARCH_SNIPPET_CHARS);
          matches.push({ file: rel, line: i + 1, snippet });
        }
      }
    }
  }

  walk(root);
  return { ok: true, query: q, matches, hint: 'Read these files with read_file then apply your change with write_file.' };
}

/** Max chars per file to avoid blowing LLM context (128k tokens ≈ ~500k chars total). ~12k chars ≈ 3k tokens. */
const READ_FILE_MAX_CHARS = parseInt(process.env.EMPIRE_READ_FILE_MAX_CHARS, 10) || 12000;

/**
 * Read a file. Path must be under allowed_paths.
 * Content is truncated to READ_FILE_MAX_CHARS to stay under OpenRouter/API context limits.
 */
function readFile(filePath) {
  const resolved = resolveAndCheck(filePath);
  const content = fs.readFileSync(resolved, 'utf8');
  const truncated = content.length > READ_FILE_MAX_CHARS;
  const out = content.slice(0, READ_FILE_MAX_CHARS);
  return {
    ok: true,
    content: truncated ? out + '\n\n...[truncated; file is ' + content.length + ' chars]' : out,
    path: resolved,
    truncated,
  };
}

/**
 * Normalize content: LLMs sometimes send literal escapes instead of real characters.
 * - \n \r \t → newline, carriage return, tab (avoids "Expecting Unicode escape \uXXXX").
 * - \" → " so JSX/JS source doesn't get literal backslash-quote.
 * - Trailing or line-ending single backslash → removed (model truncation or bad escape
 *   often leaves "};\" at end of line, which is invalid in JS/TS and breaks the build).
 */
function normalizeWriteContent(content) {
  if (typeof content !== 'string') return '';
  return content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\r?\n/g, '\n')   // line-ending backslash (e.g. "};\ \n") → just newline
    .replace(/\\\s*$/m, '');     // trailing backslash at end of content or line (e.g. "};\") → remove
}

/**
 * Paths the worker must never write (would break the build). Use public/ instead.
 */
const WRITE_BLOCKED_PATTERNS = [
  /app[\/\\]robots\.txt[\/\\]route\.(ts|tsx|js|jsx)$/i,
  /app[\/\\]sitemap\.xml[\/\\]route\.(ts|tsx|js|jsx)$/i,
  /[\/\\]robots\.txt[\/\\]route\.(ts|tsx|js|jsx)$/i,
  /[\/\\]sitemap\.xml[\/\\]route\.(ts|tsx|js|jsx)$/i,
];

function isBlockedWritePath(filePath) {
  const normalized = path.normalize(String(filePath)).replace(/\\/g, '/');
  return WRITE_BLOCKED_PATTERNS.some((re) => re.test(normalized));
}

/**
 * Write a file. Path must be under allowed_paths. Blocked paths (e.g. app/robots.txt/route.ts) are rejected so the worker cannot break the build.
 */
function writeFile(filePath, content) {
  if (isBlockedWritePath(filePath)) {
    throw new Error(
      `Writing to ${filePath} is not allowed. Use public/robots.txt for robots and public/sitemap.xml for sitemap. Do not create route.ts files with plain text—it breaks the build.`
    );
  }
  const normalized = normalizeWriteContent(content);
  const resolved = resolveAndCheck(filePath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, normalized, 'utf8');
  return { ok: true, path: resolved, bytes: Buffer.byteLength(normalized, 'utf8') };
}

/** Domains that are YOUR business — never save these as "leads". */
const PROJECT_OWN_DOMAINS = {
  myapproved: ['myapproved.com', 'myapproved.co.uk'],
  khamareclarke: ['khamareclarke.com'],
  zeroclaw: ['zeroclaw.com'],
  omniwtms: ['omniwtms.com'],
  leverageacademy: ['leverageacademy.com'],
  fliprepublic: ['fliprepublic.com'],
  inboker: ['inboker.com'],
  identitymarketing: ['identitymarketing.com'],
  adstarter: ['adstarter.com'],
  seoinforce: ['seoinforce.com'],
  alkemmy: ['alkemmy.com'],
};

function getOwnLeadDomains() {
  const env = (process.env.EMPIRE_LEAD_OWN_DOMAINS || '').trim();
  if (env) return new Set(env.split(',').map((d) => d.trim().toLowerCase()).filter(Boolean));
  const projectId = (process.env.EMPIRE_WORKER_PROJECT_ID || '').toLowerCase().replace(/-/g, '_');
  const list = PROJECT_OWN_DOMAINS[projectId];
  return new Set(list ? list.map((d) => d.toLowerCase()) : []);
}

function isOwnDomainEmail(email, ownDomains) {
  if (!email || typeof email !== 'string') return true;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && ownDomains.has(domain);
}

/**
 * Save leads to Empire dashboard (empire_leads). Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * leads_json: JSON string array of { source?, email?, name?, payload? }. project_id from EMPIRE_WORKER_PROJECT_ID.
 * Emails from your own domain (e.g. *@myapproved.com) are excluded — only real business leads are saved.
 */
function saveLeads(leadsJson) {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, error: 'Supabase not configured (set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)' };
  let list;
  try {
    list = typeof leadsJson === 'string' ? JSON.parse(leadsJson) : leadsJson;
  } catch (e) {
    return { ok: false, error: 'Invalid JSON for leads: ' + (e.message || String(e)) };
  }
  if (!Array.isArray(list) || list.length === 0) return { ok: false, error: 'leads must be a non-empty array' };
  const ownDomains = getOwnLeadDomains();
  const filtered = list.filter((lead) => !lead.email || !isOwnDomainEmail(lead.email, ownDomains));
  if (filtered.length === 0) return { ok: false, error: 'All leads were from your own domain and were excluded. Add real business emails only (from EMPIRE_LEAD_SOURCE_URL or external scrape URLs).', inserted: 0 };
  const projectId = (process.env.EMPIRE_WORKER_PROJECT_ID || 'khamareclarke').toLowerCase();
  const rows = filtered.slice(0, 500).map((lead) => ({
    project_id: projectId,
    source: lead.source ?? null,
    email: lead.email ?? null,
    name: lead.name ?? null,
    payload: lead.payload ?? {},
    updated_at: new Date().toISOString(),
  }));
  try {
    const { data, error } = admin.from('empire_leads').insert(rows).select('id');
    if (error) return { ok: false, error: error.message, inserted: 0 };
    return { ok: true, inserted: (data && data.length) || rows.length };
  } catch (e) {
    return { ok: false, error: e.message || String(e), inserted: 0 };
  }
}

/**
 * Fetch real leads from a configured URL (EMPIRE_LEAD_SOURCE_URL). Returns JSON array for save_leads.
 */
async function fetchLeads() {
  const url = (process.env.EMPIRE_LEAD_SOURCE_URL || '').trim();
  if (!url) return { ok: false, error: 'EMPIRE_LEAD_SOURCE_URL not set. Set it to an API or JSON URL that returns an array of leads [{ email, name, source?, payload? }].' };
  try {
    const headers = {};
    const authHeader = (process.env.EMPIRE_LEAD_SOURCE_AUTH || process.env.EMPIRE_LEAD_SOURCE_HEADERS || '').trim();
    if (authHeader) headers['Authorization'] = authHeader;
    const res = await fetch(url, { headers });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${await res.text().then((t) => t.slice(0, 200))}` };
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data && Array.isArray(data.leads) ? data.leads : data?.data);
    if (!Array.isArray(list) || list.length === 0) return { ok: false, error: 'URL did not return a non-empty array of leads.', count: 0 };
    const ownDomains = getOwnLeadDomains();
    const leads = list
      .slice(0, 600)
      .map((l) => ({
        email: l.email ?? l.Email ?? null,
        name: l.name ?? l.Name ?? l.company ?? l.Company ?? null,
        source: l.source ?? l.Source ?? 'lead_source',
        payload: l.payload ?? {},
      }))
      .filter((l) => !isOwnDomainEmail(l.email, ownDomains))
      .slice(0, 500);
    if (leads.length === 0) return { ok: false, error: 'All leads from the API were from your own domain and were excluded. Use real business lead data only.', count: 0 };
    return { ok: true, count: leads.length, leads_json: JSON.stringify(leads) };
  } catch (e) {
    return { ok: false, error: e.message || String(e), count: 0 };
  }
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?44|\+?1)?[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
const EMAIL_SKIP_DOMAIN = /@(example|test|wix|sentry|google|facebook|youtube|twitter|linkedin|\.png|\.jpg|error-tracking|ingest\.|crashlytics|domain\.com|@2x|@3x)\b/i;
const MAX_SCRAPE_LEADS = 500;

/** Hostnames we never accept as leads (big brands, error pages, non-trades, non-UK/CA). */
const BLOCKED_LEAD_HOSTS = new Set([
  'tiktok.com', 'netflix.com', 'instagram.com', 'reddit.com', 'github.com', 'openai.com', 'chatgpt.com', 'apple.com', 'microsoft.com', 'xbox.com', 'office.com',
  'espn.com', 'cbssports.com', 'foxsports.com', 'nba.com', 'yahoo.com', 'aldi.com', 'aldi.nl', 'aldi.be', 'bloomberg.com', 'cnbc.com', 'twincities.com',
  'douban.com', 'zhihu.com', 'gamer.com.tw', 'odpovedi.cz', 'poslatsms.cz', 't-mobile.com', 't-mobile.cz', 'fixedfloat.org', 'ff.io', 'coinlib.io', 'exchangeflow.co', 'cnchemshop.com',
  'moovitapp.com', 'pataitihaas.com', 'justdial.com', 'springer.com', 'link.springer.com', 'mathworks.com', 'ieeexplore.ieee.org', 'sciencedirect.com',
  'merriam-webster.com', 'thesaurus.com', 'wordhippo.com', '365scores.com', 'premierleague.com', 'flashscore.pt', 'zerozero.pt',
  'netzwelt.de', 'kleinanzeigen.de', 'ebay-kleinanzeigen.de', 'einfachkochen.de', 'fleischglueck.de', 'bautzen.de', 'flugsimulator.info', 'flugsimulator-fliegen.de', 'afs-flug.de',
  'schaetzeausoesterreich.at', 'gutekueche.at', 'fitaliancook.com', 'freshtorge.tv', 'freshtorge.fandom.com', 'fnp.de', 'smile-producing.de',
  'frandroid.com', 'clubic.com', 'cybo.com', 'greenwichmeantime.com', 'time.is', 'time.now', 'todaydatetime.com', '24timezones.com',
  'search.google', 'gist.github.com', 'about.instagram.com', 'livecenter.tiktok.com', 'apps.apple.com', 'help.netflix.com', 'chatopenai.de', 'chatgptdeutsch.com.de', 'chat.ch',
  'promotiez.be', 'folderbode.be', 'hardware1000.com',
]);

/** Page titles that indicate error/captcha/junk — reject these leads. */
const JUNK_TITLE_PATTERNS = /attention required|just a moment|access denied|^error$|cloudflare|enable javascript|loading\.\.\.|please wait/i;

/** TLDs that are clearly not UK/Canada — reject so we keep UK & Canada only. */
const NON_UK_CA_TLDS = new Set([
  'de', 'fr', 'at', 'ch', 'cz', 'pt', 'nl', 'be', 'es', 'it', 'pl', 'ru', 'cn', 'jp', 'br', 'au', 'in', 'tw', 'hk', 'sg', 'kr', 'eu', 'info', 'io', 'com.br', 'co.jp', 'com.au', 'co.in', 'com.tw',
]);

/** Returns true if the lead is worth keeping: UK/Canada-focused, not a known junk site or error page. */
function isQualityLead(lead) {
  const name = (lead.name || '').trim();
  const url = lead.payload?.website || '';
  const email = (lead.email || '').toLowerCase();

  if (JUNK_TITLE_PATTERNS.test(name)) return false;
  if (email && EMAIL_SKIP_DOMAIN.test(email)) return false;

  let host = '';
  try {
    host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch (_) {
    return false;
  }
  if (BLOCKED_LEAD_HOSTS.has(host)) return false;
  for (const blocked of BLOCKED_LEAD_HOSTS) {
    if (host.endsWith('.' + blocked) || host === blocked) return false;
  }

  const tld = host.split('.').pop();
  if (NON_UK_CA_TLDS.has(tld)) return false;
  const lastTwo = host.split('.').slice(-2).join('.');
  if (NON_UK_CA_TLDS.has(lastTwo)) return false;

  return true;
}
const MAX_SCRAPE_PAGES = 20;

const GOOGLE_SCRAPE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Extract outbound result URLs from Google search HTML (no API). Handles /url?q= and direct links. */
function parseGoogleSearchResultUrls(html) {
  const urls = new Set();
  const qMatch = /\/url\?q=([^&"'\s]+)/g;
  let m;
  while ((m = qMatch.exec(html)) !== null) {
    try {
      const decoded = decodeURIComponent(m[1]);
      if (decoded.startsWith('http') && !decoded.includes('google.com') && !decoded.includes('gstatic.com') && !decoded.includes('youtube.com')) urls.add(decoded);
    } catch (_) {}
  }
  const directMatch = /href="(https:\/\/[^"]+)"/g;
  while ((m = directMatch.exec(html)) !== null) {
    const u = m[1].replace(/&amp;/g, '&');
    if (!u.includes('google.') && !u.includes('gstatic.') && !u.includes('youtube.com')) urls.add(u);
  }
  return Array.from(urls);
}

const SEARCH_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Extract result URLs from DuckDuckGo HTML search. */
function parseDuckDuckGoResultUrls(html) {
  const urls = new Set();
  const skip = /duckduckgo|wikipedia|facebook|youtube|twitter|linkedin|accounts\.|login|google\.|bing\.|microsoft\./i;
  let m;
  const uddgMatch = /uddg=([^&"'\s]+)/gi;
  while ((m = uddgMatch.exec(html)) !== null) {
    try {
      let u = decodeURIComponent(m[1].replace(/\%25/g, '%'));
      if (u.startsWith('http') && !skip.test(u)) urls.add(u);
    } catch (_) {}
    if (urls.size >= 25) break;
  }
  const hrefMatch = /href="(https?:\/\/[^"]+)"/g;
  while ((m = hrefMatch.exec(html)) !== null) {
    const u = m[1].replace(/&amp;/g, '&').split(/[#&\s]/)[0];
    if (u.startsWith('http') && !skip.test(u) && !u.includes('duckduckgo.com/l/')) urls.add(u);
    if (urls.size >= 25) break;
  }
  return Array.from(urls);
}

/** Extract result URLs from Bing HTML search. Bing often allows server requests. */
function parseBingResultUrls(html) {
  const urls = new Set();
  const skip = /bing\.|microsoft\.|wikipedia|facebook|youtube|twitter|linkedin|accounts\.|login|google\./i;
  let m;
  const dataUrl = /data-url="(https?:\/\/[^"]+)"/g;
  while ((m = dataUrl.exec(html)) !== null) {
    const u = m[1].replace(/&amp;/g, '&');
    if (!skip.test(u)) urls.add(u);
    if (urls.size >= 25) break;
  }
  const citeMatch = /<cite[^>]*>([^<]+)<\/cite>/gi;
  while ((m = citeMatch.exec(html)) !== null) {
    const raw = m[1].replace(/&amp;/g, '&').trim().split(/[\s]/)[0];
    if (raw.startsWith('http') && !skip.test(raw)) urls.add(raw);
    if (urls.size >= 25) break;
  }
  const hrefMatch = /href="(https?:\/\/[^"]+)"/g;
  while ((m = hrefMatch.exec(html)) !== null) {
    const u = m[1].replace(/&amp;/g, '&').split(/[#&\s]/)[0];
    if (!skip.test(u) && !u.includes('bing.com') && !u.includes('microsoft.com')) urls.add(u);
    if (urls.size >= 25) break;
  }
  return Array.from(urls);
}

/** Trades and businesses — UK and Canada only. Override with EMPIRE_LEAD_SCRAPE_QUERIES or EMPIRE_GOOGLE_PLACES_QUERIES for other regions. */
const DEFAULT_GOOGLE_PLACES_QUERIES = [
  'plumber London UK', 'electrician London UK', 'builder London UK', 'plumber Manchester UK', 'electrician Birmingham UK', 'plumber Leeds UK', 'builder Glasgow UK', 'plumber Liverpool UK', 'electrician Bristol UK', 'plumber Sheffield UK', 'builder Edinburgh UK', 'plumber Newcastle UK',
  'plumber Toronto Canada', 'electrician Vancouver Canada', 'builder Montreal Canada', 'plumber Calgary Canada', 'electrician Ottawa Canada', 'plumber Winnipeg Canada', 'electrician Halifax Canada', 'builder Quebec City Canada',
  'carpenter London UK', 'roofer London UK', 'painter Manchester UK', 'plasterer Birmingham UK', 'heating engineer Leeds UK', 'landscaper Bristol UK', 'tiler Sheffield UK', 'locksmith Edinburgh UK',
  'carpenter Toronto Canada', 'roofer Vancouver Canada', 'HVAC Montreal Canada', 'plasterer Calgary Canada', 'landscaper Ottawa Canada',
  'property management company London', 'construction company London', 'facilities management UK', 'housing association UK', 'building maintenance company UK',
  'property management Toronto', 'construction company Vancouver Canada', 'facilities management Canada', 'building maintenance company Canada',
  'real estate developer UK', 'building maintenance UK', 'plumber Vancouver Canada', 'electrician Toronto Canada',
];

const FETCH_TIMEOUT_MS = 8000;

function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(t));
}

const DEFAULT_QUERY_COUNT = 6;
const DEFAULT_PER_QUERY = 5;

/** Filter and dedupe emails from page HTML; exclude junk/own-domain. */
function extractEmailsFromHtml(html, ownDomains, seenEmails) {
  return (html.match(EMAIL_REGEX) || [])
    .map((e) => e.toLowerCase())
    .filter((e) => !EMAIL_SKIP_DOMAIN.test(e) && !seenEmails.has(e) && !isOwnDomainEmail(e, ownDomains));
}

/** Same-origin links that look like contact / about / impressum (max 5). */
function extractContactLikeUrls(html, baseUrl) {
  try {
    const base = new URL(baseUrl);
    const contactPath = /(\/contact|\/about|\/kontakt|\/impressum|\/reach|\/get-in-touch|\/contact-us|\/about-us|\/uber-uns|\/nous-contacter|\/sobre-nosotros|\/chi-siamo)[^"'\s]*/i;
    const hrefRe = /href=["']([^"']+)["']/gi;
    const urls = new Set();
    let m;
    while ((m = hrefRe.exec(html)) !== null && urls.size < 5) {
      const href = m[1].replace(/&amp;/g, '&').split(/[#?]/)[0].trim();
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
      try {
        const u = new URL(href, base);
        if (u.origin !== base.origin) continue;
        const path = u.pathname.toLowerCase();
        if (contactPath.test(path)) {
          urls.add(u.href);
        }
      } catch (_) {}
    }
    return Array.from(urls).slice(0, 3);
  } catch (_) {
    return [];
  }
}

/**
 * Scrape one URL for lead: emails, phone, name. If no email on this page, follow up to 3
 * same-site contact/about/kontakt links and look for email there.
 */
async function scrapeUrlForLead(url, { sourceLabel, seenEmails, ownDomains, delayMs, query }) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    const pageRes = await fetchWithTimeout(url, { headers: { 'User-Agent': SEARCH_UA }, redirect: 'follow' });
    const pageHtml = await pageRes.text();
    const emails = extractEmailsFromHtml(pageHtml, ownDomains, seenEmails);
    const phones = (pageHtml.match(PHONE_REGEX) || []).slice(0, 2);
    const nameMatch = pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
    const name = (nameMatch && nameMatch[1]) ? nameMatch[1].replace(/\s*[-|]\s*.*$/, '').trim().slice(0, 120) : new URL(url).hostname.replace(/^www\./, '');
    let email = emails.length ? emails[0] : null;

    if (!email && pageHtml) {
      const innerUrls = extractContactLikeUrls(pageHtml, url);
      for (const innerUrl of innerUrls) {
        try {
          await delay(delayMs || 300);
          const innerRes = await fetchWithTimeout(innerUrl, { headers: { 'User-Agent': SEARCH_UA }, redirect: 'follow' });
          const innerHtml = await innerRes.text();
          const innerEmails = extractEmailsFromHtml(innerHtml, ownDomains, seenEmails);
          if (innerEmails.length) {
            email = innerEmails[0];
            break;
          }
        } catch (_) {}
      }
    }

    if (email) seenEmails.add(email);
    return {
      name: name || new URL(url).hostname,
      email: email || null,
      payload: { phone: phones[0] || null, website: url, query },
    };
  } catch (_) {
    return null;
  }
}

/**
 * Scrape leads from DuckDuckGo HTML (no API). Built-in queries; no setup.
 */
async function fetchLeadsFromDuckDuckGoScrape() {
  const queriesEnv = (process.env.EMPIRE_GOOGLE_PLACES_QUERIES || process.env.EMPIRE_LEAD_SCRAPE_QUERIES || '').trim();
  let allQueries = queriesEnv ? queriesEnv.split(',').map((q) => q.trim()).filter(Boolean) : [];
  if (allQueries.length === 0) allQueries = DEFAULT_GOOGLE_PLACES_QUERIES;
  const queries = allQueries.slice(0, DEFAULT_QUERY_COUNT);
  const ownDomains = getOwnLeadDomains();
  const seenEmails = new Set();
  const seenUrls = new Set();
  const leads = [];
  const maxLeads = Math.min(Number(process.env.EMPIRE_LEAD_SCRAPE_MAX) || 30, 300);
  const perQuery = DEFAULT_PER_QUERY;
  const delayMs = (v) => new Promise((r) => setTimeout(r, v));

  for (const query of queries) {
    if (leads.length >= maxLeads) break;
    try {
      const res = await fetchWithTimeout('https://html.duckduckgo.com/html/', {
        method: 'POST',
        headers: { 'User-Agent': SEARCH_UA, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-GB,en;q=0.9' },
        body: new URLSearchParams({ q: query }).toString(),
      }, 12000);
      const html = await res.text();
      const urls = parseDuckDuckGoResultUrls(html).filter((u) => !seenUrls.has(u)).slice(0, perQuery);
      for (const url of urls) {
        if (leads.length >= maxLeads) break;
        seenUrls.add(url);
        await delayMs(250);
        const lead = await scrapeUrlForLead(url, {
          sourceLabel: 'duckduckgo_scrape',
          seenEmails,
          ownDomains,
          delayMs: 300,
          query,
        });
        if (lead) {
          leads.push({ ...lead, source: 'duckduckgo_scrape' });
        }
      }
      await delayMs(200);
    } catch (_) {}
  }

  if (leads.length === 0) return { ok: false, error: 'DuckDuckGo found no results.', count: 0 };
  return { ok: true, count: leads.length, leads_json: JSON.stringify(leads) };
}

/**
 * Scrape leads from Bing HTML (no API). Built-in queries; often works when DDG/Google don't.
 */
async function fetchLeadsFromBingScrape() {
  const queriesEnv = (process.env.EMPIRE_GOOGLE_PLACES_QUERIES || process.env.EMPIRE_LEAD_SCRAPE_QUERIES || '').trim();
  let allQueries = queriesEnv ? queriesEnv.split(',').map((q) => q.trim()).filter(Boolean) : [];
  if (allQueries.length === 0) allQueries = DEFAULT_GOOGLE_PLACES_QUERIES;
  const queries = allQueries.slice(0, DEFAULT_QUERY_COUNT);
  const ownDomains = getOwnLeadDomains();
  const seenEmails = new Set();
  const seenUrls = new Set();
  const leads = [];
  const maxLeads = Math.min(Number(process.env.EMPIRE_LEAD_SCRAPE_MAX) || 30, 300);
  const perQuery = DEFAULT_PER_QUERY;
  const delayMs = (v) => new Promise((r) => setTimeout(r, v));

  for (const query of queries) {
    if (leads.length >= maxLeads) break;
    try {
      const res = await fetchWithTimeout(`https://www.bing.com/search?q=${encodeURIComponent(query)}&count=15`, {
        headers: { 'User-Agent': SEARCH_UA, Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-GB,en;q=0.9' },
      }, 12000);
      const html = await res.text();
      const urls = parseBingResultUrls(html).filter((u) => !seenUrls.has(u)).slice(0, perQuery);
      for (const url of urls) {
        if (leads.length >= maxLeads) break;
        seenUrls.add(url);
        await delayMs(250);
        const lead = await scrapeUrlForLead(url, {
          sourceLabel: 'bing_scrape',
          seenEmails,
          ownDomains,
          delayMs: 300,
          query,
        });
        if (lead) {
          leads.push({ ...lead, source: 'bing_scrape' });
        }
      }
      await delayMs(200);
    } catch (_) {}
  }

  if (leads.length === 0) return { ok: false, error: 'Bing found no results.', count: 0 };
  return { ok: true, count: leads.length, leads_json: JSON.stringify(leads) };
}

/**
 * Scrape leads from Google Search HTML (no API). Built-in queries.
 */
async function fetchLeadsFromGoogleScrape() {
  const queriesEnv = (process.env.EMPIRE_GOOGLE_PLACES_QUERIES || process.env.EMPIRE_LEAD_SCRAPE_QUERIES || '').trim();
  let allQueries = queriesEnv ? queriesEnv.split(',').map((q) => q.trim()).filter(Boolean) : [];
  if (allQueries.length === 0) allQueries = DEFAULT_GOOGLE_PLACES_QUERIES;
  const queries = allQueries.slice(0, DEFAULT_QUERY_COUNT);
  const ownDomains = getOwnLeadDomains();
  const seenEmails = new Set();
  const seenUrls = new Set();
  const leads = [];
  const maxLeads = Math.min(Number(process.env.EMPIRE_LEAD_SCRAPE_MAX) || 30, 300);
  const perQuery = DEFAULT_PER_QUERY;
  const delayMs = (v) => new Promise((r) => setTimeout(r, v));

  for (const query of queries) {
    if (leads.length >= maxLeads) break;
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=15`;
      const res = await fetchWithTimeout(searchUrl, {
        headers: { 'User-Agent': SEARCH_UA, Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-GB,en;q=0.9' },
      }, 12000);
      const html = await res.text();
      const urls = parseGoogleSearchResultUrls(html).filter((u) => !seenUrls.has(u)).slice(0, perQuery);
      for (const url of urls) {
        if (leads.length >= maxLeads) break;
        seenUrls.add(url);
        await delayMs(250);
        const lead = await scrapeUrlForLead(url, {
          sourceLabel: 'google_scrape',
          seenEmails,
          ownDomains,
          delayMs: 300,
          query,
        });
        if (lead && (lead.email || (lead.payload && lead.payload.phone) || url)) {
          leads.push({ ...lead, source: 'google_scrape' });
        }
      }
      await delayMs(400);
    } catch (_) {}
  }

  if (leads.length === 0) return { ok: false, error: 'Google found no results.', count: 0 };
  return { ok: true, count: leads.length, leads_json: JSON.stringify(leads) };
}

/**
 * Fetch business leads from Google Places API: search for places, get website/phone, scrape website for email.
 * Requires GOOGLE_PLACES_API_KEY or GOOGLE_MAPS_API_KEY. Returns { ok, count, leads_json }.
 */
async function fetchLeadsFromGooglePlaces() {
  const apiKey = (process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '').trim();
  if (!apiKey) return { ok: false, error: 'GOOGLE_PLACES_API_KEY or GOOGLE_MAPS_API_KEY not set.', count: 0 };

  const queriesEnv = (process.env.EMPIRE_GOOGLE_PLACES_QUERIES || '').trim();
  const queries = queriesEnv ? queriesEnv.split(',').map((q) => q.trim()).filter(Boolean) : DEFAULT_GOOGLE_PLACES_QUERIES;
  const ownDomains = getOwnLeadDomains();
  const seenEmails = new Set();
  const leads = [];
  const maxPlaces = Math.min(Number(process.env.EMPIRE_GOOGLE_PLACES_MAX) || 200, 300);

  for (const query of queries) {
    if (leads.length >= maxPlaces) break;
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') continue;
      const places = searchData.results || [];
      const placesPerQuery = Math.min(places.length, 15);
      for (let i = 0; i < placesPerQuery && leads.length < maxPlaces; i++) {
        const placeId = places[i].place_id;
        const name = places[i].name || null;
        if (!placeId) continue;
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website&key=${apiKey}`;
          const detailsRes = await fetch(detailsUrl);
          const detailsData = await detailsRes.json();
          if (detailsData.status !== 'OK') continue;
          const d = detailsData.result || {};
          const businessName = d.name || name || 'Business';
          const website = (d.website || '').trim();
          const phone = (d.formatted_phone_number || '').trim();
          let email = null;
          if (website && website.startsWith('http')) {
            try {
              const pageRes = await fetch(website, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmpireLeadBot/1.0)' } });
              const html = await pageRes.text();
              const emails = (html.match(EMAIL_REGEX) || [])
                .map((e) => e.toLowerCase())
                .filter((e) => !/@(example|test|wix|sentry|google|facebook|youtube|twitter|linkedin|\.png|\.jpg)\b/.test(e) && !seenEmails.has(e) && !isOwnDomainEmail(e, ownDomains));
              if (emails.length) {
                email = emails[0];
                seenEmails.add(email);
              }
            } catch (_) {}
          }
          if (email || phone || website) {
            leads.push({
              name: businessName,
              email: email || null,
              source: 'google_places',
              payload: { phone: phone || null, website: website || null, query },
            });
          }
        } catch (_) {}
      }
    } catch (e) {
      // next query
    }
  }

  if (leads.length === 0) return { ok: false, error: 'Google Places found no businesses with contact info. Check API key and billing.', count: 0 };
  return { ok: true, count: leads.length, leads_json: JSON.stringify(leads) };
}

/**
 * Scrape leads from ALL sources (DuckDuckGo, Bing, Google), merge and dedupe, then return.
 */
async function scrapeLeads() {
  const jsonUrl = (process.env.EMPIRE_LEAD_SOURCE_URL || '').trim();
  if (jsonUrl) {
    const out = await fetchLeads();
    if (out.ok) return out;
  }

  const maxTotal = Math.min(Number(process.env.EMPIRE_LEAD_SCRAPE_MAX) || 40, 150);
  const maxPerSource = Math.max(1, Math.floor(maxTotal / 3));

  function parseSourceList(sourceResult) {
    if (!sourceResult.ok || !sourceResult.leads_json) return [];
    try {
      const list = JSON.parse(sourceResult.leads_json);
      return Array.isArray(list) ? list.slice(0, maxPerSource) : [];
    } catch (_) {
      return [];
    }
  }

  const [ddgResult, bingResult, googleResult] = await Promise.all([
    fetchLeadsFromDuckDuckGoScrape(),
    fetchLeadsFromBingScrape(),
    fetchLeadsFromGoogleScrape(),
  ]);

  const ddgList = parseSourceList(ddgResult);
  const bingList = parseSourceList(bingResult);
  const googleList = parseSourceList(googleResult);

  const seenKey = new Set();
  const allLeads = [];
  const maxLen = Math.max(ddgList.length, bingList.length, googleList.length);
  for (let i = 0; i < maxLen && allLeads.length < maxTotal; i++) {
    for (const lead of [ddgList[i], bingList[i], googleList[i]]) {
      if (!lead || allLeads.length >= maxTotal) continue;
      if (!isQualityLead(lead)) continue;
      const key = (lead.email || '').toLowerCase() || (lead.payload?.website || '').toLowerCase();
      if (key && seenKey.has(key)) continue;
      if (key) seenKey.add(key);
      allLeads.push(lead);
    }
  }

  const merged = allLeads.slice(0, maxTotal);
  if (merged.length === 0) {
    const fallback = await scrapeLeadsFallbackUrls();
    if (fallback.ok) return fallback;
    const lastError = fallback.error || googleResult.error || bingResult.error || ddgResult.error || 'No leads from any source.';
    return { ok: false, error: lastError, count: 0 };
  }
  return { ok: true, count: merged.length, leads_json: JSON.stringify(merged) };
}

async function scrapeLeadsFallbackUrls() {
  const projectId = (process.env.EMPIRE_WORKER_PROJECT_ID || '').toLowerCase().replace(/-/g, '_');
  const projectKey = projectId ? `EMPIRE_LEAD_SCRAPE_URL_${projectId.toUpperCase().replace(/-/g, '_')}` : null;
  const scrapeEnv = (projectKey && process.env[projectKey]) ? process.env[projectKey] : (process.env.EMPIRE_LEAD_SCRAPE_URL || '');
  const ownDomains = getOwnLeadDomains();
  const ownHosts = new Set();
  try { for (const d of ownDomains) ownHosts.add(String(d).replace(/^www\./, '').toLowerCase()); } catch (_) {}
  let scrapeUrls = (scrapeEnv || '').split(',').map((u) => u.trim()).filter(Boolean);
  scrapeUrls = scrapeUrls.filter((u) => {
    try { const host = new URL(u).hostname.replace(/^www\./, '').toLowerCase(); return !ownHosts.has(host); } catch (_) { return true; }
  });
  if (scrapeUrls.length === 0) {
    return { ok: false, error: 'Built-in search (DDG, Bing, Google) returned no results this run. EMPIRE_LEAD_SCRAPE_URL is only your own site (filtered out). Next run will retry search.', count: 0 };
  }
  const seen = new Set();
  const leads = [];
  const authHeader = (process.env.EMPIRE_LEAD_SOURCE_AUTH || '').trim();
  const headers = { 'User-Agent': GOOGLE_SCRAPE_UA, ...(authHeader ? { Authorization: authHeader } : {}) };
  for (let i = 0; i < Math.min(scrapeUrls.length, MAX_SCRAPE_PAGES) && leads.length < MAX_SCRAPE_LEADS; i++) {
    try {
      const res = await fetch(scrapeUrls[i], { headers });
      const html = await res.text();
      const emails = (html.match(EMAIL_REGEX) || []).filter((e) => {
        const lower = e.toLowerCase();
        if (seen.has(lower)) return false;
        if (/@(example|test|domain|email|mail\.com|\.local)\b/.test(lower)) return false;
        if (isOwnDomainEmail(lower, ownDomains)) return false;
        seen.add(lower);
        return true;
      });
      for (const email of emails) {
        leads.push({ email, name: email.split('@')[0].replace(/[._]/g, ' ') || 'Contact', source: 'scrape' });
        if (leads.length >= MAX_SCRAPE_LEADS) break;
      }
    } catch (e) {
      // continue to next URL
    }
  }
  if (leads.length === 0) {
    return { ok: false, error: 'No leads from the given URLs. Click Fetch more leads to try search again.', count: 0 };
  }
  return { ok: true, count: leads.length, leads_json: JSON.stringify(leads) };
}

/**
 * Run a shell command. Command must be in allowed_commands (or allowlist is empty = deny all).
 * Runs in project root (first allowed path) so git/npm run in the target repo.
 * For "npm run build" / "npx next build", forces NODE_ENV=production to avoid Next.js "generate is not a function" and non-standard NODE_ENV warnings.
 */
function runCommand(command) {
  const allowed = getAllowedCommands();
  const cmd = command.trim();
  if (allowed.length && !allowed.some((a) => cmd === a || cmd.startsWith(a + ' '))) {
    throw new Error(`Command not allowed: ${cmd}. Allowed: ${allowed.join(', ')}`);
  }
  const cwd = getProjectRoot();
  const isNextBuild = /(npm\s+run\s+build|npx\s+next\s+build)/.test(cmd);
  const env = isNextBuild ? { ...process.env, NODE_ENV: 'production' } : process.env;
  try {
    const out = execSync(cmd, {
      encoding: 'utf8',
      timeout: 120_000,
      cwd,
      env,
    });
    return { ok: true, stdout: out.slice(0, 10000), stderr: '', cwd };
  } catch (e) {
    return {
      ok: false,
      stdout: (e.stdout || '').slice(0, 5000),
      stderr: (e.stderr || e.message || String(e)).slice(0, 5000),
      cwd,
    };
  }
}

/** OpenRouter-style tool definitions for the LLM. */
function getToolDefinitions() {
  return [
    {
      type: 'function',
      function: {
        name: 'search_files',
        description: 'Search for exact text in project source files. USE THIS FIRST when the user asks to change specific visible text (e.g. a heading, subtitle, section title, button label). Pass the exact or partial phrase that appears on the page (e.g. "Most In-Demand Services", "Discover our most popular"). Returns file paths and line numbers so you can then read_file and write_file the correct files. Do NOT guess generic components like alert or button—search for the actual text.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Exact or partial text to search for, as it appears in the UI (e.g. "Most In-Demand Services", "Get a quote")' },
          },
          required: ['query'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'list_dir',
        description: 'List files and folders in a directory. Use to discover structure. Path is relative to the project root (e.g. "", "app", "components").',
        parameters: {
          type: 'object',
          properties: {
            dir_path: { type: 'string', description: 'Directory path relative to project root, e.g. "app" or "components". Use "" or "." for project root.' },
          },
          required: [],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'read_file',
        description: 'Read a file. Path is relative to the project root (e.g. app/page.tsx, components/Header.tsx). Do NOT include the project folder name in the path.',
        parameters: {
          type: 'object',
          properties: {
            file_path: { type: 'string', description: 'Path relative to project root, e.g. app/page.tsx or app/layout.tsx' },
          },
          required: ['file_path'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'write_file',
        description: 'Write or overwrite a file. Path is relative to the project root (e.g. app/page.tsx). Do NOT include the project folder name in the path.',
        parameters: {
          type: 'object',
          properties: {
            file_path: { type: 'string', description: 'Path relative to project root' },
            content: { type: 'string', description: 'Full file content to write' },
          },
          required: ['file_path', 'content'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'run_command',
        description: 'Run a terminal command. Only commands in the allowed_commands list are permitted (e.g. node scripts/lead-gen.js).',
        parameters: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'Shell command to run' },
          },
          required: ['command'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'save_leads',
        description: 'Save leads to the Empire dashboard database (empire_leads). Call this after fetch_leads or scraping. Pass a JSON string of an array of objects with optional: source, email, name, payload.',
        parameters: {
          type: 'object',
          properties: {
            leads_json: { type: 'string', description: 'JSON array of lead objects, e.g. [{"source":"scrape","email":"a@b.com","name":"Acme"}]' },
          },
          required: ['leads_json'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'fetch_leads',
        description: 'Fetch leads from EMPIRE_LEAD_SOURCE_URL (JSON API). Returns { ok, count, leads_json }. Call save_leads(leads_json) after.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'scrape_leads',
        description: 'Get real business leads: tries EMPIRE_LEAD_SOURCE_URL first (JSON API of other businesses), else scrapes EMPIRE_LEAD_SCRAPE_URL (external directory/listing pages only — not your own site). Own-domain emails (e.g. *@myapproved.com) are excluded. Returns { ok, count, leads_json }. Then call save_leads(leads_json) and draft outreach with write_file.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
  ];
}

/** Execute one tool call from the LLM response. */
function executeToolCall(name, args) {
  if (name === 'search_files') {
    return searchFiles(args.query || '');
  }
  if (name === 'list_dir') {
    return listDir(args.dir_path ?? args.dirPath ?? '.');
  }
  if (name === 'read_file') {
    return readFile(args.file_path || args.filePath);
  }
  if (name === 'write_file') {
    return writeFile(args.file_path || args.filePath, args.content || '');
  }
  if (name === 'run_command') {
    return runCommand(args.command || '');
  }
  if (name === 'save_leads') {
    return saveLeads(args.leads_json ?? args.leadsJson ?? '[]');
  }
  if (name === 'fetch_leads') {
    return fetchLeads();
  }
  if (name === 'scrape_leads') {
    return scrapeLeads();
  }
  throw new Error(`Unknown tool: ${name}`);
}

module.exports = {
  listDir,
  readFile,
  writeFile,
  runCommand,
  searchFiles,
  saveLeads,
  fetchLeads,
  fetchLeadsFromGooglePlaces,
  scrapeLeads,
  getToolDefinitions,
  executeToolCall,
};
