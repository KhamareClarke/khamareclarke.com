'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'kc-preloader-shown';

export default function Preloader() {
  const [phase, setPhase] = useState('init'); // init | show | fading | gone

  useEffect(() => {
    // Only run once per browser session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setPhase('gone');
      return;
    }

    setPhase('show');

    const fadeTimer = setTimeout(() => setPhase('fading'), 2000);
    const goneTimer = setTimeout(() => {
      setPhase('gone');
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) {}
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === 'init' || phase === 'gone') return null;

  return (
    <div
      role="status"
      aria-label="Loading Khamare Clarke"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#070600',
        transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      {/* ── Ambient radial glow ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255,183,0,0.14) 0%, rgba(255,140,0,0.07) 40%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Logo ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          animation: 'kc-preloader-in 0.55s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {/* Halo bloom behind logo */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-2rem',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,183,0,0.28) 0%, rgba(255,140,0,0.12) 40%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/lion-logo.svg"
          alt=""
          aria-hidden="true"
          width={88}
          height={88}
          style={{
            display: 'block',
            filter:
              'drop-shadow(0 0 18px rgba(255,183,0,0.65)) drop-shadow(0 0 40px rgba(255,140,0,0.35))',
          }}
        />
      </div>

      {/* ── Name ────────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          animation: 'kc-preloader-up 0.6s ease both 0.28s',
        }}
      >
        <p
          style={{
            fontFamily: 'Montserrat, Inter, sans-serif',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#fff8e1',
            margin: 0,
            lineHeight: 1,
          }}
        >
          Khamare Clarke
        </p>
        <p
          style={{
            fontFamily: 'Montserrat, Inter, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(255,183,0,0.6)',
            marginTop: '0.4rem',
            marginBottom: 0,
          }}
        >
          SEO · AI · Systems
        </p>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          marginTop: '3rem',
          width: '9rem',
          height: '1px',
          background: 'rgba(26,8,0,0.9)',
          borderRadius: '9999px',
          overflow: 'hidden',
          animation: 'kc-preloader-up 0.4s ease both 0.18s',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff8c00, #ffb700 50%, #ff8c00)',
            borderRadius: '9999px',
            animation: 'kc-progress 1.65s cubic-bezier(0.4,0,0.2,1) both 0.22s',
          }}
        />
      </div>

      {/* ── Keyframes injected inline ─────────────────────────────────────── */}
      <style>{`
        @keyframes kc-preloader-in {
          from { transform: scale(0.72); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes kc-preloader-up {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes kc-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
