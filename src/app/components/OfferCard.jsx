'use client';

import React from "react";
import CTAButton from "./CTAButton";
import { OFFER_PILLARS, OFFER_ASSURANCE } from "../../lib/offer-data";

/**
 * The offer — one card.
 *
 * Extracted from PricingSection so the homepage, /services and /business-bundle render the
 * SAME card rather than three copies that drift. Every default below reproduces the card
 * those pages show, so `<OfferCard />` is the whole offer.
 *
 * PRICE: £999 per month, confirmed by the client (2026-10-11). Was previously shown with
 * no period because nothing in the repo documented the basis.
 *
 * The pillars and the assurance lines are NOT defined here. They live in
 * lib/offer-data.js, which is the single source for all three pages. They used to exist in
 * this file and separately as props passed by /services, which is why the homepage and
 * /services used to describe the same price differently. Pass `pillars` or `assurance` only
 * if a page genuinely needs different text, which none currently does.
 *
 * NOTE ON THE CTA: it carries `href="#contact"`, but CTAButton checks `useBookingWidget`
 * first and that branch wins, so an anchor is never rendered — the button opens the
 * booking widget. The href is kept because it is the homepage's own markup.
 */

export default function OfferCard({
  pillars = OFFER_PILLARS,
  assurance = OFFER_ASSURANCE,
  eventLabel = "pricing_what_you_get_cta",
  ctaHref = "#contact",
  ctaCaption = "What the £999 buys, line by line.",
  ctaLabel = "Book a Consultation",
  // The card's closing line. A prop rather than a constant so a page can omit it without
  // editing this file — /services does. The default is the homepage's own string, so the
  // homepage's card is unchanged.
  outcome = "One system doing the work of an entire team, fully documented from day one.",
  revealDelay = "260ms",
}) {
  return (
    <div className="reveal" style={{ "--rv-delay": revealDelay }}>
      <div className="relative max-w-3xl mx-auto">
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[18px] bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"
        />

        <div className="relative bg-surface-muted border border-white/10 rounded-[16px] p-6 md:p-9">

          {/* Price */}
          <div className="text-center pb-7 mb-8 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] gold-text block mb-4">
              What you get
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="ds-numeric text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.03em] leading-none">
                £999
              </span>
              <span className="text-[#ADB7BE] text-base md:text-lg font-semibold">/month</span>
            </div>
            <p className="text-[#ADB7BE] text-sm md:text-base mt-5 leading-relaxed max-w-xl mx-auto">
              Everything your business needs to get found, capture every enquiry and run without you chasing it. Built as one system.
            </p>
          </div>

          {/* Four pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {pillars.map((pillar) => (
              <div key={pillar.no}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="gold-text font-bold text-base leading-none tabular-nums">{pillar.no}</span>
                  <h3 className="text-white font-bold text-lg tracking-[-0.01em]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-[#ADB7BE] text-base leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>

          {/* Assurance */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            {assurance.map((item) => (
              <p key={item.label} className="text-base leading-relaxed">
                <span className="text-primary font-bold">{item.label}.</span>{" "}
                <span className="text-white/80">{item.body}</span>
              </p>
            ))}
          </div>

          {/* Outcome */}
          {outcome ? (
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-white text-base md:text-lg font-semibold leading-relaxed max-w-xl mx-auto">
                {outcome}
              </p>
            </div>
          ) : null}

          {/* Not `.reveal` — the offer card above it is, and nesting two reveals
              compounds the transform and multiplies the opacity. */}
          <div className="mt-7">
            <CTAButton
              href={ctaHref}
              fullWidth
              eventLabel={eventLabel}
              caption={ctaCaption}
            >
              {ctaLabel}
            </CTAButton>
          </div>

        </div>
      </div>
    </div>
  );
}
