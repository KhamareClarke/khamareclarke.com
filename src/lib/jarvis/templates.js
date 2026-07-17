import { getProjectLabel, ALL_EMPIRE_PROJECT_IDS, getProjectRootUrl } from '@/lib/empire-projects';

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
      leadsHistoryMeta: {},
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
    leadsHistoryMeta,
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
    leadsHistoryMeta: leadsHistoryMeta || {},
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

export function composeFleetEvents(data, opts = {}) {
  const project = opts.project || null;
  const formsOnly = Boolean(opts.formsOnly);
  const allProjects = Boolean(opts.allProjects) || !project;
  let events = data.fleetEvents || [];
  if (project) {
    events = events.filter((e) => String(e.project || '').toLowerCase() === project);
  }
  if (formsOnly) {
    events = events.filter((e) =>
      /form|lead|enquir|contact|signup|quote|order|client/i.test(String(e.event_type || ''))
    );
  }

  const label = project ? getProjectLabel(project) : 'all projects';
  if (!events.length) {
    const hubToday = data.snapshot?.leadsToday ?? 0;
    if (!project && hubToday > 0) {
      return `No sister-site fleet lead events yet, sir. Hub leads today: ${hubToday} (forms ${data.snapshot?.formsToday ?? 0} | onboarding ${data.snapshot?.onboardToday ?? 0}).`;
    }
    return project
      ? `No ${formsOnly ? 'form/lead ' : ''}fleet events for ${label} yet, sir. Sister sites push forms to the central ingest.`
      : 'No fleet lead events yet across projects, sir. Sister sites push leads and forms to the central ingest.';
  }

  const byProject = {};
  for (const e of events) {
    const key = String(e.project || 'unknown').toLowerCase();
    byProject[key] = (byProject[key] || 0) + 1;
  }

  const lines = [
    project
      ? `${formsOnly ? 'Form/lead events' : 'Fleet events'} for ${label} (last ${Math.min(events.length, 12)}):`
      : `${formsOnly ? 'Leads / form events across all projects' : 'Fleet events'} (last ${Math.min(events.length, 12)}):`,
  ];

  if (allProjects && !project && Object.keys(byProject).length) {
    lines.push('By project:');
    for (const [pid, count] of Object.entries(byProject).sort((a, b) => b[1] - a[1])) {
      lines.push(`  · ${getProjectLabel(pid)}: ${count}`);
    }
  }

  lines.push('Recent:');
  for (const e of events.slice(0, 12)) {
    const when = e.created_at?.slice(0, 16)?.replace('T', ' ') || '?';
    lines.push(`  · ${when} [${e.project}] ${e.event_type}: ${String(e.summary || '').slice(0, 100)}`);
  }
  if (events.length > 12) lines.push(`  … and ${events.length - 12} more in the feed.`);
  return lines.join('\n');
}

