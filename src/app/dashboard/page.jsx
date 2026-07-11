'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Admin landing: open JARVIS immediately. */
export default function DashboardHome() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include', cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          router.replace('/login?callbackUrl=/dashboard');
          return;
        }
        const data = await res.json();
        if (!data.loggedIn) {
          router.replace('/login?callbackUrl=/dashboard');
          return;
        }
        if (data.role === 'admin') {
          router.replace('/dashboard/jarvis');
          return;
        }
        setStatus('denied');
      })
      .catch(() => router.replace('/login?callbackUrl=/dashboard'));
  }, [router]);

  if (status === 'denied') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#ADB7BE]">
        Admin access required.
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712]">
      <p className="text-sky-300/80 text-sm tracking-widest uppercase animate-pulse">Starting JARVIS…</p>
    </main>
  );
}
