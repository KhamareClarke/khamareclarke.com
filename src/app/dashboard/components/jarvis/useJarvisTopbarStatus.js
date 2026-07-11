'use client';

import { useCallback, useEffect, useState } from 'react';

/** @typedef {'online' | 'degraded' | 'offline' | 'unknown'} ServiceStatus */

const POLL_MS = 45_000;

function getDevSimulate() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return null;
  return new URLSearchParams(window.location.search).get('simulateStatus');
}

async function checkEmpireOs() {
  const res = await fetch('/api/empire/activity/list?limit=1', {
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) return 'offline';
  if ((data.summary?.failed24h || 0) > 0) return 'degraded';
  return 'online';
}

async function checkFleet() {
  const res = await fetch('/api/empire/fleet-status', {
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) return 'offline';
  const projects = data.projects || [];
  if (!projects.length) return 'degraded';
  const errored = projects.filter((p) => p.status === 'error' || p.error_message);
  if (errored.length === projects.length) return 'offline';
  if (errored.length > 0) return 'degraded';
  return 'online';
}

async function checkSupabase() {
  const res = await fetch('/api/auth/check', {
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.loggedIn) return 'offline';
  return 'online';
}

export default function useJarvisTopbarStatus() {
  const [status, setStatus] = useState({
    empireOs: 'unknown',
    fleet: 'unknown',
    supabase: 'unknown',
  });

  const refresh = useCallback(async () => {
    const simulate = getDevSimulate();
    const [empireOs, fleet, supabase] = await Promise.all([
      checkEmpireOs(),
      checkFleet(),
      checkSupabase(),
    ]);

    setStatus({
      empireOs: simulate === 'empire' ? 'offline' : empireOs,
      fleet: simulate === 'fleet' ? 'offline' : fleet,
      supabase: simulate === 'supabase' ? 'offline' : supabase,
    });
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return status;
}