export function composeFleet(data) {
  const fleet = data.fleet || [];
  const clientProjects = data.projects || [];
  const byId = fleet.reduce((acc, p) => {
    acc[p.project_id] = p;
    return acc;
  }, {});

  const roster = ALL_EMPIRE_PROJECT_IDS.filter((id) => !String(id).includes('test'));
  const lines = [`Our projects: ${roster.length} sister sites in the fleet.`];

  for (const id of roster) {
    const row = byId[id];
    const status = row?.status || 'tracked';
    const url = getProjectRootUrl(id);
    const note = row?.summary ? ` — ${String(row.summary).slice(0, 60)}` : '';
    lines.push(`  · ${getProjectLabel(id)}${url ? ` — ${url}` : ''} [${status}]${note}`);
  }

  const failed = fleet.filter((p) => p.status === 'failed');
  if (failed.length) {
    lines.push(`Analysis warnings: ${failed.length}`);
    for (const w of failed.slice(0, 3)) {
      lines.push(`  ⚠ ${getProjectLabel(w.project_id)}: ${(w.error_message || 'failed').slice(0, 60)}`);
    }
  }

  if (clientProjects.length) {
    lines.push(`Client projects on file: ${clientProjects.length}`);
    for (const p of clientProjects.slice(0, 8)) {
      lines.push(`  · ${p.project_name || 'Project'} — ${p.status || 'active'}`);
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
  const forms = data.leadsHistoryMeta?.[days]?.forms;
  const onboard = data.leadsHistoryMeta?.[days]?.onboard;
  const clientsOnFile = (data.clients || []).length;

  if (hist == null && forms == null) {
    return `Lead count for ${period} is not tracked yet, sir.`;
  }

  const total = hist ?? ((forms ?? 0) + (onboard ?? 0));
  const lines = [
    `Leads ${period}: ${total} (forms + onboarding).`,
  ];
  if (forms != null || onboard != null) {
    lines.push(`Form submissions ${period}: ${forms ?? 0}`);
    lines.push(`Onboarding clients ${period}: ${onboard ?? 0}`);
  }
  if (clientsOnFile > 0) {
    lines.push(`Client profiles on file: ${clientsOnFile} (not limited to ${period}).`);
  }
  const recent = (data.recentLeads || []).slice(0, 6);
  if (recent.length) {
    lines.push('Recent leads:');
    for (const l of recent) lines.push(formatLeadLine(l));
  }
  return lines.join('\n');
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
    { label: 'Read (instant)', items: ['status', 'status [client]', 'leads today', 'leads [n] days', 'leads this week', 'leads last month', 'how many leads last 30 days', 'briefing', 'fleet', 'our projects', 'fleet events', 'any fleet events'] },
    { label: 'Navigate', items: ['open fleet | clients | leads | agents | activity | reports', 'open youtube | google | [site]', 'go to [website]'] },
    { label: 'Web & media', items: ['search [query]', 'google [query]', 'draw [description]', 'generate image [description]'] },
    { label: 'Actions (confirm)', items: ['run [skill] [project]', 'report [client]', 'pause [agent]', 'resume [agent]'] },
    { label: 'Other', items: ['help', 'natural language → AI with live context + web search'] },
  ],
};

export function composeAgendaResult(data) {
  if (data?.notConnected) {
    return 'Google Calendar is not connected, sir. Connect it at /api/auth/google.';
  }
  const events = data?.events ?? [];
  if (!events.length) {
    return `No events found for ${data?.range || 'that period'}, sir.`;
  }
  const label = data?.range === 'week' ? 'this week' : data?.range === 'day' ? (data?.day || 'that day') : 'today';
  const lines = [`Agenda — ${label}: ${events.length} event(s).`];
  for (const e of events) {
    const timeStr = e.start
      ? new Date(e.start).toLocaleString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '?';
    const loc = e.location ? ` @ ${e.location}` : '';
    lines.push(`  · ${timeStr}${loc} — ${e.summary}`);
  }
  return lines.join('\n');
}

export function composeAgendaSpoken(data) {
  if (data?.notConnected) {
    return 'Google Calendar is not connected, sir. Follow the link in comms to authorise.';
  }
  const events = data?.events ?? [];
  if (!events.length) {
    return `Nothing in the calendar for ${data?.range || 'that period'}, sir.`;
  }
  const label = data?.range === 'week' ? 'this week' : data?.range === 'day' ? (data?.day || 'that day') : 'today';
  if (events.length === 1) {
    const e = events[0];
    const timeStr = e.start
      ? new Date(e.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : 'unknown time';
    return `One event ${label}, sir: ${e.summary} at ${timeStr}.`;
  }
  return `${events.length} events ${label}, sir. First up: ${events[0].summary}.`;
}

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
      return {
        content: composeFleetEvents(data, {
          project: command.project || null,
          formsOnly: command.formsOnly,
          allProjects: command.allProjects,
        }),
        cards: [],
      };
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
