import { getProjectLabel } from '@/lib/empire-projects';

/** Snapshot API returns KPI fields at top level; normalize for compose helpers. */
export function normalizeJarvisContext(data = {}) {
  if (!data || typeof data !== 'object') {
    return {
      snapshot: {},
      clients: [],
      projects: [],
      activity: [],
      tasksRecent: [],
      fleet: [],
      fleetEvents: [],
      recentLeads: [],
      leadsHistory: {},
    };
  }
  const {
    snapshot,
    clients,
    projects,
    activity,
    tasksRecent,
    fleet,
    fleetEvents,
    recentLeads,
    leadsHistory,
    ok,
    error,
    ...kpi
  } = data;
  return {
    snapshot: snapshot || kpi,
    clients: clients || [],
    projects: projects || [],
    activity: activity || [],
    tasksRecent: tasksRecent || [],
    fleet: fleet || [],
    fleetEvents: fleetEvents || [],
    recentLeads: recentLeads || [],
    leadsHistory: leadsHistory || {},
  };
}

function leadComparison(today, yesterday) {
  if (yesterday === 0 && today === 0) return 'no comparison data yet';
  if (yesterday === 0) return `up from 0 yesterday`;
  const diff = today - yesterday;
  if (diff === 0) return 'unchanged from yesterday';
  if (diff > 0) return `up from ${yesterday} yesterday`;
  return `down from ${yesterday} yesterday`;
}

export function composeStatus(data, client) {
  const s = data.snapshot || {};
  if (client) {
    const projects = (data.projects || []).filter((p) => p.client_id === client.id);
    const lines = [
      `Client: ${client.full_name || client.company || client.id}`,
      `Projects: ${projects.length}`,
    ];
    for (const p of projects.slice(0, 5)) {
      lines.push(`  · ${p.project_name} — ${p.status || 'active'}`);
    }
    if (!projects.length) lines.push('No projects on file for this client, sir.');
    return lines.join('\n');
  }

  return [
    'Fleet status, sir.',
    `Leads today: ${s.leadsToday ?? 0} (${leadComparison(s.leadsToday ?? 0, s.leadsYesterday ?? 0)})`,
    `Form submissions today: ${s.formsToday ?? 0} | total: ${s.formsTotal ?? 0}`,
    `Onboarding today: ${s.onboardToday ?? 0} | total: ${s.onboardTotal ?? 0}`,
    `Task queue: ${s.tasksQueued ?? 0} pending or running`,
  ].join('\n');
}

export function composeFleetEvents(data) {
  const events = data.fleetEvents || [];
  if (!events.length) {
    return 'No fleet events yet, sir. Sister projects push leads and forms to the central ingest.';
  }
  const lines = [`Fleet events (last ${events.length}):`];
  for (const e of events.slice(0, 10)) {
    const when = e.created_at?.slice(0, 16)?.replace('T', ' ') || '?';
    lines.push(`  · ${when} [${e.project}] ${e.event_type}: ${String(e.summary || '').slice(0, 100)}`);
  }
  if (events.length > 10) lines.push(`  … and ${events.length - 10} more in the feed.`);
  return lines.join('\n');
}

export function composeFleet(data) {
  const fleet = data.fleet || [];
  if (!fleet.length) {
    return 'Fleet analysis not available yet, sir. Run analyse on Empire OS.';
  }
  const done = fleet.filter((p) => p.status === 'done').length;
  const failed = fleet.filter((p) => p.status === 'failed').length;
  const running = fleet.filter((p) => p.status === 'running').length;
  const lines = [
    `Fleet overview: ${fleet.length} projects tracked.`,
    `Done: ${done} | Running: ${running} | Failed: ${failed}`,
  ];
  for (const p of fleet.slice(0, 8)) {
    lines.push(`  · ${getProjectLabel(p.project_id)} — ${p.status}`);
  }
  if (failed > 0) {
    const warnings = fleet.filter((p) => p.status === 'failed').slice(0, 3);
    for (const w of warnings) {
      lines.push(`  ⚠ ${getProjectLabel(w.project_id)}: ${(w.error_message || 'failed').slice(0, 60)}`);
    }
  }
  return lines.join('\n');
}

