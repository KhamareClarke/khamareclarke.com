'use client';

import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useJarvis } from './JarvisProvider';

export default function JarvisOrb() {
  const { toggle, streaming, speaking, listening, bootLine } = useJarvis();
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

  const active = streaming || speaking || listening;

  return (
    <>
      {showBoot && bootLine && (
        <div
          className="fixed bottom-28 right-6 z-40 max-w-xs px-4 py-3 rounded-2xl jarvis-bubble-assistant text-sm text-sky-100/90 shadow-xl pointer-events-none border border-sky-400/25"
          role="status"
        >
          {!typedDone ? (
            <TypeAnimation
              sequence={[bootLine, () => setTypedDone(true), 500]}
              speed={75}
              cursor={false}
            />
          ) : (
            bootLine
          )}
        </div>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label="Open JARVIS voice assistant"
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full border-2 border-sky-400/50 bg-[#030712] shadow-lg flex items-center justify-center transition hover:border-cyan-400 hover:scale-105 ${
          active ? 'jarvis-orb-pulse' : ''
        }`}
      >
        <span className="absolute inset-0 rounded-full jarvis-orb-glow opacity-40" aria-hidden />
        <span
          className={`relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 jarvis-orb-glow ${
            speaking ? 'jarvis-orb-speaking' : listening ? 'jarvis-core-listening' : ''
          }`}
        />
        {listening && (
          <span className="absolute inset-0 rounded-full border border-cyan-400/60 jarvis-ring" aria-hidden />
        )}
      </button>
    </>
  );
}
