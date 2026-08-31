"use client";

import React from "react";

const textVariants = {
  outline: "gold-text",
  solid: "gold-text",
  neutral: "text-muted",
};

/**
 * Eyebrow label rendered as text flanked by fading gradient dashes —
 * the same treatment used in the hero "AI Implementation Specialist" eyebrow.
 * Replaces the former pill tag across all sections. One radius, one weight,
 * one size — no per-section overrides (except the className passthrough).
 * @param {'outline'|'solid'|'neutral'} [variant='outline']
 */
export function Badge({ className = "", variant = "outline", children, ...props }) {
  const textColor = textVariants[variant] || textVariants.outline;
  return (
    <div
      className={`inline-flex items-center gap-4 h-4 ${className}`.trim()}
      data-ds="badge"
      data-variant={variant}
      {...props}
    >
      <span
        className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]"
        aria-hidden="true"
      />
      <p className={`text-xs font-semibold tracking-[0.18em] uppercase leading-none whitespace-nowrap ${textColor}`}>
        {children}
      </p>
      <span
        className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]"
        aria-hidden="true"
      />
    </div>
  );
}

export default Badge;
