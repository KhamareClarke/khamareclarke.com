"use client";

import React from "react";

/**
 * Single-radius card (UAE design system component inventory).
 * One border treatment, one padding scale. Structural line over shadow.
 * @param {React.ElementType} [as='div']
 */
export function Card({ className = "", as: Comp = "div", ...props }) {
  return (
    <Comp
      className={`rounded-lg border border-white/10 bg-surface-muted p-6 ${className}`.trim()}
      data-ds="card"
      {...props}
    />
  );
}

export default Card;
