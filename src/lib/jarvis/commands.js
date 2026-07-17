import { EMPIRE_SKILL_IDS } from '@/lib/empire-skills';
import { ALL_EMPIRE_PROJECT_IDS } from '@/lib/empire-projects';
import { resolveSiteUrl } from '@/lib/jarvis/sites';
import { extractSearchQueryFromTranscript, normalizeSearchQuery, fixSearchTypos, isInternalOpsLeadQuery, isInternalOpsProjectQuery } from '@/lib/jarvis/web-search';

const TAB_ROUTES = {
  fleet: '/dashboard/empire',
  clients: '/dashboard/clients',
  leads: '/dashboard/leads',
  agents: '/dashboard/empire',
  activity: '/dashboard/empire/activity',
  reports: '/dashboard/clients',
  settings: '/dashboard',
};

const READ_COMMANDS = new Set(['status', 'fleet', 'fleet-events', 'briefing', 'help', 'leads']);
const ACTION_COMMANDS = new Set(['run', 'report', 'pause', 'resume', 'open']);
const MAX_LEADS_DAYS = 90;

function clampLeadsDays(n) {
  return Math.min(Math.max(parseInt(n, 10) || 1, 1), MAX_LEADS_DAYS);
}

/**
 * Map conversational lead date ranges to days for /api/jarvis/leads?days=N.
 * Returns null when no range phrase is found.
 */
export function parseLeadsDaysRange(text) {
  const t = norm(text);
  if (!t) return null;

  let m = t.match(/\b(?:last|past|previous|in the last|over the last|for the last)\s+(\d{1,2})\s+days?\b/);
  if (m) return { days: clampLeadsDays(m[1]) };

  m = t.match(/\bleads?\s+(?:for\s+)?(?:the\s+)?(?:last|past)\s+(\d{1,2})\s+days?\b/);
  if (m) return { days: clampLeadsDays(m[1]) };

  if (/\blast\s+month\b/.test(t)) return { days: 30, label: 'last month' };
  if (/\bthis\s+month\b/.test(t)) return { days: 30, label: 'this month' };
  if (/\b(?:this|current)\s+week\b/.test(t)) return { days: 7, label: 'this week' };
  if (/\blast\s+week\b/.test(t)) return { days: 7, label: 'last week' };

  return null;
}

function isLeadsReadQuery(text) {
  const t = norm(text);
  if (!t) return false;
  if (/^leads?\b/.test(t)) return true;
  if (/\bhow many leads\b/.test(t)) return true;
  if (isInternalOpsLeadQuery(t)) return true;
  if (/\bform\s+submissions?\b/.test(t)) return true;
  if (/\blist\b.*\b(?:leads?|forms?|clients?|submissions?)\b/.test(t)) return true;
  return false;
}

function tryParseLeadsReadCommand(text, raw) {
  const t = norm(text);

  if (t === 'leads today' || t === 'leads') {
    return { type: 'read', command: 'leads', days: 1 };
  }

  const exactDays = t.match(/^leads\s+(\d+)\s*days?$/);
  if (exactDays) {
    return { type: 'read', command: 'leads', days: clampLeadsDays(exactDays[1]) };
  }

  const range = parseLeadsDaysRange(t);
  if (range && isLeadsReadQuery(t)) {
    return { type: 'read', command: 'leads', days: range.days, rangeLabel: range.label };
  }

  if (isInternalOpsLeadQuery(t) || isInternalOpsLeadQuery(stripWakePrefix(raw))) {
    const wantsDetail = /\b(?:detail|details|describe|info|information|about|description)\b/i.test(raw);
    const internalRange = parseLeadsDaysRange(t) || parseLeadsDaysRange(stripWakePrefix(raw));
    return {
      type: 'read',
      command: 'leads',
      days: internalRange?.days ?? 1,
      rangeLabel: internalRange?.label,
      detail: wantsDetail && !internalRange,
    };
  }

  return null;
}

function youtubeSearchUrl(topic) {
  const q = String(topic || '').trim();
  if (!q || /^(music|songs?|videos?)$/i.test(q)) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(q || 'music')}`;
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

function googleSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(String(query || '').trim())}`;
}