export function composeLeads(data, days = 1, opts = {}) {
  const s = data.snapshot || {};
  const detail = opts.detail;

  function isLeadFromToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const leadDate = new Date(dateStr);
    return leadDate.toDateString() === today.toDateString();
  }

  function formatLeadLine(l) {
    const parts = [l.name || 'Unknown'];
    if (l.email) parts.push(l.email);
    if (l.phone) parts.push(l.phone);
    if (l.businessType) parts.push(l.businessType);
    if (l.message) parts.push(`"${String(l.message).slice(0, 120)}"`);
    const when = l.date?.slice(0, 16)?.replace('T', ' ') || '?';
    return `  · ${parts.join(' | ')} (${l.source}, ${when})`;
  }

  if (days === 1) {
    const cmp = leadComparison(s.leadsToday ?? 0, s.leadsYesterday ?? 0);
    const todayLeads = (data.recentLeads || []).filter((l) => isLeadFromToday(l.date));

    if ((s.leadsToday ?? 0) === 0) {
      return `No leads yet today, sir. The pipeline awaits. (${cmp})`;
    }

    if (detail && todayLeads.length) {
      const lines = [`Sir, ${todayLeads.length} new lead(s) today — ${cmp}:`];
      for (const l of todayLeads) lines.push(formatLeadLine(l));
      return lines.join('\n');
    }

    let summary = `Leads today: ${s.leadsToday ?? 0}, ${cmp}.\nForms: ${s.formsToday ?? 0} | Onboarding: ${s.onboardToday ?? 0}`;
    if (todayLeads.length === 1) {
      summary += `\nLatest: ${todayLeads[0].name || 'Unknown'} (${todayLeads[0].source}). Say "details on today's lead" for full info, sir.`;
    } else if (todayLeads.length > 1) {
      summary += `\n${todayLeads.length} lead(s) on file today — ask for details, sir.`;
    }
    return summary;
  }
  const hist = data.leadsHistory?.[days];
  const period = opts.rangeLabel || `the last ${days} days`;
  if (hist == null) return `Lead count for ${period} is not tracked yet, sir.`;
  return `Leads in ${period}: ${hist}.`;
}

export function composeBriefing(data) {
  const s = data.snapshot || {};
  const activity = (data.activity || []).slice(0, 3);
  const failedTasks = (data.tasksRecent || []).filter((t) => t.status === 'failed');
  const cmp = leadComparison(s.leadsToday ?? 0, s.leadsYesterday ?? 0);

  const lines = [
    'Morning briefing, sir.',
    `Leads today: ${s.leadsToday ?? 0}, ${cmp}.`,
    `Tasks queued: ${s.tasksQueued ?? 0}.`,
  ];

  const fleetEvents = (data.fleetEvents || []).slice(0, 5);
  if (fleetEvents.length) {
    lines.push('Recent fleet events (all projects):');
    for (const e of fleetEvents) {
      lines.push(`  · ${e.created_at?.slice(0, 16) || '?'} — ${e.project} ${e.event_type}: ${String(e.summary || '').slice(0, 60)}`);
    }
  } else if (activity.length) {
    lines.push('Recent activity:');
    for (const e of activity) {
      lines.push(`  · ${e.created_at?.slice(0, 16) || '?'} — ${e.project_id} ${e.event_type}`);
    }
  } else {
    lines.push('No recent fleet or activity events.');
  }

  if (failedTasks.length) {
    lines.push(`Flagged: ${failedTasks.length} failed task(s) in queue.`);
  }

  return lines.join('\n');
}

export const HELP_CARD = {
  type: 'help',
  title: 'JARVIS Commands',
  sections: [
    { label: 'Read (instant)', items: ['status', 'status [client]', 'leads today', 'leads [n] days', 'leads this week', 'leads last month', 'how many leads last 30 days', 'briefing', 'fleet', 'fleet events', 'any fleet events'] },
    { label: 'Navigate', items: ['open fleet | clients | leads | agents | activity | reports', 'open youtube | google | [site]', 'go to [website]'] },
    { label: 'Web & media', items: ['search [query]', 'google [query]', 'draw [description]', 'generate image [description]'] },
    { label: 'Actions (confirm)', items: ['run [skill] [project]', 'report [client]', 'pause [agent]', 'resume [agent]'] },
    { label: 'Other', items: ['help', 'natural language → AI with live context + web search'] },
  ],
};

export function composeCompanyResult(data) {
  if (!data?.found) return 'No match on Companies House, sir.';

  const addr = data.address;
  const addressLine = addr
    ? [addr.address_line_1, addr.address_line_2, addr.locality, addr.region, addr.postal_code, addr.country]
        .filter(Boolean)
        .join(', ')
    : null;

  const lines = [
    `Company: ${data.name ?? '—'}`,
    `Status: ${data.status ?? '—'}`,
    `Number: ${data.companyNumber ?? '—'}`,
    `Incorporated: ${data.incorporationDate ?? '—'}`,
    `Type: ${data.type ?? '—'}`,
  ];
  if (addressLine) lines.push(`Address: ${addressLine}`);
  if (data.sicCodes?.length) lines.push(`SIC: ${data.sicCodes.join(', ')}`);

  const activeOfficers = (data.officers ?? []).filter((o) => !o.resignedOn);
  if (activeOfficers.length) {
    lines.push(`Directors (active): ${activeOfficers.map((o) => o.name).join(', ')}`);
  }

  const activePscs = (data.pscs ?? []).filter((p) => !p.ceasedOn);
  if (activePscs.length) {
    lines.push(`PSCs: ${activePscs.map((p) => p.name).join(', ')}`);
  }

  if (data.filings?.length) {
    lines.push('Recent filings:');
    for (const f of data.filings) {
      lines.push(`  · ${f.date ?? '?'} — ${f.description ?? 'Filing'}`);
    }
  }

  return lines.join('\n');
}

