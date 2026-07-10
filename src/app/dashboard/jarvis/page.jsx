'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const OPENJARVIS_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_OPENJARVIS_URL) ||
  'http://127.0.0.1:8000';

export default function JarvisFullPage() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(null);
  const [backendOk, setBackendOk] = useState(null);
  const jarvisSrc = OPENJARVIS_URL.replace(/\/$/, '');

  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch('/api/jarvis/openjarvis/health', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      setBackendOk(res.ok && data?.ok);
    } catch {
      setBackendOk(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include', cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          router.replace('/login?callbackUrl=/dashboard/jarvis');
          return;
        }
        const data = await res.json();
        if (data?.role !== 'admin') {
          router.replace('/dashboard');
          return;
        }
        setAuthOk(true);
        checkBackend();
      })
      .catch(() => router.replace('/login?callbackUrl=/dashboard/jarvis'));
  }, [router, checkBackend]);

  useEffect(() => {
    if (!authOk) return undefined;
    const t = setInterval(checkBackend, 15000);
    return () => clearInterval(t);
  }, [authOk, checkBackend]);

  if (authOk === null) {
    return (
      <div className="flex h-full items-center justify-center text-sky-300/80 text-sm tracking-widest uppercase">
        Initialising JARVIS…
      </div>
    );
  }

  if (backendOk === false) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2">OpenJarvis</p>
        <h1 className="text-2xl font-light text-sky-100 mb-4">Backend not running</h1>
        <p className="text-sky-400/70 text-sm max-w-lg mb-8">
          OpenJarvis runs as a separate service (Python + Ollama). Start it locally or on your VPS,
          then set <code className="text-cyan-300">NEXT_PUBLIC_OPENJARVIS_URL</code> in Vercel.
        </p>
        <div className="rounded-xl border border-sky-500/25 bg-sky-950/40 p-4 text-left text-xs text-sky-200/80 font-mono max-w-xl w-full mb-6">
          <p className="text-sky-500 mb-2"># One-time setup</p>
          <p>npm run openjarvis:setup</p>
          <p className="mt-3 text-sky-500"># Start (Docker + Ollama)</p>
          <p>npm run openjarvis:start</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={checkBackend}
            className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-sm hover:bg-cyan-500/30"
          >
            Retry connection
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full border border-sky-500/30 text-sky-300/80 text-sm hover:text-sky-100"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (backendOk === null) {
    return (
      <div className="flex h-full items-center justify-center text-sky-300/80 text-sm">
        Connecting to OpenJarvis…
      </div>
    );
  }

  return (
    <>
      <iframe
        title="OpenJarvis"
        src={jarvisSrc}
        className="w-full h-full border-0 bg-[#161618]"
        allow="microphone; clipboard-write"
      />
      <Link
        href="/dashboard"
        className="fixed top-4 left-4 z-[210] px-3 py-1.5 rounded-full text-xs border border-sky-500/30 bg-[#030712]/80 text-sky-300/90 backdrop-blur hover:text-white hover:border-cyan-400/50 transition"
      >
        ← Dashboard
      </Link>
    </>
  );
}
