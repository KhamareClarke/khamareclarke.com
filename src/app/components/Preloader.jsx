'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'kc-preloader-shown';

export default function Preloader() {
  const [phase, setPhase] = useState('init'); // init | show | fading | gone

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setPhase('gone');
      return;
    }
    setPhase('show');
    const fadeTimer = setTimeout(() => setPhase('fading'), 1800);
    const goneTimer = setTimeout(() => {
      setPhase('gone');
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) {}
    }, 2350);
    return () => { clearTimeout(fadeTimer); clearTimeout(goneTimer); };
  }, []);

  if (phase === 'init' || phase === 'gone') return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#070600',
        transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden="true"
        width={120}
        height={120}
        style={{
          display: 'block',
          animation: 'kc-logo-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
          filter:
            'drop-shadow(0 0 18px rgba(255,183,0,0.65)) drop-shadow(0 0 44px rgba(255,140,0,0.32))',
        }}
      />
      <style>{`
        @keyframes kc-logo-in {
          from { transform: scale(0.75); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
