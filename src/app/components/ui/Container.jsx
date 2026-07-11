"use client";

import React from "react";

const sizeClasses = {
  main: "max-w-content mx-auto",
  wide: "max-w-content-wide mx-auto",
  narrow: "max-w-content-narrow mx-auto",
  content: "max-w-[var(--container-content)] mx-auto",
};

/**
 * Max-width + horizontal padding (UAE design system).
 * @param {'main'|'wide'|'narrow'|'content'} [size='main']
 */
export function Container({ className = "", size = "main", ...props }) {
  return (
    <div
      className={`w-full px-[var(--container-padding-x)] sm:px-[var(--container-padding-x-sm)] relative z-10 ${sizeClasses[size]} ${className}`.trim()}
      data-ds="container"
      {...props}
    />
  );
}

export default Container;
