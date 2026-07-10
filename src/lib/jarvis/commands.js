import { EMPIRE_SKILL_IDS } from '@/lib/empire-skills';
import { ALL_EMPIRE_PROJECT_IDS } from '@/lib/empire-projects';

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
  const raw = String(input || '').trim();
  const text = norm(raw);
  if (!text) return null;

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

  const openMatch = text.match(/^open\s+(\w+)$/);
  if (openMatch) {
    const tab = openMatch[1];
    if (TAB_ROUTES[tab]) {
      return { type: 'action', command: 'open', tab, route: TAB_ROUTES[tab], needsConfirm: false };
    }
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
