'use client';

import React from "react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";
import { Badge } from "./ui/Badge";

const TIERS = [
  {
    tier: "What You Get",
    price: "£999",
    tagline: "Everything your business needs to be found, capture every enquiry, and run without you chasing it, built as one system.",
    deliverables: [
      "Software engineering. Websites, apps, and platforms built to rank, convert, and scale.",
      "Search domination. SEO, AEO, GEO, and programmatic SEO across Google and AI search.",
      "Enquiry handling. Every call, form, and message captured, qualified, and booked automatically.",
      "Email marketing and CRM. Your pipeline built and connected, so leads get followed up, not lost.",
      "Ads management. Google Ads or Meta Ads run as part of the same system.",
      "Automation. The repetitive admin work removed from your week.",
      "Data and insight. Everything structured into one place, so decisions are based on what's actually happening.",
      "Security and compliance. GDPR compliant, secured against leaks, built to Cyber Essentials Plus standard, independently assessed.",
      "Full documentation. Every part of the build recorded step by step, so you always know exactly what's been done and what it covers.",
      "Direct support. From me, as it runs. No ticket queue.",
    ],
    outcome: "One system doing the work of an entire team, fully documented from day one.",
    caption: "",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="text-white py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="mb-12 md:mb-16 text-center">
          <Badge variant="outline" className="mb-6">The Offer</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white leading-tight">
            One system.
          </h2>
          <p className="text-[#ADB7BE] text-base md:text-lg max-w-2xl mx-auto">
            One price.
          </p>
        </div>

        <div className="grid grid-cols-1 max-w-2xl mx-auto">
          {TIERS.map((tier, i) => (
            <div
              key={tier.tier}
              className="bg-surface-muted border border-white/10 rounded-lg p-6 md:p-8 flex flex-col"
            >
              <h3 className="text-sm font-bold tracking-widest uppercase text-primary text-center mb-4">{tier.tier}</h3>

              <div className="mb-6 text-center">
                <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{tier.price}</div>
                <p className="text-[#ADB7BE] text-sm mt-2 leading-snug">{tier.tagline}</p>
              </div>

              <ul className="mb-6 space-y-3 flex-grow">
                {tier.deliverables.map((deliverable, j) => (
                  <li key={j} className="flex items-start text-sm text-white/80 gap-2.5">
                    <span className="flex-shrink-0 w-6 mt-2.5 h-[2px] bg-gradient-to-r from-transparent to-primary" aria-hidden="true" />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-white/10 mb-6 text-center">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest block mb-1">Outcome</span>
                <p className="text-[#ADB7BE] text-sm leading-relaxed">{tier.outcome}</p>
              </div>

              <div className="mt-auto">
                <CTAButton
                  href="#contact"
                  fullWidth
                  eventLabel={`pricing_${tier.tier.toLowerCase().replace(/ /g, '_')}_cta`}
                  caption={tier.caption}
                >
                  Book a Consultation
                </CTAButton>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
