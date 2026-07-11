"use client";

import React from "react";

/**
 * Wraps navbar content with design-system container (UAE template).
 * @param {'main'|'wide'} [size='main']
 */
export function NavbarWrapper({ className = "", size = "main", children, ...props }) {
  const maxWidthClass = size === "main" ? "max-w-content mx-auto" : "max-w-content-wide mx-auto";
  return (
    <div
      className={`w-full px-[var(--container-padding-x)] sm:px-[var(--container-padding-x-sm)] relative ${maxWidthClass} ${className}`.trim()}
      data-ds="navbar-wrapper"
      {...props}
    >
      {children}
    </div>
  );
}

export default NavbarWrapper;
