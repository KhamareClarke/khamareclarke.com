"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts a metric up when it scrolls into view.
 *
 * The prefix and suffix are preserved exactly: "30+" keeps its "+", "0.9s" keeps its
 * "s", "~20" keeps its "~", "12k+" keeps its "k+". The previous implementation ran
 * parseInt over the stripped digits, which would have turned "30+" into "30" and
 * "0.9s" into "0" — silently changing the claim. Never parse a figure you intend to
 * display back to the reader.
 *
 * Server render shows the exact final value, so there is no hydration mismatch and no
 * opacity:0 — the number is always readable, animated or not.
 */
const CountUpNumber = ({ value, duration = 1.3 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState(null);

  const text = String(value);
  const parts = text.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const digitsRaw = parts ? parts[2] : null;   // stable dep for the effect below

  useEffect(() => {
    if (digitsRaw === null || !inView || reduce) return;
    const target = parseFloat(digitsRaw);
    const decimals = (digitsRaw.split(".")[1] || "").length;
    let raf = 0;
    let start = 0;

    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setShown((target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, duration, digitsRaw]);

  if (!parts) return <span ref={ref} className="ds-numeric">{text}</span>;

  const prefix = parts[1];
  const digits = parts[2];
  const suffix = parts[3];

  return (
    <span ref={ref} className="ds-numeric">
      {prefix}
      {shown === null ? digits : shown}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