function norm(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

function fuzzyMatchSkill(token) {
  const t = norm(token);
  if (!t) return null;
  const exact = EMPIRE_SKILL_IDS.find((id) => id === t);
  if (exact) return exact;
  return EMPIRE_SKILL_IDS.find((id) => id.includes(t) || t.includes(id)) || null;
}

function fuzzyMatchProject(token) {
  const t = norm(token).replace(/[^a-z0-9-]/g, '');
  if (!t) return null;
  const exact = ALL_EMPIRE_PROJECT_IDS.find((id) => id === t);
  if (exact) return exact;
  return ALL_EMPIRE_PROJECT_IDS.find((id) => id.includes(t) || t.includes(id)) || null;
}

function fuzzyMatchClient(token, clients) {
  const t = norm(token);
  if (!t || !clients?.length) return null;
  return (
    clients.find(
      (c) =>
        norm(c.full_name).includes(t) ||
        norm(c.company).includes(t) ||
        t.includes(norm(c.full_name)) ||
        t.includes(norm(c.company))
    ) || null
  );
}

function stripWakePrefix(input) {
  let s = fixSearchTypos(String(input || '').trim());
  s = s
    .replace(
      /^(?:hello\s+|hey\s+|ok(?:ay)?\s+)?(?:jarvis|jarvus|jervis|darbis|darwis|darwise|darwin|gervais|service)\s*[,:\s]*/gi,
      ''
    )
    .trim();
  return s || fixSearchTypos(String(input || '').trim());
}

function cleanOpenTarget(rest) {
  return String(rest || '')
    .trim()
    .replace(/\s+(?:right\s+now|now|please|sir)[.!?]*\s*$/i, '')
    .replace(/^the\s+/i, '')
    .trim();
}

function parseOpenBrowse(raw) {
  const openLineMatch = raw.match(/^(?:please\s+)?open\s+(?:the\s+)?(.+)$/i);
  if (!openLineMatch) return null;

  const rest = cleanOpenTarget(openLineMatch[1]);
  const restLower = rest.toLowerCase();
  if (!rest) return null;

  const ytSearchAbout = restLower.match(
    /^(?:youtube|yt)\b.*?\b(?:search(?:\s+for|\s+about)?|find|look(?:\s+up)?)\s+(?:about\s+)?(.+)$/i
  );
  if (ytSearchAbout) {
    const topic = normalizeSearchQuery(ytSearchAbout[1]);
    return {
      type: 'action',
      command: 'browse',
      url: youtubeSearchUrl(topic),
      label: `YouTube: ${topic}`,
      needsConfirm: false,
    };
  }

  if (/\b(youtube|yt)\b/.test(restLower) && /\b(play|music|song|songs|listen|watch|video|videos)\b/.test(restLower)) {
    const topic = restLower
      .match(/\b(?:play|watch|listen to)\s+(?:music\s+)?(?:about\s+)?(.+?)(?:\s+on\s+youtube)?$/i)?.[1]
      || restLower.replace(/\b(and|on)?\s*(youtube|yt)\b/g, '').replace(/\b(play|watch|listen to|music|song|songs|search(?:\s+for|\s+about)?)\b/g, '').trim();
    return {
      type: 'action',
      command: 'browse',
      url: youtubeSearchUrl(topic),
      label: `YouTube: ${(topic || 'music').trim()}`,
      needsConfirm: false,
    };
  }

  const firstToken = restLower.match(/^([a-z0-9][-a-z0-9.]*)/i)?.[1];
  if (firstToken && TAB_ROUTES[firstToken] && !/\s/.test(rest.trim())) {
    return { type: 'action', command: 'open', tab: firstToken, route: TAB_ROUTES[firstToken], needsConfirm: false };
  }

  if (/\b(video|videos|watch)\b/.test(restLower)) {
    const topic = rest.replace(/\b(videos?|watch)\b/gi, '').trim() || rest.trim();
    return {
      type: 'action',
      command: 'browse',
      url: youtubeSearchUrl(topic),
      label: `YouTube: ${topic}`,
      needsConfirm: false,
    };
  }

  const siteToken = firstToken || restLower.split(/\s+/)[0];
  const url = resolveSiteUrl(rest) || resolveSiteUrl(siteToken);
  if (url) {
    return {
      type: 'action',
      command: 'browse',
      url,
      label: siteToken === 'the' ? rest : siteToken,
      needsConfirm: false,
    };
  }

  return {
    type: 'action',
    command: 'browse',
    url: googleSearchUrl(rest),
    label: rest,
    needsConfirm: false,
  };
}

/**
 * Parse user input into a command object or null (fall through to LLM).
 */
export function parseJarvisCommand(input, clients = []) {
  let raw = stripWakePrefix(input);
  const text = norm(raw);
  if (!text) return null;

  if (/^(?:please\s+)?(?:do it|try again|search again)$/i.test(text)) {
    return { type: 'read', command: 'search-retry' };
  }

  if (text === 'help' || text === '?') {
    return { type: 'read', command: 'help' };
  }

  if (text === 'status' || text === 'fleet status') {
    return { type: 'read', command: 'status' };
  }

  if (text.startsWith('status ')) {
    const clientToken = raw.slice(7).trim();
    const client = fuzzyMatchClient(clientToken, clients);
    return { type: 'read', command: 'status', client, clientToken };
  }

  if (text === 'fleet') {
    return { type: 'read', command: 'fleet' };
  }

  if (isInternalOpsProjectQuery(text) || isInternalOpsProjectQuery(raw)) {
    return { type: 'read', command: 'fleet' };
  }

  if (
    text === 'fleet events' ||
    text === 'any fleet events' ||
    text === 'check fleet events' ||
    text === 'check fleets' ||
    text === 'fleet activity' ||
    /^any fleet events\??$/.test(text)
  ) {
    return { type: 'read', command: 'fleet-events' };
  }

  const leadsCmd = tryParseLeadsReadCommand(text, raw);
  if (leadsCmd) return leadsCmd;

  if (text === 'briefing' || text === 'daily briefing') {
    return { type: 'read', command: 'briefing' };
  }

  if (
    /\b(?:what(?:'s| is)|how(?:'s| is)|tell me about)\s+(?:your|my|the)\s+(?:today'?s?\s+)?(?:work|day|plan|schedule|briefing|agenda|tasks?)\b/i.test(raw) ||
    /\bwhat\s+(?:is|are)\s+(?:your|my)\s+(?:today'?s?\s+)?work\b/i.test(raw) ||
    /\bwhat\s+(?:are|is)\s+you\s+(?:doing|working on)\s+(?:today|now)\b/i.test(raw) ||
    /\bhow\s+(?:is|was)\s+(?:work|your day)\b/i.test(raw)
  ) {
    return { type: 'read', command: 'briefing' };
  }

  const imageMatch = raw.match(
    /^(?:generate image|make image|draw(?:\s+an?)?\s+image(?:\s+of)?|image of|draw)\s+(.+)$/i
  );
  if (imageMatch) {
    return {
      type: 'action',
      command: 'image',
      prompt: imageMatch[1].trim(),
      needsConfirm: false,
      summary: `Generate image: ${imageMatch[1].trim().slice(0, 80)}`,
    };
  }

  // Open / browse / play — must run before web-search so "open youtube and search about X" opens YouTube.
  const goMatch = raw.match(/^(?:go to|browse|visit|open site)\s+(.+)$/i);
  if (goMatch) {
    const url = resolveSiteUrl(goMatch[1].trim());
    if (url) {
      return {
        type: 'action',
        command: 'browse',
        url,
        label: goMatch[1].trim(),
        needsConfirm: false,
      };
    }
  }

  if (/\b(?:on|in)\s+(?:the\s+)?(?:youtube|yt)\b/i.test(raw) && !/\b(?:search the web|google search)\b/i.test(raw)) {
    const topicMatch = raw.match(/\b(?:about|for|search(?:ing)?(?:\s+for|\s+about)?|find|look(?:\s+up)?)\s+(?:about\s+)?(.+)$/i);
    const topic = topicMatch ? normalizeSearchQuery(topicMatch[1]) : null;
    return {
      type: 'action',
      command: 'browse',
      url: topic ? youtubeSearchUrl(topic) : 'https://www.youtube.com',
      label: topic ? `YouTube: ${topic}` : 'YouTube',
      needsConfirm: false,
    };
  }

  if (/\b(youtube|yt)\b/i.test(raw) && /\b(play|music|song|songs|listen|watch|video|videos)\b/i.test(raw)) {
    const topic = raw
      .match(/\b(?:play|watch|listen to)\s+(?:music\s+)?(?:about\s+)?(.+?)(?:\s+on\s+youtube)?$/i)?.[1]
      || raw.replace(/\b(on\s+)?(youtube|yt)\b/gi, '').replace(/\b(play|watch|listen to|music|song|songs)\b/gi, '').trim();
    return {
      type: 'action',
      command: 'browse',
      url: youtubeSearchUrl(topic),
      label: `YouTube: ${(topic || 'music').trim()}`,
      needsConfirm: false,
    };
  }

  const playMatch = raw.match(/^play\s+(?:me\s+)?(?:some\s+)?(.+)$/i);
  if (playMatch) {
    const topic = playMatch[1].replace(/\bon\s+youtube\b/i, '').trim();
    return {
      type: 'action',
      command: 'browse',
      url: youtubeSearchUrl(topic),
      label: `YouTube: ${topic || 'music'}`,
      needsConfirm: false,
    };
  }

  const openBrowse = parseOpenBrowse(raw);
  if (openBrowse) return openBrowse;

  const openUrlMatch = raw.match(/^open\s+(https?:\/\/.+)$/i);
  if (openUrlMatch) {
    return {
      type: 'action',
      command: 'browse',
      url: openUrlMatch[1].trim(),
      label: openUrlMatch[1].trim(),
      needsConfirm: false,
    };
  }

  // ─── Google Calendar agenda ──────────────────────────────────────────────────
  if (
    text === 'agenda' ||
    text === "what's on today" ||
    text === 'what is on today' ||
    text === "what's on" ||
    /^(?:show|check|get|pull up|what(?:'s|\s+is))\s+(?:my\s+)?(?:agenda|calendar|schedule|events?)(?:\s+(?:for\s+)?today)?$/.test(text)
  ) {
    return { type: 'read', command: 'agenda', range: 'today' };
  }

  if (
    /^(?:agenda|calendar|schedule|events?|what(?:'s|\s+is)\s+on)\s+(?:this\s+)?week$/.test(text) ||
    /^what(?:'s|\s+is)\s+on\s+this\s+week$/.test(text) ||
    /^show\s+(?:my\s+)?(?:week(?:ly)?\s+)?(?:agenda|calendar|schedule)$/.test(text)
  ) {
    return { type: 'read', command: 'agenda', range: 'week' };
  }

  const agendaDayMatch = raw.match(
    /^(?:am\s+i\s+free|what(?:'s|\s+is)\s+on|agenda|calendar|schedule|events?)\s+(?:on\s+)?(\w+day|tomorrow)\??$/i
  );
  if (agendaDayMatch) {
    return { type: 'read', command: 'agenda', range: 'day', day: agendaDayMatch[1] };
  }

  // ─── PageSpeed audit ─────────────────────────────────────────────────────────
  const speedMatch = raw.match(
    /^(?:speed\s+(?:check|test|audit)|pagespeed(?:\s+check)?|site\s+speed|check\s+(?:the\s+)?speed(?:\s+of)?|audit(?:\s+site)?)\s+(.+)$/i
  );
  if (speedMatch) {
    return { type: 'read', command: 'pagespeed', url: speedMatch[1].trim() };
  }

  const speedOfMatch = raw.match(
    /^(?:how\s+(?:fast|slow|quick)(?:\s+is)?|what(?:'s|\s+is)\s+the\s+speed\s+of)\s+(.+?)[\s?!.]*$/i
  );
  if (speedOfMatch) {
    return { type: 'read', command: 'pagespeed', url: speedOfMatch[1].trim() };
  }

  // ─── Companies House lookup — must fire before broad look-up/search patterns ──
  const chExplicit = raw.match(
    /^(?:companies\s+house|find\s+company|check\s+company|company\s+details?|company\s+profile)\s+(.+)$/i
  );
  if (chExplicit) {
    return { type: 'read', command: 'company', query: chExplicit[1].trim() };
  }

  const whoRunsMatch = raw.match(
    /^who\s+(?:runs?|owns?|is\s+behind|founded|controls?|directs?)\s+(.+?)[\s?!.]*$/i
  );
  if (whoRunsMatch) {
    return { type: 'read', command: 'company', query: whoRunsMatch[1].trim() };
  }

  const lookUpChMatch = raw.match(
    /^look\s*up\s+(.+?)\s+on\s+companies\s+house$/i
  );
  if (lookUpChMatch) {
    return { type: 'read', command: 'company', query: lookUpChMatch[1].trim() };
  }

  // Broad search-intent detection (after open/browse so embedded "search about" on open-youtube still browses).
  const searchMatch = raw.match(
    /^(?:search|serach|google|look\s*up|lookup)(?:\s+(?:on\s+google|the\s+web|the\s+internet))?(?:\s+(?:for|about|the web for))*\s+(.+)$/i
  );
  const intentSearch = !/^open\s/i.test(raw)
    ? raw.match(
        /\b(?:search|serach|look\s*up|lookup)\b(?:\s+(?:on\s+google|the\s+web|the\s+internet))?(?:\s+(?:for|about|the web for))*\s+(.+)$/i
      )
    : null;
  const findSearch = raw.match(
    /\bfind\s+(?:me\s+)?(.+?)\s+(?:on|via|using)\s+(?:google|the\s+web|the\s+internet|online)\b.*$/i
  );
  const searchQuery = searchMatch
    ? normalizeSearchQuery(searchMatch[1])
    : intentSearch
      ? normalizeSearchQuery(intentSearch[1])
      : findSearch
        ? normalizeSearchQuery(findSearch[1])
        : /\b(?:search|serach|look\s*up|lookup)\b/i.test(raw) && !/^open\s/i.test(raw)
          ? extractSearchQueryFromTranscript(raw)
          : null;
  if (searchQuery && searchQuery.length > 2) {
    return { type: 'read', command: 'search', query: searchQuery };
  }

  const aboutOnly = raw.match(/^about\s+(.+)$/i);
  if (aboutOnly) {
    const q = normalizeSearchQuery(aboutOnly[1]);
    if (q.length > 2) return { type: 'read', command: 'search', query: q };
  }

  if (/\b(price|prices|cost)\b/i.test(text) && text.length > 5) {
    return { type: 'read', command: 'search', query: normalizeSearchQuery(raw) };
  }

  const priceMatch = text.match(
    /^(?:what(?:'s| is) the )?(?:current )?(?:price of )?(.+?)(?:\s+price)?(?:\s+today)?$/i
  );
  if (priceMatch && /\b(gold|silver|bitcoin|btc|eth|oil|gas|stock|share)\b/i.test(text)) {
    return { type: 'read', command: 'search', query: normalizeSearchQuery(text) };
  }

  // Mid-sentence open: "… please open youtube right now"
  const looseOpen = parseOpenBrowse(
    raw.match(/\b(?:please\s+)?open\s+(?:the\s+)?(.+?)(?:\s+(?:right\s+now|now|please|sir))?[.!?]*\s*$/i)?.[0] || ''
  );
  if (looseOpen) return looseOpen;

  const runMatch = raw.match(/^run\s+(\S+)\s+(\S+)$/i);
  if (runMatch) {
    const skill = fuzzyMatchSkill(runMatch[1]);
    const project = fuzzyMatchProject(runMatch[2]);
    if (skill && project) {
      return {
        type: 'action',
        command: 'run',
        skill,
        project,
        needsConfirm: true,
        summary: `Queue agent "${skill}" on project "${project}"`,
      };
    }
  }

  const reportMatch = raw.match(/^report\s+(.+)$/i);
  if (reportMatch) {
    const client = fuzzyMatchClient(reportMatch[1], clients);
    if (client) {
      return {
        type: 'action',
        command: 'report',
        client,
        needsConfirm: true,
        summary: `Generate monthly report for ${client.full_name || client.company || 'client'}`,
      };
    }
  }

  const pauseMatch = text.match(/^pause\s+(\S+)$/);
  if (pauseMatch) {
    const agent = fuzzyMatchSkill(pauseMatch[1]) || pauseMatch[1];
    return {
      type: 'action',
      command: 'pause',
      agent,
      needsConfirm: true,
      summary: `Pause agent "${agent}" — pending tasks will not auto-run`,
    };
  }

  const resumeMatch = text.match(/^resume\s+(\S+)$/);
  if (resumeMatch) {
    const agent = fuzzyMatchSkill(resumeMatch[1]) || resumeMatch[1];
    return {
      type: 'action',
      command: 'resume',
      agent,
      needsConfirm: true,
      summary: `Resume agent "${agent}"`,
    };
  }

  return null;
}

export { TAB_ROUTES, READ_COMMANDS, ACTION_COMMANDS };
