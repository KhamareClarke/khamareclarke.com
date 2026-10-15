import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import StickyCTABar from "./StickyCTABar";
import EnquirySection from "./EnquirySection";

/**
 * The page envelope every marketing page shares.
 *
 * This exists because the identical three-element wrapper — Navbar, a
 * `<main className="flex min-h-screen flex-col bg-...">`, Footer — was copy-pasted
 * into 31 page files. The chrome was never missing; it was duplicated, which is why
 * it could drift. This is that same markup, once.
 *
 * `bg-surface` rather than a raw hex on purpose: it resolves to #0a0a0a, the same
 * black the homepage uses, and the 24 pages that wrote `bg-[#0a0a0a]` literally were
 * describing the same colour in a second way.
 *
 * ScrollProgress is included so the gold reading rule runs on every page the way it
 * does on the homepage. Without it the top of the viewport behaves differently the
 * moment you leave the homepage, which is exactly the discontinuity this is meant to
 * remove. It is `aria-hidden` and pointer-events-none, so it changes no layout.
 *
 * StickyCTABar is NOT included by default. It is homepage chrome, but it is also a
 * fixed mobile CTA bar — a conversion change rather than a visual one — so it is
 * opt-in per page via `stickyCta`. Ask before turning it on everywhere.
 *
 * EnquirySection IS included by default, so every marketing page carries the unified
 * enquiry form. The homepage and /business-bundle render their own instances (the
 * homepage inside EmailSection, the bundle with its own lead attribution) and suppress
 * this one with `showEnquiryForm={false}`, so no page shows two.
 *
 * `/presentation` and the dashboard/portal/login shells deliberately do not use this:
 * a slide deck and an auth-gated app are not marketing pages and never carried this
 * chrome. They therefore do not get the enquiry form, which is correct — a marketing
 * lead form has no place behind a login.
 *
 * @param {React.ReactNode} [schema] - JSON-LD <script> elements, rendered first
 * @param {boolean} [stickyCta=false] - include the homepage's mobile sticky CTA bar
 * @param {boolean} [showEnquiryForm=true] - set false on pages that render their own
 */
export default function PageShell({ children, schema, stickyCta = false, showEnquiryForm = true, className = "" }) {
  return (
    /* The nav and footer sit OUTSIDE <main>, and <main> holds only page content.
       Previously the whole envelope was a <main>, so the nav was its first child
       and the "skip to main content" link (targeting #main-content) landed on the
       nav it exists to skip. The flex container and its classes are unchanged, so
       the sticky footer, the reveal staggering and the fixed chrome all behave
       exactly as before; the only thing that moved is which element is called
       <main>. */
    <div className={`flex min-h-screen flex-col bg-surface ${className}`.trim()}>
      <ScrollProgress />
      <Navbar />
      {/* tabIndex={-1} so the skip link actually moves focus here. Without it the
          browser only sets the URL fragment, focus stays on the body, and the
          next Tab returns to the top of the page — the link would look correct
          and do nothing. -1 keeps main out of the tab order. */}
      <main id="main-content" tabIndex={-1}>
        {schema}
        {children}
        {showEnquiryForm ? <EnquirySection /> : null}
        {stickyCta ? <StickyCTABar /> : null}
      </main>
      <Footer />
    </div>
  );
}
