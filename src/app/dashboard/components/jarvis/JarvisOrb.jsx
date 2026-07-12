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
          className="fixed bottom-28 right-6 z-40 max-w-xs px-4 py-3 rounded-2xl jarvis-bubble-assistant text-sm text-[#fff8e1]/90 shadow-xl pointer-events-none border border-[#ffb700]/25"
          role="status"
        >
          {bootLine}
        </div>
      )}
      <button
        type="button"
        onClick={openJarvis}
        aria-label="Open JARVIS full interface"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full border-2 border-[#ffb700]/50 bg-[#080600] shadow-lg flex items-center justify-center transition hover:border-[#ffb700] hover:scale-105 jarvis-orb-pulse"
      >
        <span className="absolute inset-0 rounded-full jarvis-orb-glow opacity-40" aria-hidden />
        <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd54f] via-[#ffb700] to-[#ff8c00] jarvis-orb-glow" />
      </button>
    </>
  );
}
