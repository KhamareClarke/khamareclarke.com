'use client';

/**
 * Empire OS Dashboard — Assign tasks to any project + any of 29 autonomous agents; view status and activity.
 * Reads: empire_leads, empire_reports, empire_agent_activity, empire_tasks, empire_supervisor_log.
 * Writes: empire_tasks (assign task), supervisor run-team creates tasks + log.
 * Agents: full 29-skill set (Khamare–Corey install pack) for acquisition, conversion, lifecycle, retention, measurement.
 */
import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Section } from '../../components/ui/Section';
import { Container } from '../../components/ui/Container';
import { ALL_EMPIRE_PROJECT_IDS, getProjectLabel, getProjectRootUrl } from '@/lib/empire-projects';
import { EMPIRE_SKILL_IDS, getSkillLabel } from '@/lib/empire-skills';

const supabase = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null;

const projectLabel = getProjectLabel;
const agentLabel = getSkillLabel;

/** Dashboard shows only the 11 real domains (no Empire / Empire verification test projects). */
const DASHBOARD_PROJECT_IDS = ALL_EMPIRE_PROJECT_IDS.filter(
  (id) => id !== 'empire' && id !== 'empire-phase11-test'
);

/** Predefined worker tasks — pick one and run; result shows on dashboard. */
const WORKER_QUICK_TASKS = [
  { id: 'hide-buttons', label: 'Hide homepage buttons', task: 'make homepage buttons disappeared' },
  { id: 'header-navy', label: 'Header to navy', task: 'Change header to navy' },
  { id: 'login-blue', label: 'Login button blue', task: 'Make the login button blue' },
  { id: 'footer-dark', label: 'Footer dark', task: 'Change footer background to dark' },
  { id: 'cta-yellow', label: 'CTAs yellow', task: 'Make main call-to-action buttons yellow' },
  { id: 'seo-meta', label: 'SEO meta tags', task: 'Fix or improve homepage meta title and description for SEO' },
];

function stripMarkdown(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .trim();
}

function summaryToPoints(summary) {
  const clean = stripMarkdown(summary);
  const byNumber = clean.split(/\s*\d+\.\s+/).map((s) => s.trim()).filter(Boolean);
  const byNewline = clean.split(/\n+/).map((s) => s.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()).filter((s) => s.length > 0);
  const lines = byNewline.length > 1 ? byNewline : byNumber.length > 1 ? byNumber : [clean];
  return lines.length ? lines : [clean];
}