export function composeCompanySpoken(data) {
  if (!data?.found) return 'No match on Companies House, sir.';
  const statusPart = data.status ? ` — currently ${data.status}` : '';
  const datePart = data.incorporationDate ? `, incorporated ${data.incorporationDate}` : '';
  return `${data.name ?? 'Unknown company'}${statusPart}${datePart}. Company number ${data.companyNumber ?? 'not found'}.`;
}

export function composePageSpeedResult(data) {
  if (!data) return 'PageSpeed audit failed, sir. Check the URL and try again.';

  const s = data.scores;
  const v = data.vitals;
  const strategy = data.strategy === 'desktop' ? 'Desktop' : 'Mobile';

  const scoreStr = (n) => (n != null ? `${n}/100` : '—');

  const lines = [
    `PageSpeed — ${strategy}: ${data.url}`,
    `Fetched: ${data.fetchTime ? data.fetchTime.slice(0, 19).replace('T', ' ') : '—'}`,
    `Scores:`,
    `  Performance:    ${scoreStr(s?.performance)}`,
    `  Accessibility:  ${scoreStr(s?.accessibility)}`,
    `  Best Practices: ${scoreStr(s?.bestPractices)}`,
    `  SEO:            ${scoreStr(s?.seo)}`,
  ];

  lines.push('Core Web Vitals:');
  if (v?.fcp?.displayValue) lines.push(`  FCP:  ${v.fcp.displayValue}`);
  if (v?.lcp?.displayValue) lines.push(`  LCP:  ${v.lcp.displayValue}`);
  if (v?.tbt?.displayValue) lines.push(`  TBT:  ${v.tbt.displayValue}`);
  if (v?.cls?.displayValue) lines.push(`  CLS:  ${v.cls.displayValue}`);
  if (v?.tti?.displayValue) lines.push(`  TTI:  ${v.tti.displayValue}`);

  if (data.opportunities?.length) {
    lines.push('Top opportunities:');
    for (const o of data.opportunities) {
      const savings = o.savingsMs > 0 ? ` (saves ~${(o.savingsMs / 1000).toFixed(1)}s)` : '';
      lines.push(`  · ${o.title ?? 'Opportunity'}${savings}`);
    }
  }

  return lines.join('\n');
}

export function composePageSpeedSpoken(data) {
  if (!data) return 'PageSpeed audit failed, sir.';
  const perf = data.scores?.performance;
  const perfStr = perf != null ? `${perf} out of 100` : 'unavailable';
  const strategy = data.strategy === 'desktop' ? 'desktop' : 'mobile';
  const opp = data.opportunities?.[0]?.title;
  const oppStr = opp ? ` Top opportunity: ${opp}.` : '';
  return `${strategy.charAt(0).toUpperCase() + strategy.slice(1)} performance score for ${data.url} is ${perfStr}.${oppStr}`;
}

export function composeReadResponse(command, data) {
  switch (command.command) {
    case 'status':
      return { content: composeStatus(data, command.client), cards: buildClientCards(data, command.client) };
    case 'fleet':
      return { content: composeFleet(data), cards: [] };
    case 'fleet-events':
      return { content: composeFleetEvents(data), cards: [] };
    case 'leads':
      return {
        content: composeLeads(data, command.days || 1, {
          detail: command.detail,
          rangeLabel: command.rangeLabel,
        }),
        cards: buildLeadCards(data),
      };
    case 'briefing':
      return { content: composeBriefing(data), cards: buildActivityCards(data) };
    case 'help':
      return { content: 'Command reference below, sir.', cards: [HELP_CARD] };
    case 'search':
      return { content: null, cards: [], searchQuery: command.query };
    default:
      return null;
  }
}

function buildClientCards(data, filterClient) {
  const clients = filterClient ? [filterClient] : (data.clients || []).slice(0, 5);
  return clients.map((c) => ({
    type: 'client',
    id: c.id,
    name: c.full_name || c.company || 'Client',
    company: c.company,
    projectCount: (data.projects || []).filter((p) => p.client_id === c.id).length,
    status: (data.projects || []).find((p) => p.client_id === c.id)?.status || 'active',
  }));
}

function buildLeadCards(data) {
  return (data.recentLeads || []).slice(0, 5).map((l) => ({
    type: 'lead',
    id: l.id,
    name: l.name,
    source: l.source,
    date: l.date,
  }));
}

function buildActivityCards(data) {
  return (data.activity || [])
    .filter((e) => e.event_type?.includes('report') || e.status === 'failed')
    .slice(0, 3)
    .map((e) => ({
      type: 'report',
      projectId: e.project_id,
      eventType: e.event_type,
      date: e.created_at,
      message: e.message,
    }));
}
