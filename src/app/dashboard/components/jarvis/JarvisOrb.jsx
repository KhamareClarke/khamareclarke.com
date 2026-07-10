'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJarvis } from './JarvisProvider';

export default function JarvisOrb() {
  const router = useRouter();
  const { bootLine } = useJarvis();
  const [showBoot, setShowBoot] = useState(false);
  const [typedDone, setTypedDone] = useState(false);

  useEffect(() => {
    if (bootLine) setShowBoot(true);
  }, [bootLine]);

  useEffect(() => {
    if (!typedDone) return undefined;
    const t = setTimeout(() => setShowBoot(false), 4000);
    return () => clearTimeout(t);
  }, [typedDone]);

  const openJarvis = () => router.push('/dashboard/jarvis');

  return (
    <>
      {showBoot && bootLine && (
        <div
          className="fixed bottom-28 right-6 z-40 max-w-xs px-4 py-3 rounded-2xl jarvis-bubble-assistant text-sm text-sky-100/90 shadow-xl pointer-events-none border border-sky-400/25"
          role="status"
        >
          {bootLine}
        </div>
      )}
      <button
        type="button"
        onClick={openJarvis}
        aria-label="Open JARVIS full interface"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full border-2 border-sky-400/50 bg-[#030712] shadow-lg flex items-center justify-center transition hover:border-cyan-400 hover:scale-105 jarvis-orb-pulse"
      >
        <span className="absolute inset-0 rounded-full jarvis-orb-glow opacity-40" aria-hidden />
        <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 jarvis-orb-glow" />
      </button>
    </>
  );
}
