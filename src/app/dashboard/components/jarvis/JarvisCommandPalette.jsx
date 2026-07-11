'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function JarvisCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery('');
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    setOpen(false);
    router.push('/dashboard/jarvis');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
      <form
        onSubmit={submit}
        className="relative w-full max-w-lg rounded-xl border border-cyan-400/30 bg-[#0a1628] shadow-2xl shadow-cyan-500/10 overflow-hidden"
        role="dialog"
        aria-label="Command palette"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask JARVIS…"
          className="w-full bg-transparent px-4 py-4 text-white text-sm focus:outline-none border-b border-[#222]"
        />
        <div className="px-4 py-3 text-xs text-[#888] flex justify-between">
          <span>Ask JARVIS: {query || '…'}</span>
          <span>Enter to send · Esc to close</span>
        </div>
      </form>
    </div>
  );
}
