import React from "react";

/**
 * The closing call-to-action panel.
 *
 * Built from the homepage's offer card in PricingSection.jsx — the same three-layer
 * construction, not a lookalike:
 *
 *   outer   <div className="reveal" style={{ "--rv-delay": "260ms" }}>   the reveal
 *   hairline <div className="absolute -inset-px rounded-[18px]
 *                    bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
 *   panel   <div className="relative bg-surface-muted border border-white/10
 *                    rounded-[16px] p-6 md:p-9">
 *
 * The hairline sits one pixel proud of the panel behind it, so the gold reads as light
 * escaping from the edge rather than as a border. It is the homepage's signature panel
 * and it is `aria-hidden`, so it costs the accessibility tree nothing.
 *
 * What this replaces: 12–18 pages had their own CTA card —
 * `bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center`. Three
 * differences, all of them the point of the exercise: the fill becomes `surface-muted`
 * (#181818, the homepage's panel colour, two units off the #1a1a1a it replaces), the
 * flat gold border is swapped for the gradiated hairline, and radius 16px replaces
 * 24px — the homepage's card radius, not a second one invented beside it.
 *
 * The panel has no reveal of its own; the outer div carries it, so the whole card
 * arrives as one object. The delay is 260ms to match PricingSection.
 *
 * HEADING LEVEL IS THE CALLER'S, AND IT DEFAULTS TO NOT-A-HEADING. This matters more
 * than it looks. The homepage's own panel carries no heading element inside it at all —
 * PricingSection's card leads with a gold label and the price, while the H2 sits in the
 * section header above. But the pages this replaces were inconsistent: /about and
 * /locations had a real <h2> in their CTA, whereas the blog posts had a styled <p>
 * ("Book a free 30-minute call. No obligation."). Rendering everything as <h2> silently
 * added a commercial heading to the outline of six blog posts that never had one — a
 * change to the document outline, which is not something a design migration should
 * spend. So the level is explicit, and `p` is the default because "add no heading" is
 * the safe direction to be wrong in.
 *
 *   headingLevel="p"   (default) a styled paragraph, matching the homepage's panel
 *   headingLevel="h2"  only where the page already had an <h2> there
 *   headingLevel="h3"  where it already had an <h3>
 *
 * `body` is rendered in a <div> rather than a <p> so a caller can pass more than one
 * paragraph without producing invalid nested <p> elements. The original CTA blocks
 * often had two.
 *
 * @param {React.ReactNode} heading
 * @param {React.ReactNode} [body] - string or JSX; may contain paragraphs
 * @param {'p'|'h2'|'h3'} [headingLevel='p']
 * @param {React.ReactNode} children - the CTA itself (CTAButton), rendered centred
 */
export default function CtaPanel({ heading, body, headingLevel = "p", children, className = "" }) {
  const Heading = headingLevel;
  const headingClass =
    headingLevel === "p"
      ? "text-white font-bold text-xl mb-2"
      : "ds-heading-2 text-white mb-4";

  return (
    <div className={`reveal ${className}`.trim()} style={{ "--rv-delay": "260ms" }}>
      <div className="relative max-w-3xl mx-auto">
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[18px] bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"
        />

        <div className="relative bg-surface-muted border border-white/10 rounded-[16px] p-6 md:p-9 text-center">
          {heading ? <Heading className={headingClass}>{heading}</Heading> : null}

          {body ? (
            <div className="ds-lede text-muted mx-auto mb-8">{body}</div>
          ) : null}

          {children}
        </div>
      </div>
    </div>
  );
}
