'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Mirrors the Preloader's exclusion. A film layer over a live slide deck is a defect,
// not an atmosphere — grain and a vignette would sit on top of every slide.
const EXCLUDED_ROUTES = ['/presentation'];

// Ignore scroll deltas smaller than this. Trackpads and momentum scrolling emit a
// stream of tiny reversals; without a dead band the frame would strobe on every one.
const DEAD_BAND_PX = 8;
// Minimum gap between direction writes, so a fast flick up-and-down cannot thrash it.
const SETTLE_MS = 120;

/**
 * CinematicLayer — the film atmosphere.
 *
 * Three fixed, decorative overlays that texture the whole page: a colour grade, a
 * vignette, and animated film grain. All styling lives in the "Cinematic atmosphere"
 * block at the end of globals.css.
 *
 * The layer also breathes with the scroll: moving down opens the frame up, moving up
 * closes it down. That is driven by a single `data-kc-scroll` attribute on the wrapper
 * — NOT by React state — so there is no re-render per frame, and the animation itself
 * is a CSS transition on `opacity`, which runs on the compositor. The attribute is
 * written only when the direction actually flips, so a whole page scroll costs a
 * handful of DOM writes rather than one per frame.
 *
 * `opacity` is used rather than `filter: brightness()` deliberately: a filter on a
 * full-viewport element forces a repaint of the entire screen on every frame of the
 * transition, which is exactly the wrong thing to do on a mid-range phone.
 *
 * This component is purely additive. It renders no layout, occupies no space, and
 * every element is pointer-events: none, so nothing on the page becomes unclickable.
 * Delete this file and its <CinematicLayer /> line in layout.js and the page returns
 * to exactly its previous appearance.
 *
 * Accessibility: aria-hidden throughout — it carries no information. Under
 * prefers-reduced-motion the scroll listener is never even attached, so the frame is
 * completely static and the grade, vignette and grain simply sit at their resting
 * values.
 */
export default function CinematicLayer() {
  const pathname = usePathname();
  const excluded =
    !!pathname && EXCLUDED_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  useEffect(() => {
    if (excluded) return;

    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) return; // no listener at all — nothing to clean up

    const layer = document.querySelector('[data-kc-cinematic]');
    if (!layer) return;

    let lastY = window.scrollY;
    let direction = null;
    let frame = 0;
    let lastWrite = 0;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < DEAD_BAND_PX) return;
      lastY = y;

      const next = delta > 0 ? 'down' : 'up';
      if (next === direction) return;

      const now = performance.now();
      if (now - lastWrite < SETTLE_MS) return;

      direction = next;
      lastWrite = now;
      layer.setAttribute('data-kc-scroll', next);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // If the visitor turns reduced-motion on mid-session, drop the attribute so the
    // frame returns to its static resting state.
    const onMotionChange = () => {
      if (mq.matches) {
        layer.removeAttribute('data-kc-scroll');
        direction = null;
      }
    };
    if (mq && mq.addEventListener) mq.addEventListener('change', onMotionChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onMotionChange);
      if (frame) cancelAnimationFrame(frame);
      layer.removeAttribute('data-kc-scroll');
    };
  }, [excluded]);

  if (excluded) return null;

  return (
    <div aria-hidden="true" data-kc-cinematic>
      <div className="cine-grade" />
      <div className="cine-vignette" />
      <div className="cine-grain" />
    </div>
  );
}
