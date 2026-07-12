'use client';

import { useEffect, useState } from 'react';
import { useJarvis } from './JarvisProvider';

const TAB_LABELS = {
  leads:    'Leads',
  clients:  'Clients',
  empire:   'Empire OS',
  activity: 'Activity',
};

/* ─── Sub-panels ──────────────────────────────────────────────────────────── */

function LeadsPanel() {
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/submissions', { credentials: 'include', cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/onboarding',  { credentials: 'include', cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
    ]).then(([subs, onb]) => {
      /* API returns { submissions: [...] } and { clients: [...] } */
      const subsArr = Array.isArray(subs) ? subs : (subs?.submissions ?? subs?.data ?? []);
      const onbArr  = Array.isArray(onb)  ? onb  : (onb?.clients  ?? onb?.data  ?? []);

      const combined = [
        ...subsArr.map((s) => ({
          _key:    `form-${s.id ?? s.created_at}`,
          _name:   s.data?.name || s.data?.email || 'Unknown',
          _email:  s.data?.email || '',
          _source: 'Contact form',
          _date:   s.created_at,
          _msg:    s.data?.message ?? null,
        })),
        ...onbArr.map((c) => ({
          _key:    `onb-${c.id ?? c.created_at}`,
          _name:   c.company_name || c.contact_name || c.email || 'Unknown',
          _email:  c.email || '',
          _source: 'Onboarding',
          _date:   c.created_at,
          _msg:    c.current_challenges || c.goals || null,
        })),
      ].sort((a, b) => new Date(b._date || 0) - new Date(a._date || 0));

      setLeads(combined);
    });
  }, []);

  if (!leads) return <PanelLoading />;
  if (!leads.length) return <PanelEmpty label="No leads yet" />;

  return (
    <div className="space-y-1">
      {leads.slice(0, 30).map((lead) => (
        <div key={lead._key} className="jarvis-panel-row">
          <div className="flex-1 min-w-0">
            <p className="text-[#fff8e1]/92 text-[11px] font-medium truncate">{lead._name}</p>
            <p className="text-[#ffb700]/55 text-[9px] truncate">{lead._email}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-0.5">
            <span className="text-[8px] uppercase tracking-wider text-[#ff8c00]/75 bg-[#1a0800]/60 px-1.5 py-0.5 rounded-full">
              {lead._source}
            </span>
            {lead._date && (
              <span className="text-[8px] text-[#ffb700]/35">
                {new Date(lead._date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientsPanel() {
  const [clients, setClients] = useState(null);

  useEffect(() => {
    fetch('/api/admin/clients', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setClients(data.clients ?? []))
      .catch(() => setClients([]));
  }, []);

  if (!clients) return <PanelLoading />;
  if (!clients.length) return <PanelEmpty label="No portal clients yet" />;

  return (
    <div className="space-y-1">
      {clients.map((c, i) => (
        <div key={c.id ?? i} className="jarvis-panel-row">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffca28] to-[#ff8c00] flex items-center justify-center text-[#080600] text-[10px] font-bold shrink-0">
            {(c.full_name || c.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#fff8e1]/92 text-[11px] font-medium truncate">{c.full_name || '—'}</p>
            <p className="text-[#ffb700]/55 text-[9px] truncate">{c.company || c.email || ''}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
            {c.project_count > 0 && (
              <span className="text-[8px] text-[#ffb700]/45">{c.project_count}p</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmpirePanel() {
  const { liveData } = useJarvis();
  const projects = liveData?.projects ?? [];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        <MetricTile label="Projects"       value={projects.length || '—'}      />
        <MetricTile label="Tasks queued"   value={liveData?.tasksQueued ?? '—'} />
        <MetricTile label="Active clients" value={liveData?.clients?.length ?? '—'} />
        <MetricTile label="Leads today"    value={liveData?.leadsToday ?? '—'}  />
      </div>
      {projects.length > 0 && (
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-[#ffb700]/50">Active projects</p>
          {projects.map((p, i) => (
            <div key={p.id ?? i} className="jarvis-panel-row">
              <div className="flex-1 min-w-0">
                <p className="text-[#fff8e1]/90 text-[11px] truncate">{p.name || p.title || '—'}</p>
                {p.status && <p className="text-[9px] text-[#ffb700]/50 mt-0.5">{p.status}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityPanel() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/api/empire/activity/list?limit=25', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : (data?.data ?? data?.items ?? [])))
      .catch(() => setItems([]));
  }, []);

  if (!items) return <PanelLoading />;
  if (!items.length) return <PanelEmpty label="No recent activity" />;

  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="jarvis-panel-row gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb700]/55 shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1 min-w-0">
            <p className="text-[#fff8e1]/85 text-[11px] leading-snug">
              {item.description || item.action || item.label || '—'}
            </p>
            {item.created_at && (
              <p className="text-[9px] text-[#ffb700]/38 mt-0.5">
                {new Date(item.created_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricTile({ label, value }) {
  return (
    <div className="jarvis-panel-metric">
      <p className="text-[#ffb700] text-base font-light tabular-nums leading-none">{value}</p>
      <p className="text-[8px] uppercase tracking-wider text-[#ffca28]/55 mt-1">{label}</p>
    </div>
  );
}

function PanelLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="text-[#ffb700]/40 text-[9px] uppercase tracking-widest animate-pulse">Loading…</span>
    </div>
  );
}

function PanelEmpty({ label }) {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="text-[#ffb700]/35 text-[9px] uppercase tracking-widest">{label}</span>
    </div>
  );
}

/* ─── Shell — no internal tab bar; navigation lives in HUD dock ─────────── */

export default function JarvisDataPanels({ activeTab, onTabChange }) {
  return (
    <div className="jarvis-data-panels-wrap w-full shrink-0">
      {/* Slim header: panel title + close */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-[#ffb700]/10 shrink-0">
        <p className="text-[9px] uppercase tracking-[0.28em] text-[#ffca28]/80 font-semibold">
          {TAB_LABELS[activeTab] ?? activeTab}
        </p>
        <button
          type="button"
          onClick={() => onTabChange(null)}
          className="text-[#ffb700]/40 hover:text-[#ffb700]/80 text-xs px-1 transition-colors"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="jarvis-panel-content">
        {activeTab === 'leads'    && <LeadsPanel />}
        {activeTab === 'clients'  && <ClientsPanel />}
        {activeTab === 'empire'   && <EmpirePanel />}
        {activeTab === 'activity' && <ActivityPanel />}
      </div>
    </div>
  );
}
