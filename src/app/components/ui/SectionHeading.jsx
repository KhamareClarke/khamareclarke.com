import React from "react";

/**
 * A section heading with its optional lede, in the homepage's treatment.
 *
 * Taken from the homepage's own sections (ServicesSection, PricingSection, and the
 * rest all open the same way):
 *
 *   <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
 *   <p  className="reveal ds-lede text-muted mx-auto"  style={{ "--rv-delay": "200ms" }}>
 *
 * The 120/200ms pair is the homepage's heading stagger, not a number picked here.
 *
 * WHAT THIS REPLACES, and why the look changes. 18 pages were using
 * `text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4` —
 * a gold left rule beside each h2. That is a treatment the homepage does not use
 * anywhere. The homepage gets its gold into a heading by colouring a word inside it
 * (`One system. <span className="gold-text">More business. Less work.</span>`), which
 * is why `children` is JSX: pass the span in, from the page, exactly as the homepage
 * does. The left rule is gone; the gold is not, it just moved into the words.
 *
 * `align` is 'left' by default because prose sections read better anchored, and
 * 'center' for the ones the homepage centres. It changes alignment only — the type
 * scale, weight, tracking and reveal timing are identical either way.
 *
 * @param {React.ReactNode} children - the heading text; wrap a word in <span className="gold-text"> for the accent
 * @param {React.ReactNode} [lede] - supporting paragraph
 * @param {string} [id] - for aria-labelledby on the enclosing <section>
 * @param {'left'|'center'} [align='left']
 */
export default function SectionHeading({
  children,
  lede,
  id,
  align = "left",
  className = "",
}) {
  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center" : ""} ${className}`.trim()}
      data-ds="section-heading"
    >
      <h2
        id={id}
        className="reveal ds-heading-2 text-white mb-4"
        style={{ "--rv-delay": "120ms" }}
      >
        {children}
      </h2>

      {lede ? (
        <p
          className={`reveal ds-lede text-muted ${align === "center" ? "mx-auto" : ""}`.trim()}
          style={{ "--rv-delay": "200ms" }}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
