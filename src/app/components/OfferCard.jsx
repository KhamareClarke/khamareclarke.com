'use client';

import React from "react";
import CTAButton from "./CTAButton";

/**
 * The offer — one card.
 *
 * Extracted verbatim from PricingSection so the homepage and /business-bundle render the
 * SAME card rather than two copies that drift. Every default below is the homepage's own
 * value, so `<OfferCard />` reproduces the homepage's markup exactly.
 *
 * PRICE: £999 per month, confirmed by the client (2026-10-11). Was previously shown with
 * no period because nothing in the repo documented the basis.
 *
 * The pillar and assurance copy is the homepage's, unchanged. /business-bundle renders
 * this card with only `eventLabel` overridden, so its hero CTA keeps its own analytics
 * label while the card itself is identical.
 *
 * NOTE ON THE CTA: it carries `href="#contact"`, but CTAButton checks `useBookingWidget`
 * first and that branch wins, so an anchor is never rendered — the button opens the
 * booking widget. The href is kept because it is the homepage's own markup.
 */

const PILLARS = [
  {
    no: "01",
    title: "Get found",
    body: "Custom software: websites, apps, portals and platforms built to rank and convert. Technical and local SEO, AI search optimisation (AEO and GEO), and programmatic search at scale.",
  },
  {
    no: "02",
    title: "Capture & convert",
    body: "Enquiries captured from forms, calls and messaging. CRM, qualification, follow-up and automated appointment booking. Google and Meta Ads run inside the same system.",
  },
  {
    no: "03",
    title: "Automate operations",
    body: "Workflow automation across the tools you already use. Your software and data joined up. Email marketing built into your pipeline.",
  },
  {
    no: "04",
    title: "Measure & improve",
    body: "Reporting on what is actually happening: enquiries, response times and search visibility. The system gets tuned as it runs.",
  },
];

const ASSURANCE = [
  {
    label: "Security & compliance",
    body: "Built GDPR compliant, to the Cyber Essentials Plus control set. Hardened against credential leaks and the common vulnerability classes.",
  },
  {
    label: "Full documentation",
    body: "Every part of the build recorded step by step, so you always know what has been done and what it covers.",
  },
  {
    label: "Direct support",
    body: "From me, as it runs. No ticket queue.",
  },
];

export default function OfferCard({
  pillars = PILLARS,
  assurance = ASSURANCE,
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
