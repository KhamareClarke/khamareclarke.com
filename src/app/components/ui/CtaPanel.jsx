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
 * @param {React.ReactNode} heading - the panel's h2
 * @param {React.ReactNode} [body] - supporting paragraph
 * @param {React.ReactNode} children - the CTA itself (CTAButton), rendered centred
 */
export default function CtaPanel({ heading, body, children, className = "" }) {
  return (
    <div className={`reveal ${className}`.trim()} style={{ "--rv-delay": "260ms" }}>
      <div className="relative max-w-3xl mx-auto">
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[18px] bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"
        />

        <div className="relative bg-surface-muted border border-white/10 rounded-[16px] p-6 md:p-9 text-center">
          {heading ? <h2 className="ds-heading-2 text-white mb-4">{heading}</h2> : null}

          {body ? (
            <p className="ds-lede text-muted mx-auto mb-8">{body}</p>
          ) : null}

          {children}
        </div>
      </div>
    </div>
  );
}
