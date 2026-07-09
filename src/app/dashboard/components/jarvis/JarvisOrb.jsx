'use client';

import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useJarvis } from './JarvisProvider';

export default function JarvisOrb() {
  const { toggle, streaming, speaking, bootLine } = useJarvis();
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

  return (
    <>
      {showBoot && bootLine && (
        <div
          className="fixed bottom-24 right-6 z-40 max-w-xs px-4 py-2 rounded-lg bg-[#1a1a1a]/95 border border-[#ffb700]/30 text-sm text-[#ADB7BE] shadow-lg pointer-events-none"
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
        aria-label="Open JARVIS assistant"
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full border-2 border-[#ffb700]/60 bg-[#0a0a0a] shadow-lg flex items-center justify-center transition hover:border-[#ffb700] hover:shadow-[#ffb700]/20 hover:shadow-xl ${
          streaming || speaking ? 'jarvis-orb-pulse' : ''
        }`}
      >
        <span
          className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#ffb700] to-[#c99400] opacity-90 jarvis-orb-glow ${
            speaking ? 'jarvis-orb-speaking' : ''
          }`}
        />
      </button>
    </>
  );
}