export default function EmpireDashboardPage() {
  const [leads, setLeads] = useState([]);
  const [myapprovedLeads, setMyapprovedLeads] = useState([]);
  const [myapprovedLeads24h, setMyapprovedLeads24h] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [health, setHealth] = useState({ leads24h: 0, leads48h: 0, errorCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [assignProject, setAssignProject] = useState('myapproved');
  const [assignAgent, setAssignAgent] = useState(EMPIRE_SKILL_IDS[0]);
  const [assignDescription, setAssignDescription] = useState('');
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [supervisorLogs, setSupervisorLogs] = useState([]);
  const [backgroundLogs, setBackgroundLogs] = useState([]);
  const [seoLogs, setSeoLogs] = useState([]);
  const [seoLogsError, setSeoLogsError] = useState(null);
  const [opsLogs, setOpsLogs] = useState([]);
  const [opsLogsError, setOpsLogsError] = useState(null);
  const [teamProject, setTeamProject] = useState('myapproved');
  const [runTeamSubmitting, setRunTeamSubmitting] = useState(false);
  const [runPendingSubmitting, setRunPendingSubmitting] = useState(false);
  const [rotateSubmitting, setRotateSubmitting] = useState(false);
  const [fleetAnalysis, setFleetAnalysis] = useState([]);
  const [lastFleetUpdate, setLastFleetUpdate] = useState(null);
  const [workerProject, setWorkerProject] = useState('myapproved');
  const [workerTaskIndex, setWorkerTaskIndex] = useState(0);
  const [workerCustomTask, setWorkerCustomTask] = useState('');
  const [workerRunning, setWorkerRunning] = useState(false);
  const [workerLog, setWorkerLog] = useState('');
  const [workerResult, setWorkerResult] = useState('');
  const [pushRunning, setPushRunning] = useState(false);
  const [pushMessage, setPushMessage] = useState('Empire worker: edit code, fix bugs');
  const [showKeepChangesPrompt, setShowKeepChangesPrompt] = useState(false);
  const [showCommitThenPush, setShowCommitThenPush] = useState(false);
  const [buildErrorPaste, setBuildErrorPaste] = useState('');
  const [workerActivityLog, setWorkerActivityLog] = useState([]);
  const [autoFixLoading, setAutoFixLoading] = useState(false);
  const [autoFixOnBuildFail, setAutoFixOnBuildFail] = useState(false);
  const [autoRunNowLoading, setAutoRunNowLoading] = useState(false);
  const [opsRunNowLoading, setOpsRunNowLoading] = useState(false);
  const [opsRunNowError, setOpsRunNowError] = useState(null);
  const deployPollRef = useRef(null);

  const appendActivity = (msg, type = 'info') => {
    setWorkerActivityLog((prev) => [...prev.slice(-49), { ts: Date.now(), msg, type }]);
  };

  const EMPIRE_TEAM_IDS = ['SALES_TEAM', 'GROWTH_TEAM', 'OPS_TEAM', 'INTEL_TEAM'];
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;

  const fetchFleetStatus = React.useCallback(async () => {
    try {
      const res = await fetch('/api/empire/fleet-status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setFleetAnalysis(data.projects || []);
        setLastFleetUpdate(Date.now());
      }
    } catch (_) {
      setFleetAnalysis([]);
    }
  }, []);

  const triggerAnalyzeAll = React.useCallback(() => {
    fetch('/api/empire/analyze-all', { method: 'POST', cache: 'no-store' }).catch(() => {});
  }, []);

  const fetchData = React.useCallback(async () => {
    if (!supabase) return;
      try {
        const now = new Date();
        const ts24 = new Date(now - 24 * 60 * 60 * 1000).toISOString();
        const ts48 = new Date(now - 48 * 60 * 60 * 1000).toISOString();

      const [leadsRes, errRes, leads24Res, leads48Res, tasksRes, myapprovedApiRes, logsApiRes, seoLogsRes, opsLogsRes] = await Promise.all([
          supabase.from('empire_leads').select('*').order('created_at', { ascending: false }).limit(100),
          supabase.from('empire_reports').select('id').eq('severity', 'error'),
          supabase.from('empire_leads').select('id', { count: 'exact', head: true }).gte('created_at', ts24),
          supabase.from('empire_leads').select('id', { count: 'exact', head: true }).gte('created_at', ts48),
        supabase.from('empire_tasks').select('*').order('assigned_at', { ascending: false }).limit(100),
          fetch('/api/empire/leads/list?projectId=myapproved', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ ok: false, error: 'Network error' })),
          fetch('/api/empire/leads/logs', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ ok: false, logs: [] })),
          fetch('/api/empire/seo-runs/list?projectId=myapproved', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ ok: false, runs: [] })),
          fetch('/api/empire/ops-runs/list?projectId=myapproved', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ ok: false, runs: [] })),
        ]);

        if (leadsRes.data) setLeads(leadsRes.data);
        if (myapprovedApiRes?.ok) {
          setMyapprovedLeads(myapprovedApiRes.leads || []);
          if (myapprovedApiRes.count24h != null) setMyapprovedLeads24h(myapprovedApiRes.count24h);
        } else {
          const fallback = await supabase.from('empire_leads').select('*').eq('project_id', 'myapproved').order('created_at', { ascending: false }).limit(500);
          const fallback24 = await supabase.from('empire_leads').select('id', { count: 'exact', head: true }).eq('project_id', 'myapproved').gte('created_at', ts24);
          if (fallback?.data?.length) {
            setMyapprovedLeads(fallback.data);
            if (fallback24?.count != null) setMyapprovedLeads24h(fallback24.count);
          }
        }
      if (tasksRes.data) setTasks(tasksRes.data);

      try {
        const supervisorLogsRes = await supabase.from('empire_supervisor_log').select('*').order('created_at', { ascending: false }).limit(50);
        if (supervisorLogsRes.data) setSupervisorLogs(supervisorLogsRes.data);
      } catch (_) {
        setSupervisorLogs([]);
      }
        if (logsApiRes?.ok && Array.isArray(logsApiRes.logs)) setBackgroundLogs(logsApiRes.logs);
        if (seoLogsRes?.ok) {
          setSeoLogs(Array.isArray(seoLogsRes.runs) ? seoLogsRes.runs : []);
          setSeoLogsError(null);
        } else {
          setSeoLogsError(seoLogsRes?.error || 'Could not load SEO runs');
        }
        if (opsLogsRes?.ok) {
          setOpsLogs(Array.isArray(opsLogsRes.runs) ? opsLogsRes.runs : []);
          setOpsLogsError(null);
        } else {
          setOpsLogsError(opsLogsRes?.error || 'Could not load Ops runs');
        }
        setHealth({
          leads24h: leads24Res.count ?? 0,
          leads48h: leads48Res.count ?? 0,
          errorCount: errRes.data?.length ?? 0,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not configured (NEXT_PUBLIC_SUPABASE_*).');
      setLoading(false);
      return;
    }
    fetchData();
    fetchFleetStatus();
  }, [fetchData, fetchFleetStatus]);

  useEffect(() => {
    const t = setTimeout(triggerAnalyzeAll, 3000);
    return () => clearTimeout(t);
  }, [triggerAnalyzeAll]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFleetStatus();
      fetchData();
    }, 12000);
    return () => clearInterval(interval);
  }, [fetchFleetStatus, fetchData]);

  useEffect(() => {
    const runLeadsCron = () => fetch('/api/empire/leads/cron', { method: 'POST', cache: 'no-store' }).catch(() => {});
    runLeadsCron();
    const interval = setInterval(runLeadsCron, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const runSeoCron = () => fetch('/api/empire/cron/seo-myapproved', { method: 'POST', cache: 'no-store' }).catch(() => {});
    runSeoCron();
    const interval = setInterval(runSeoCron, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => {
    if (deployPollRef.current) clearInterval(deployPollRef.current);
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!supabase || !assignDescription.trim()) return;
    setAssignSubmitting(true);
    setAssignError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('empire_tasks')
        .insert({
          project_id: assignProject,
          agent_id: assignAgent,
          task_description: assignDescription.trim(),
          status: 'pending',
        })
        .select('id')
        .single();
      if (insertError) throw insertError;
      setAssignDescription('');
      await fetchData();
    } catch (err) {
      setAssignError(err.message || 'Failed to assign task. Ensure empire_tasks table exists (run supabase/migrations/empire_tasks.sql in Supabase).');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleRunTask = async (taskId) => {
    setRunningTaskId(taskId);
    try {
      const res = await fetch('/api/empire/run-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Run failed');
      await fetchData();
    } catch (err) {
      setAssignError(err.message || 'Failed to run task');
      await fetchData();
    } finally {
      setRunningTaskId(null);
    }
  };

  const handleRunTeam = async (teamId) => {
    setRunTeamSubmitting(true);
    setAssignError(null);
    try {
      const res = await fetch('/api/empire/supervisor/run-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: teamProject,
          teamId,
          taskDescription: `Priority: ${teamId} for ${projectLabel(teamProject)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Run team failed');
      await fetchData();
    } catch (err) {
      setAssignError(err.message || 'Failed to run team');
      await fetchData();
    } finally {
      setRunTeamSubmitting(false);
    }
  };

  const handleRunPending = async (withHandoff = false) => {
    setRunPendingSubmitting(true);
    setAssignError(null);
    try {
      const res = await fetch('/api/empire/run-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: teamProject || undefined, handoff: withHandoff }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Run pending failed');
      await fetchData();
    } catch (err) {
      setAssignError(err.message || 'Run pending failed');
      await fetchData();
    } finally {
      setRunPendingSubmitting(false);
    }
  };

  const handleRotate = async () => {
    setRotateSubmitting(true);
    setAssignError(null);
    try {
      const res = await fetch('/api/empire/supervisor/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: 'SALES_TEAM' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rotate failed');
      await fetchData();
    } catch (err) {
      setAssignError(err.message || 'Rotate failed');
      await fetchData();
    } finally {
      setRotateSubmitting(false);
    }
  };

  const handleRunWorker = async (customTaskOverride, options = {}) => {
    const taskToUse = customTaskOverride !== undefined ? customTaskOverride : workerCustomTask.trim();
    const autoPushWhenDone = options.autoPushWhenDone === true;
    setWorkerRunning(true);
    setWorkerLog('');
    setWorkerResult('');
    setAssignError(null);
    setShowKeepChangesPrompt(false);
    setShowCommitThenPush(false);
    appendActivity(`Agent: Running task for ${projectLabel(workerProject)}…`, 'info');
    const pollInterval = setInterval(async () => {
      try {
        const r = await fetch('/api/empire/worker/live-log', { cache: 'no-store' });
        const d = await r.json();
        if (d.log) setWorkerLog((prev) => (d.log.length > prev.length ? d.log : prev));
      } catch (_) {}
    }, 1500);
    try {
      const res = await fetch('/api/empire/worker/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskIndex: workerTaskIndex,
          projectId: workerProject,
          customTask: taskToUse || undefined,
        }),
      });
      clearInterval(pollInterval);
      const data = await res.json();
      setWorkerLog(data.log || '');
      setWorkerResult(data.result || (data.ok ? 'Done' : data.error || ''));
      if (!res.ok) setAssignError(data.error || 'Worker run failed');
      else if (autoPushWhenDone) {
        setPushMessage('fix: resolve Vercel build error');
        appendActivity(`Agent: Fix applied. Pushing to repo…`, 'info');
        await handlePush();
      } else setShowKeepChangesPrompt(true);
    } catch (err) {
      clearInterval(pollInterval);
      setAssignError(err.message || 'Worker run failed');
      setWorkerResult(err.message || '');
    } finally {
      setWorkerRunning(false);
    }
  };

  const handleAutoFixBuild = async () => {
    setAutoFixLoading(true);
    appendActivity(`Empire: Reading deploy status from Vercel…`, 'info');
    try {
      const res = await fetch(`/api/empire/deploy-status?projectId=${encodeURIComponent(workerProject)}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.needPaste || !data.buildError) {
        appendActivity(data.error || 'No build error found. Paste the error above or add VERCEL_TOKEN and VERCEL_PROJECT_ID_<project> in .env.local.', 'error');
        if (data.buildError) setBuildErrorPaste(data.buildError);
        setAutoFixLoading(false);
        return;
      }
      appendActivity(`Empire: Build failed. Agent fixing code…`, 'info');
      setBuildErrorPaste(data.buildError.slice(0, 5000));
      const task = `The build/deploy failed with this error. Fix the code in the repo so the build passes. Do not explain—apply the fix.\n\nError:\n${data.buildError}`;
      await handleRunWorker(task, { autoPushWhenDone: true });
    } catch (err) {
      appendActivity(`Empire: Failed to read deploy status — ${err.message}`, 'error');
    } finally {
      setAutoFixLoading(false);
    }
  };

  const handleRunAutoNow = async () => {
    setAutoRunNowLoading(true);
    setAssignError(null);
    try {
      const res = await fetch('/api/empire/cron/run-auto-24h', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'myapproved' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Run failed');
      await fetchData();
    } catch (err) {
      setAssignError(err.message || 'Auto run failed');
    } finally {
      setAutoRunNowLoading(false);
    }
  };

  const handleRunOpsNow = async () => {
    setOpsRunNowLoading(true);
    setOpsRunNowError(null);
    try {
      const res = await fetch('/api/empire/cron/ops-myapproved', { method: 'POST', cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      await fetchData();
      if (data.insertStartError) setOpsRunNowError(`DB insert failed: ${data.insertStartError}`);
      else if (data.supabase === 'no_client') setOpsRunNowError('Supabase not configured on this deployment.');
      else if (!res.ok) setOpsRunNowError(data.error || 'Ops run failed');
    } catch (err) {
      setOpsRunNowError(err.message || 'Request failed');
    } finally {
      setOpsRunNowLoading(false);
    }
  };

  const handlePush = async () => {
    setPushRunning(true);
    setAssignError(null);
    appendActivity(`Agent: Pushing to repo (${projectLabel(workerProject)})…`, 'info');
    try {
      const res = await fetch('/api/empire/worker/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: pushMessage, projectId: workerProject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Push failed');
      setWorkerLog((l) => (data.log ? l + '\n--- Push ---\n' + data.log : l));
      setShowCommitThenPush(false);
      appendActivity(`Agent: Push succeeded.`, 'success');
      appendActivity(`Empire: Deploying app. Vercel (or your host) is building. If the build fails, use "Auto-fix build" or paste the error below.`, 'info');
      const projectId = workerProject;
      const doAutoFix = autoFixOnBuildFail;
      if (deployPollRef.current) clearInterval(deployPollRef.current);
      let pollCount = 0;
      const maxPolls = 15;
      deployPollRef.current = setInterval(async () => {
        pollCount += 1;
        try {
          const r = await fetch(`/api/empire/deploy-status?projectId=${encodeURIComponent(projectId)}`, { cache: 'no-store' });
          const deployData = await r.json();
          if (!deployData.ok) return;
          const state = deployData.state;
          if (state === 'READY') {
            if (deployPollRef.current) clearInterval(deployPollRef.current);
            deployPollRef.current = null;
            appendActivity(`Empire: Deploy succeeded.`, 'success');
            return;
          }
          if (state === 'ERROR' && deployData.buildError) {
            if (deployPollRef.current) clearInterval(deployPollRef.current);
            deployPollRef.current = null;
            setBuildErrorPaste(deployData.buildError.slice(0, 5000));
            appendActivity(`Empire: Build failed. Error shown below.`, 'error');
            if (doAutoFix) {
              appendActivity(`Empire: Auto-fixing and re-pushing…`, 'info');
              const task = `The build/deploy failed with this error. Fix the code in the repo so the build passes. Do not explain—apply the fix.\n\nError:\n${deployData.buildError}`;
              handleRunWorker(task, { autoPushWhenDone: true });
            }
            return;
          }
        } catch (_) {}
        if (pollCount >= maxPolls) {
          if (deployPollRef.current) clearInterval(deployPollRef.current);
          deployPollRef.current = null;
          appendActivity(`Empire: Deploy status: still building or unknown after ${maxPolls} checks.`, 'info');
        }
      }, 20000);
    } catch (err) {
      setAssignError(err.message || 'Push failed');
      appendActivity(`Agent: Push failed — ${err.message}`, 'error');
    } finally {
      setPushRunning(false);
    }
  };


  if (loading) return <main className="min-h-screen p-6 bg-[#0a0a0a] text-white"><Section><Container><p>Loading Empire...</p></Container></Section></main>;
  if (error) return <main className="min-h-screen p-6 bg-[#0a0a0a] text-red-400"><Section><Container><p>Error: {error}</p></Container></Section></main>;

  const fleetList = fleetAnalysis.length ? fleetAnalysis : DASHBOARD_PROJECT_IDS.map((id) => ({ project_id: id, status: 'pending', summary: null, error_message: null, updated_at: null }));
  const doneCount = fleetList.filter((p) => p.status === 'done').length;
  const failedCount = fleetList.filter((p) => p.status === 'failed').length;
  const runningCount = fleetList.filter((p) => p.status === 'running').length;
  const lastScanMs = fleetList.reduce((acc, p) => {
    const ts = p.updated_at ? new Date(p.updated_at).getTime() : 0;
    return ts > acc ? ts : acc;
  }, 0);
  const lastScanAgo = lastScanMs ? (Date.now() - lastScanMs < 60000 ? 'Just now' : `${Math.round((Date.now() - lastScanMs) / 60000)} min ago`) : '—';
  const warnings = fleetList.filter((p) => p.status === 'failed');
  const successList = fleetList.filter((p) => p.status === 'done');

  return (
    <main className="min-h-screen p-6 bg-[#0a0a0a] text-white">
      <Section>
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <h1 className="text-3xl font-bold text-[#ffb700] tracking-tight">Empire OS</h1>
            <a
              href="/dashboard/empire/activity"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-300"
              title="Live sign-ins, sign-ups, audits and payments across every project"
            >
              <span aria-hidden>📡</span>
              <span>User activity (all projects) →</span>
            </a>
          </div>

          {/* Leads (MyApproved) — tradespersons & businesses UK, US, Canada */}
          <section className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h2 className="text-lg font-semibold mb-2 text-[#ffb700]">Leads (MyApproved)</h2>
            <p className="text-sm text-gray-400 mb-4">Business leads for MyApproved: <strong>tradespeople and businesses in UK and Canada only</strong>. <strong>Runs in the background every minute</strong> (no button needed): fetches new leads and sends MyApproved outreach to leads with email. Admin gets notified per email. Logs (findings, emails sent) appear below. Built-in search from all sources (DuckDuckGo, Bing, Google).</p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="px-4 py-2 rounded-lg bg-[#222] border border-[#444]">
                <span className="text-2xl font-bold text-white tabular-nums">{myapprovedLeads.length}</span>
                <span className="text-xs text-gray-400 block uppercase tracking-wider">Total leads</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">{myapprovedLeads24h}</span>
                <span className="text-xs text-gray-400 block uppercase tracking-wider">New (24h)</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#222] border border-[#444]">
                <span className="text-2xl font-bold text-amber-400 tabular-nums">{(myapprovedLeads || []).filter((l) => l.payload?.contacted || l.contacted).length}</span>
                <span className="text-xs text-gray-400 block uppercase tracking-wider">Contacted</span>
              </div>
            </div>
            <div className="bg-black/40 rounded border border-[#333] overflow-hidden max-h-[32rem] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-[#333] bg-[#222] sticky top-0"><th className="p-2 whitespace-nowrap">Name</th><th className="p-2 whitespace-nowrap">Email</th><th className="p-2 whitespace-nowrap">Phone</th><th className="p-2 whitespace-nowrap">Website</th><th className="p-2 whitespace-nowrap">Source</th><th className="p-2 whitespace-nowrap">Contacted</th><th className="p-2 whitespace-nowrap">Date</th></tr></thead>
                <tbody>
                  {(myapprovedLeads || []).length === 0 && (
                    <tr><td colSpan={7} className="p-4 text-gray-500">No leads yet. Background runs every minute; results appear here automatically.</td></tr>
                  )}
                  {(myapprovedLeads || []).map((lead) => (
                    <tr key={lead.id} className="border-b border-[#333] hover:bg-[#222]/50">
                      <td className="p-2 text-gray-300">{lead.name || '—'}</td>
                      <td className="p-2 text-amber-200/90 font-mono text-xs">{lead.email || '—'}</td>
                      <td className="p-2 text-gray-400 font-mono text-xs">{lead.payload?.phone || '—'}</td>
                      <td className="p-2 text-gray-400 text-xs max-w-[12rem] truncate" title={lead.payload?.website || ''}>{lead.payload?.website ? <a href={lead.payload.website} target="_blank" rel="noopener noreferrer" className="text-amber-200/90 hover:underline">{lead.payload.website}</a> : '—'}</td>
                      <td className="p-2 text-gray-400">{lead.source || '—'}</td>
                      <td className="p-2">{(lead.payload?.contacted || lead.contacted) ? <span className="text-emerald-400">Yes</span> : <span className="text-gray-500">No</span>}</td>
                      <td className="p-2 whitespace-nowrap text-gray-500">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SEO (MyApproved) — runs automatically every 6h, improves meta/titles and pushes code */}
          <section className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h2 className="text-lg font-semibold mb-2 text-[#ffb700]">SEO (MyApproved)</h2>
            <p className="text-sm text-gray-400 mb-2">MyApproved SEO is improved automatically 24/7 in the background. Growth (SEO) runs every 30 minutes (cron) or every 6 hours (Auto 24h): audits layout and meta tags, applies fixes, runs <code className="bg-black/50 px-1 rounded">npm run build</code> in the <strong>MyApproved folder</strong>, then commits and pushes code. On success, an email is sent to Khamareclarke. <strong>Push</strong> = Yes only when <code className="bg-black/50 px-1 rounded text-amber-200/90">EMPIRE_WORKER_PUSH_ENABLED=true</code> and the cron successfully pushed to git. No buttons — all automatic.</p>
            <p className="text-sm text-amber-200/90 mb-4"><strong>If your local <code className="bg-black/50 px-1 rounded">npm run build</code> works but the cron shows &quot;generate is not a function&quot; or &quot;next package&quot; errors:</strong> the cron runs <em>where the Empire app runs</em>. On Vercel that is only the Empire repo (no MyApproved folder), so the worker cannot build MyApproved there. Run the SEO cron from a machine that has <strong>both</strong> repos (e.g. your PC): set <code className="bg-black/50 px-1 rounded">EMPIRE_REPO_MYAPPROVED</code>=<code className="bg-black/50 px-1 rounded">C:\Users\FC\Desktop\projectredesigns\myapproved.com</code> in Empire&apos;s <code className="bg-black/50 px-1 rounded">.env.local</code>, then trigger the cron from that machine so the build runs in your real MyApproved folder.</p>
            <div className="bg-black/40 rounded border border-[#333] overflow-hidden max-h-[20rem] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-[#333] bg-[#222] sticky top-0"><th className="p-2 whitespace-nowrap">Date</th><th className="p-2 whitespace-nowrap">Type</th><th className="p-2 whitespace-nowrap">Success</th><th className="p-2 whitespace-nowrap">Push</th><th className="p-2">Result</th></tr></thead>
                <tbody>
                  {(seoLogs || []).length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-gray-500">
                      {seoLogsError ? (
                        <>Could not load: {seoLogsError}</>
                      ) : (
                        <>No SEO runs yet. Run the migration <code className="bg-black/50 px-1 rounded">empire_seo_ops_runs.sql</code> in Supabase, then cron runs will appear here.</>
                      )}
                    </td></tr>
                  )}
                  {(seoLogs || []).map((run) => (
                    <tr key={run.id} className="border-b border-[#333] hover:bg-[#222]/50">
                      <td className="p-2 whitespace-nowrap text-gray-400">{run.created_at ? new Date(run.created_at).toLocaleString() : '—'}</td>
                      <td className="p-2 whitespace-nowrap text-amber-200/90">{run.run_type || 'cron'}</td>
                      <td className="p-2 whitespace-nowrap">{run.success ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400">No</span>}</td>
                      <td className="p-2 whitespace-nowrap">{run.push_ok ? <span className="text-emerald-400">Yes</span> : <span className="text-amber-200/80">No</span>}</td>
                      <td className="p-2 text-gray-300 align-top">
                        <div className="max-w-xl max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-xs bg-black/30 rounded p-2">
                          {run.result_summary || '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Fixes bugs and broken links (MyApproved) — runs every 30 min (like SEO), push + email on success */}
          <section className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h2 className="text-lg font-semibold mb-2 text-[#ffb700]">Fixes bugs and broken links (MyApproved)</h2>
            <p className="text-sm text-gray-400 mb-4">Runs in the background every 30 minutes. Fixes broken links (no local build—Vercel builds after push). Email to Khamareclarke on success. Push = Yes when <code className="bg-black/50 px-1 rounded text-amber-200/90">EMPIRE_WORKER_PUSH_ENABLED=true</code> and git push is available.</p>
            <p className="text-xs text-gray-500 mb-2">Runs every 30 min on the half-hour. To run once now:</p>
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={handleRunOpsNow}
                disabled={opsRunNowLoading}
                className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {opsRunNowLoading ? 'Running Ops…' : 'Run Ops now'}
              </button>
            </div>
            {opsRunNowError && <p className="text-sm text-amber-200/90 mb-2">{opsRunNowError}</p>}
            <div className="bg-black/40 rounded border border-[#333] overflow-hidden max-h-[20rem] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-[#333] bg-[#222] sticky top-0"><th className="p-2 whitespace-nowrap">Date</th><th className="p-2 whitespace-nowrap">Type</th><th className="p-2 whitespace-nowrap">Success</th><th className="p-2 whitespace-nowrap">Push</th><th className="p-2">Result</th></tr></thead>
                <tbody>
                  {(opsLogs || []).length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-gray-500">
                      {opsLogsError ? (
                        <>Could not load: {opsLogsError}</>
                      ) : (
                        <>No Ops runs yet.</>
                      )}
                    </td></tr>
                  )}
                  {(opsLogs || []).map((run) => (
                    <tr key={run.id} className="border-b border-[#333] hover:bg-[#222]/50">
                      <td className="p-2 whitespace-nowrap text-gray-400">{run.created_at ? new Date(run.created_at).toLocaleString() : '—'}</td>
                      <td className="p-2 whitespace-nowrap text-amber-200/90">{run.run_type || 'cron'}</td>
                      <td className="p-2 whitespace-nowrap">{run.success ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400">No</span>}</td>
                      <td className="p-2 whitespace-nowrap">{run.push_ok ? <span className="text-emerald-400">Yes</span> : <span className="text-amber-200/80">No</span>}</td>
                      <td className="p-2 text-gray-300 align-top">
                        <div className="max-w-xl max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-xs bg-black/30 rounded p-2">
                          {run.result_summary || '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Background logs — leads cron + emails sent; runs every minute, no button */}
          <section className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h2 className="text-lg font-semibold mb-2 text-[#ffb700]">Background logs (leads &amp; emails)</h2>
            <p className="text-sm text-gray-400 mb-2">Runs every minute in the background. Findings (leads fetched, emails sent) appear here. No need to click any button.</p>
            <p className="text-sm text-amber-200/80 mb-4">If you always see <strong>0 leads</strong>: set <code className="bg-black/50 px-1 rounded">EMPIRE_LEAD_SOURCE_URL</code> (JSON API of businesses) or <code className="bg-black/50 px-1 rounded">EMPIRE_LEAD_SCRAPE_URL</code> (external directory URLs) in Vercel/env — built-in search often returns 0 from the server. See <code className="bg-black/50 px-1 rounded">docs/EMPIRE_LEAD_SOURCE_SETUP.md</code>.</p>
            <div className="bg-black/40 rounded border border-[#333] overflow-hidden max-h-[24rem] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-[#333] bg-[#222] sticky top-0"><th className="p-2 whitespace-nowrap">Time</th><th className="p-2">Type</th><th className="p-2">Findings</th></tr></thead>
                <tbody>
                  {(backgroundLogs || []).length === 0 && (
                    <tr><td colSpan={3} className="p-4 text-gray-500">No logs yet. Background job runs every minute; entries will appear here.</td></tr>
                  )}
                  {(backgroundLogs || []).map((log) => (
                    <tr key={log.id} className="border-b border-[#333] hover:bg-[#222]/50">
                      <td className="p-2 whitespace-nowrap text-gray-400">{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</td>
                      <td className="p-2 whitespace-nowrap">{log.task_type === 'outreach_sent' ? <span className="text-emerald-400">Email sent</span> : <span className="text-amber-200/90">Leads run</span>}</td>
                      <td className="p-2 text-gray-300">
                        {log.task_type === 'outreach_sent' ? (
                          <span>{log.message || '—'}{log.findings ? <> · <a href={log.findings} target="_blank" rel="noopener noreferrer" className="text-amber-200/90 hover:underline">{log.findings}</a></> : null}</span>
                        ) : (
                          <span>{log.message || '—'}{log.findings ? ` — ${log.findings}` : ''}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Auto runs (24h) — Growth, Sales, Ops run every 6h; Run now to trigger immediately */}
          <section className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
            <h2 className="text-lg font-semibold mb-2 text-[#ffb700]">Auto runs (24h)</h2>
            <p className="text-sm text-gray-400 mb-3">Growth (SEO), Sales (Leads), and Ops (Maintenance) run automatically every 6 hours for <strong>MyApproved only</strong>. Each task has a timeout so it never gets stuck. Findings—lead emails, bugs, SEO updates—are listed below. For <strong>real business leads</strong> (not your own site) set <code className="bg-black/50 px-1 rounded text-amber-200/90">EMPIRE_LEAD_SOURCE_URL</code> to a JSON API, or <code className="bg-black/50 px-1 rounded text-amber-200/90">EMPIRE_LEAD_SCRAPE_URL</code> to directory/listing pages; see <code className="bg-black/50 px-1 rounded text-gray-400">docs/EMPIRE_LEAD_SOURCE_SETUP.md</code>.</p>
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={handleRunAutoNow}
                disabled={autoRunNowLoading}
                className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {autoRunNowLoading ? 'Running…' : 'Run now'}
              </button>
              <span className="text-xs text-gray-500">Runs Growth → Sales → Ops for MyApproved only. Refreshes table.</span>
            </div>
            <div className="bg-black/40 rounded border border-[#333] overflow-hidden max-h-[28rem] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-[#333] bg-[#222] sticky top-0"><th className="p-2 whitespace-nowrap">Time</th><th className="p-2 whitespace-nowrap">Project</th><th className="p-2 whitespace-nowrap">Task</th><th className="p-2">Findings (leads, bugs, SEO)</th></tr></thead>
                <tbody>
                  {(supervisorLogs || []).filter((l) => l.task_type === 'auto_24h').length === 0 && (
                    <tr><td colSpan={4} className="p-2 text-gray-500">No auto runs yet. Cron runs every 6 hours (00:00, 06:00, 12:00, 18:00 UTC).</td></tr>
                  )}
                  {(supervisorLogs || []).filter((l) => l.task_type === 'auto_24h').map((log) => {
                    const taskFromMessage = (log.message || '').match(/Auto 24h \[.*?\]: (Growth \(SEO\)|Sales \(Leads\)|Ops \(Maintenance\))/);
                    const projectName = log.project_id ? projectLabel(log.project_id) : (log.message || '').match(/Auto 24h \[(.*?)\]/)?.[1] || log.project_id || '—';
                    const findings = log.findings || log.message || '—';
                    return (
                      <tr key={log.id} className="border-b border-[#333] align-top">
                        <td className="p-2 whitespace-nowrap text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-2 whitespace-nowrap text-gray-300">{projectName}</td>
                        <td className="p-2 whitespace-nowrap text-amber-200/90">{taskFromMessage ? taskFromMessage[1] : '—'}</td>
                        <td className="p-2 text-gray-300 whitespace-pre-wrap break-words max-w-xl">{findings}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

        </Container>
      </Section>
    </main>
  );
}
