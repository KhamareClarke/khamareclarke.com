import { EMPIRE_SKILL_IDS } from '@/lib/empire-skills';
import { ALL_EMPIRE_PROJECT_IDS } from '@/lib/empire-projects';
import { resolveSiteUrl } from '@/lib/jarvis/sites';
import { extractSearchQueryFromTranscript, normalizeSearchQuery, fixSearchTypos } from '@/lib/jarvis/web-search';

const TAB_ROUTES = {
  fleet: '/dashboard/empire',
  clients: '/dashboard/clients',
  leads: '/dashboard/leads',
  agents: '/dashboard/empire',
  activity: '/dashboard/empire/activity',
  reports: '/dashboard/clients',
  settings: '/dashboard',
};

const READ_COMMANDS = new Set(['status', 'fleet', 'briefing', 'help', 'leads']);
const ACTION_COMMANDS = new Set(['run', 'report', 'pause', 'resume', 'open']);

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

/**
 * Parse user input into a command object or null (fall through to LLM).
 */
export function parseJarvisCommand(input, clients = []) {
  let raw = fixSearchTypos(String(input || '').trim());
  raw = raw.replace(/^(?:hello\s+)?(?:hey\s+)?jarvis[,:\s]+/i, '').trim() || fixSearchTypos(String(input || '').trim());
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

  if (text === 'leads today' || text === 'leads') {
    return { type: 'read', command: 'leads', days: 1 };
  }

  const leadsMatch = text.match(/^leads\s+(\d+)\s*days?$/);
  if (leadsMatch) {
    return { type: 'read', command: 'leads', days: Math.min(parseInt(leadsMatch[1], 10) || 1, 30) };
  }

  if (text === 'briefing' || text === 'daily briefing') {
    return { type: 'read', command: 'briefing' };
  }

  // Broad search-intent detection: search / google / look up / find (on google/web).
  const searchMatch = raw.match(
    /^(?:search|serach|google|look\s*up|lookup)(?:\s+(?:on\s+google|the\s+web|the\s+internet))?(?:\s+(?:for|about|the web for))*\s+(.+)$/i
  );
  const intentSearch = raw.match(
    /\b(?:search|serach|look\s*up|lookup)\b(?:\s+(?:on\s+google|the\s+web|the\s+internet))?(?:\s+(?:for|about|the web for))*\s+(.+)$/i
  );
  const findSearch = raw.match(
    /\bfind\s+(?:me\s+)?(.+?)\s+(?:on|via|using)\s+(?:google|the\s+web|the\s+internet|online)\b.*$/i
  );
  const searchQuery = searchMatch
    ? normalizeSearchQuery(searchMatch[1])
    : intentSearch
      ? normalizeSearchQuery(intentSearch[1])
      : findSearch
        ? normalizeSearchQuery(findSearch[1])
        : /\b(?:search|serach|look\s*up|lookup)\b/i.test(raw)
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

  // "play <topic>" (no site named) → YouTube search.
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

  const openLineMatch = raw.match(/^open\s+(.+)$/i);
  if (openLineMatch) {
    const rest = openLineMatch[1].trim();
    const restLower = rest.toLowerCase();

    // "open youtube and play cat videos" / "open cat videos on youtube" → YouTube search.
    if (/\b(youtube|yt)\b/.test(restLower) && /\b(play|music|song|songs|listen|watch|video|videos)\b/.test(restLower)) {
      const topic = restLower
        .match(/\b(?:play|watch|listen to)\s+(?:music\s+)?(?:about\s+)?(.+?)(?:\s+on\s+youtube)?$/i)?.[1]
        || restLower.replace(/\b(and|on)?\s*(youtube|yt)\b/g, '').replace(/\b(play|watch|listen to|music|song|songs)\b/g, '').trim();
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

    // "open cat videos" / "open ... video" with no explicit site → YouTube search.
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
    const url = resolveSiteUrl(rest.trim()) || resolveSiteUrl(siteToken);
    if (url) {
      return {
        type: 'action',
        command: 'browse',
        url,
        label: siteToken,
        needsConfirm: false,
      };
    }

    // Fallback: "open <anything>" → Google search so JARVIS never refuses.
    return {
      type: 'action',
      command: 'browse',
      url: googleSearchUrl(rest.trim()),
      label: rest.trim(),
      needsConfirm: false,
    };
  }

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
