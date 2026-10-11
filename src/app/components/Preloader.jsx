'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createGoldWave } from '@/lib/gold-wave';

// Routes that must never be covered by the preloader. /presentation is a live deck —
// a brand overlay in front of it is dead air while presenting.
const EXCLUDED_ROUTES = ['/presentation'];

const HOLD_MS = 1900;
const FADE_MS = 620;

/**
 * Preloader — canvas chroma wave.
 *
 * A canvas draws flowing chroma waves (amber -> warm white -> deep amber) that are
 * masked to the lion's silhouette, so the light ripples *through the mark* rather
 * than sweeping over a rectangle. The mark sits on top, unchanged.
 *
 * One effect only: the halo ring and the breathing scale that competed with it have
 * been removed, which is what made the earlier version feel busy.
 *
 * Reduced motion: the canvas loop never starts and the static mark is shown.
 */
export default function Preloader() {
  const pathname = usePathname();
  const excluded =
    !!pathname && EXCLUDED_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // Starts as 'show', NOT 'init', so the overlay is present in the server HTML and
  // covers the page on the very first painted frame. Starting hidden meant the page
  // flashed before the preloader appeared. The head gate (layout.js) suppresses it
  // pre-paint for returning visitors and excluded routes.
  const [phase, setPhase] = useState('show'); // show | fading | gone
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = typeof document !== 'undefined' ? document.documentElement : null;

    // /presentation is a live deck and the head gate marks it "skip" before paint.
    if (excluded || (el && el.getAttribute('data-kc-preload') === 'skip')) {
      setPhase('gone');
      return;
    }

    // Runs on EVERY navigation, not once per session. Client-side routing does not
    // remount this component, so without `pathname` in the dependency list the overlay
    // would never appear again after the first page. Clearing the "done" marker
    // re-arms the stylesheet's reveal hold, so the incoming page resolves as this
    // overlay lifts rather than finishing behind it.
    if (el) el.removeAttribute('data-kc-preload');
    setPhase('show');

    const fadeTimer = setTimeout(() => setPhase('fading'), HOLD_MS);
    const goneTimer = setTimeout(() => setPhase('gone'), HOLD_MS + FADE_MS);
    return () => { clearTimeout(fadeTimer); clearTimeout(goneTimer); };
  }, [excluded, pathname]);

  const visible = phase === 'show' || phase === 'fading';

  // Release the entrance offset. globals.css holds the reveal system back by HOLD_MS
  // while `data-kc-preload` is absent, so the hero resolves as this overlay lifts
  // rather than finishing behind it. Once we are clear, mark it "done" so the offset
  // drops to zero and content revealed later — on scroll — is not delayed.
  // Never overwrite "skip": that value is the head gate's, and it already means
  // "no offset" to the stylesheet.
  useEffect(() => {
    if (phase !== 'gone') return;
    const el = document.documentElement;
    if (el.getAttribute('data-kc-preload') !== 'skip') {
      el.setAttribute('data-kc-preload', 'done');
    }
  }, [phase]);

  // Lock the page behind the overlay so it genuinely covers the viewport.
  useEffect(() => {
    if (!visible) return;
    // Never lock the page for a visitor the head gate has already skipped.
    if (
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-kc-preload') === 'skip'
    ) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevTouch = body.style.touchAction;
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    return () => {
      body.style.overflow = prevOverflow;
      body.style.touchAction = prevTouch;
    };
  }, [visible]);

  // ── Canvas chroma wave ─────────────────────────────────────
  // The wave itself lives in src/lib/gold-wave.js and is shared with the on-page brand
  // mark. It used to be written out here, which meant the loading screen and the mark
  // in the header and footer were two copies of the same maths and could drift apart.
  // One renderer, two callers: change it there and both move together.
  useEffect(() => {
    if (!visible) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // static mark only

    return createGoldWave(canvasRef.current);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      data-kc-preloader
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100%',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#070600',
        overflow: 'hidden',
        overscrollBehavior: 'none',
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @supports (height: 100dvh) {
          [data-kc-preloader] { height: 100dvh !important; }
        }

        @keyframes kc-mark-in {
          from { opacity: 0; transform: translateY(6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* Overlay is suppressed before paint for returning visitors / excluded routes. */
        html[data-kc-preload="skip"] [data-kc-preloader] { display: none !important; }

        .kc-stack {
          position: relative;
          width: 200px;
          height: 200px;
          animation: kc-mark-in 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* Base mark */
        .kc-base {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter:
            drop-shadow(0 0 14px rgba(255,183,0,0.45))
            drop-shadow(0 0 40px rgba(255,140,0,0.22));
        }

        /* Chroma wave, already masked to the mark on the canvas */
        .kc-wave {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        @media (max-width: 420px) {
          .kc-stack { width: 156px; height: 156px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .kc-stack { animation: none !important; }
          .kc-wave { display: none !important; }
        }
`,
        }}
      />

      <div className="kc-stack">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="kc-base" src="/images/logo.webp" alt="" aria-hidden="true" width={200} height={200} />
        <canvas ref={canvasRef} className="kc-wave" aria-hidden="true" />
      </div>
    </div>
  );
}
