"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { goldAngleDeg } from "@/lib/gold-wave";

const SELECTOR = ".reveal, .reveal-img";

/**
 * The two observation bands. THE NESTING RULE HERE IS LOAD-BEARING:
 *
 *   ENTER reveals when an element OVERLAPS its band.
 *   LEAVE un-reveals when an element STOPS OVERLAPPING its band.
 *
 * For those two rules never to contradict each other, ENTER's band must be a strict
 * SUBSET of LEAVE's — overlap(ENTER) must imply overlap(LEAVE). If LEAVE's band were
 * the smaller one, an element near the edge would satisfy ENTER (add `.is-in`) and
 * LEAVE (remove `.is-in`) simultaneously, and the result would depend on which
 * callback the browser happened to deliver first. That is a flicker, and it is a race.
 *
 * With ENTER = [0%, 96%] of the viewport and LEAVE = [-12%, 112%], the containment is
 * exact, so the two callbacks are provably order-independent and no seeding or
 * "skip the first callback" flag is needed.
 *
 * The hysteresis is the gap between "top edge at 96%" and "top edge at 112%" — ~144px
 * of deliberate scroll. Trackpad jitter or a rubber-band bounce cannot strobe an
 * element on and off. Do NOT invert these: LEAVE's band must always be the WIDER one.
 *
 * WHY ENTER REACHES 96% AND NOT LESS. An element that sits in the bottom slice of the
 * viewport when the document is scrolled to its very END can never move again. With a
 * tighter band (an earlier revision used [0%, 88%]) the footer's legal line lands at
 * ~90% of the viewport at maximum scroll and stays at `opacity: 0` PERMANENTLY — the
 * © notice and the Privacy Policy / Terms links would simply never appear. Anything
 * the visitor can end up parked on must be inside the reveal band.
 *
 * `threshold: 0` rather than a ratio is what makes this height-independent. A ratio
 * threshold asks for an absolute overlap proportional to the element's height, so a
 * short eyebrow and a three-viewport section would fire at completely different visual
 * positions. "Any overlap with the band" fires at the same place for every height.
 *
 * The top inset is an absolute `0px`, not a percentage, for the same reason: a short
 * element pinned near the document top (the hero eyebrow is ~16px tall) has a `bottom`
 * that is a smaller fraction of the viewport as the viewport gets taller, so a
 * percentage inset would hold it permanently hidden on large screens.
 */
const ENTER = "0% 0px 0% 0px"; //  band = the viewport itself — reveal the moment it is visible
const LEAVE = "12% 0px 12% 0px"; // band = [-12%, 112%] — strict superset of ENTER

/**
 * Site-wide motion policy + bidirectional scroll-reveal driver (the `.reveal` system).
 *
 * `reducedMotion="user"` makes every framer-motion animation in the tree honour the
 * visitor's OS "reduce motion" setting. Required because the CSS
 * `@media (prefers-reduced-motion: reduce)` block in globals.css only stops CSS
 * animations — framer-motion animates in JavaScript and would otherwise run regardless.
 *
 * The effect below drives the `.reveal` system in globals.css, toggling `.is-in` as each
 * block enters AND leaves the viewport, so sections fade up on the way down and recede
 * again on the way back up, rather than firing once.
 *
 * Two failure modes are handled explicitly, because both leave content invisible
 * forever rather than merely unanimated:
 *   1. This provider lives in the root layout and does NOT remount on client-side
 *      navigation, so a mount-time-only query would never see the next page's
 *      elements — they would sit at `opacity: 0` with no observer and no fallback.
 *   2. Anything that mounts after this effect (conditional sections, carousel
 *      children) is equally invisible to a one-shot query.
 * A MutationObserver covers both. This is safe today only because nothing about it is
 * global: `globals.css` has no rule that hides a `.reveal` element on its own — the
 * hidden state requires `.motion-ready` on `<html>`, which the pre-paint gate adds
 * only when JavaScript is running and reduced motion is not requested.
 */
export default function MotionProvider({ children }) {
  useEffect(() => {
    const prefersReduced = () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const showAll = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("is-in"));

    if (prefersReduced()) {
      showAll();
      return;
    }

    // Every element is observed by each observer at most once, however many times the
    // MutationObserver sees it.
    const tracked = new WeakSet();

    const enter = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-in");
        }),
      { threshold: 0, rootMargin: ENTER }
    );
    const leave = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) e.target.classList.remove("is-in");
        }),
      { threshold: 0, rootMargin: LEAVE }
    );

    const register = (el) => {
      if (!el || tracked.has(el)) return;
      tracked.add(el);
      enter.observe(el);
      leave.observe(el);
    };

    const scan = (node) => {
      if (!node || node.nodeType !== 1) return;
      if (node.matches && node.matches(SELECTOR)) register(node);
      if (node.querySelectorAll) node.querySelectorAll(SELECTOR).forEach(register);
    };

    // No early return when this page has none: a session that opens on a page without
    // any `.reveal` elements must still pick them up on the next navigation.
    document.querySelectorAll(SELECTOR).forEach(register);

    // Late-mounted content. Coalesced into one animation frame and gated on a cheap
    // `matches`/`querySelector` test, so a carousel re-render costs nothing.
    let queued = false;
    const pending = [];
    const mutation = new MutationObserver((records) => {
      let relevant = false;
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (
            (node.matches && node.matches(SELECTOR)) ||
            (node.querySelector && node.querySelector(SELECTOR))
          ) {
            pending.push(node);
            relevant = true;
          }
        }
      }
      if (!relevant || queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        while (pending.length) scan(pending.pop());
      });
    });
    // `attributes` is deliberately NOT observed — the `is-in` writes above would
    // otherwise feed straight back into this observer on every toggle.
    mutation.observe(document.body, { childList: true, subtree: true });

    // Belt-and-braces: anything genuinely on screen but still hidden after 2.5s is
    // shown, so a missed intersection can never strand content.
    const fallback = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 2500);

    return () => {
      clearTimeout(fallback);
      mutation.disconnect();
      enter.disconnect();
      leave.disconnect();
    };
  }, []);

  // One clock for every gold gradient on the page, running the SAME maths the canvas
  // wave uses. It writes --gold-angle, which the gold gradients read, so the text swings
  // at the preloader's rate and in the preloader's direction instead of running its own
  // 14-second sweep off to one side.
  //
  // No handshaking is needed to keep the two in step: requestAnimationFrame timestamps
  // all share one time origin, so the `t` passed here is the same `t` the preloader's
  // canvas receives. They are in phase because they are reading the same clock, not
  // because anything is synchronising them.
  //
  // Paused when the tab is hidden and skipped under reduced motion, which leaves the
  // gradients at their resting angle.
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const root = document.documentElement;
    let raf = 0;

    const tick = (t) => {
      root.style.setProperty("--gold-angle", `${goldAngleDeg(t).toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };
    const play = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };

    play();
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
    return () => { pause(); };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
