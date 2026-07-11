"use client";

import React from "react";

/**
 * Page section with consistent vertical rhythm (UAE design system).
 * @param {string} [as='section'] - Render as 'section', 'div', or 'footer'
 * @param {'default'|'large'} [size='default'] - Vertical padding size
 */
export function Section({ className = "", size = "default", as: Comp = "section", ...props }) {
  const paddingClass =
    size === "default" ? "py-[var(--space-6)]" : "py-[var(--section-padding-y-lg)]";
  return (
    <Comp
      className={`relative overflow-hidden ${paddingClass} ${className}`.trim()}
      data-ds="section"
      {...props}
    />
  );
}

export default Section;
