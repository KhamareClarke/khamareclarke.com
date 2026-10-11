'use client';

import React from "react";
import CTAButton from "./CTAButton";

/**
 * The offer — one card.
 *
 * PRICE: £999 per month, confirmed by the client (2026-10-11). Was previously shown with
 * no period because nothing in the repo documented the basis.
 *
 * All eleven capabilities from the original copy are preserved; the pillar descriptions
 * are condensed so the whole offer reads on a single card rather than four plus a band.
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

const PricingSection = () => {
  return (
    <section id="pricing" className="text-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
            One system. <span className="gold-text">More business. Less work.</span>
          </h2>
          <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
            Your website, marketing, enquiries and automation, built to work as one system.
          </p>
        </div>

        {/* ── The offer card ── */}
        <div className="reveal" style={{ "--rv-delay": "260ms" }}>
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
                {PILLARS.map((pillar) => (
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
                {ASSURANCE.map((item) => (
                  <p key={item.label} className="text-base leading-relaxed">
                    <span className="text-primary font-bold">{item.label}.</span>{" "}
                    <span className="text-white/80">{item.body}</span>
                  </p>
                ))}
              </div>

              {/* Outcome */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white text-base md:text-lg font-semibold leading-relaxed max-w-xl mx-auto">
                  One system doing the work of an entire team, fully documented from day one.
                </p>
              </div>

              {/* Not `.reveal` — the offer card above it is, and nesting two reveals
                  compounds the transform and multiplies the opacity. */}
              <div className="mt-7">
                <CTAButton
                  href="#contact"
                  fullWidth
                  eventLabel="pricing_what_you_get_cta"
                  caption="What the £999 buys, line by line."
                >
                  Book a Consultation
                </CTAButton>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
