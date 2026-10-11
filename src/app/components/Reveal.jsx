"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal for any block.
 *
 * Sits on the existing IntersectionObserver approach rather than pulling framer-motion
 * into every section, so a section only needs one wrapper to animate in.
 *
 * Two deliberate safety properties:
 *  - starts at opacity 0.35, never 0, so the content is readable even mid-reveal and if
 *    JavaScript never runs;
 *  - a 1.4s timeout reveals it regardless, so a missed observer can never leave a block
 *    stuck half-in (the content is always eventually fully visible).
 *
 * Transform + opacity only, so it cannot cause layout shift, and it is skipped entirely
 * under prefers-reduced-motion.
 */
const Reveal = ({ children, delay = 0, y = 22, className = "", as: Tag = "div" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    let done = false;
    const show = () => { if (!done) { done = true; setShown(true); } };

    // Safety net: never leave a block unrevealed.
    const fallback = setTimeout(show, 1400);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { show(); io.disconnect(); }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    return () => { clearTimeout(fallback); io.disconnect(); };
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        transform: shown ? "none" : `translateY(${y}px)`,
        opacity: shown ? 1 : 0.35,
        transition: shown
          ? `transform 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 560ms ease-out ${delay}ms`
          : "none",
        willChange: shown ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
