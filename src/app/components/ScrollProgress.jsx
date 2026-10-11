"use client";

import { useEffect, useState } from "react";

/**
 * Reading progress — a hairline gold rule across the top that fills as the visitor
 * moves down the page. It gives the scroll a sense of place and a visible destination,
 * which is what carries someone through a long page rather than letting them drift.
 *
 * Deliberately outside the layout flow (fixed, 2px) so it can never shift content.
 * Not animated independently — it only follows scroll position, so it is safe under
 * prefers-reduced-motion and needs no media query.
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
