"use client";

import { useEffect, useState } from "react";

/**
 * Reading progress — a hairline gold rule across the top that fills as the visitor
 * moves down the page. It gives the scroll a sense of place and a visible destination,
 * which is what carries someone through a long page rather than letting them drift.
 *
 * Deliberately outside the layout flow (fixed, 2px) so it can never shift content.
 *
 * Two motions, and they are independent of each other: `scaleX` follows the scroll
 * position and is driven from here, while the gold sweeping along the fill comes from
 * the `.gold-rule` class in globals.css — the same keyframe, duration and zero delay as
 * every other gold gradient, so the bar is in phase with the text rather than drifting.
 * The sweep needs no media query of its own: the blanket prefers-reduced-motion rule in
 * globals.css zeroes its duration and iteration count along with everything else.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min(doc.scrollTop / scrollable, 1) : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
    >
      <div
        className="h-full origin-left gold-rule"
        style={{ transform: `scaleX(${progress})`, transition: "transform 90ms linear" }}
      />
    </div>
  );
};

export default ScrollProgress;
