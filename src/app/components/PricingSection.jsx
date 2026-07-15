'use client';

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const TIERS = [
  {
    tier: "VISIBILITY & AUTOMATION",
    price: "£1,495/mo",
    tagline: "Search visibility, AI automation, enquiry handling, and operational reporting.",
    mostPopular: true,
    cta: "Book a Consultation →",
    deliverables: [
      "Ranking on Google, ChatGPT, Gemini, Perplexity",
      "AI answering every enquiry 24/7, qualifying and booking",
      "Automated follow-up sequences and pipeline management",
      "Website optimised for speed and conversion",
      "Content strategy and SEO technical work",
      "Programmatic location and service pages",
      "Monthly reporting on enquiries, conversions, cost per lead",
    ],
    outcome: "3–5X enquiry increase within 60 days. Team hours freed from admin. Clear visibility of what's working.",
    caption: "Rolling monthly",
  },
  {
    tier: "COMPLETE SYSTEMS",
    price: "£2,950/mo",
    tagline: "Visibility, automation, custom infrastructure, and strategic partnership.",
    mostPopular: false,
    cta: "Book a Consultation →",
    deliverables: [
      "Everything in Visibility & Automation",
      "Custom software and applications built to your workflow",
      "Website rebuilt for performance, conversion, and scale",
      "Email marketing automation and customer journey systems",
      "CRM integration and pipeline infrastructure",
      "Programmatic SEO and content production at scale",
      "Quarterly strategy reviews with your leadership",
      "Ongoing optimisation and capability expansion",
    ],
    outcome: "Complete operational transformation. Qualified leads delivered daily. Team freed for strategic work. AI infrastructure embedded in your business.",
    caption: "Rolling monthly",
  },
  {
    tier: "ENTERPRISE IMPLEMENTATION",
    price: "£4,995/mo",
    tagline: "Full AI deployment, custom applications, market dominance, and dedicated support.",
    mostPopular: false,
    cta: "Book a Consultation →",
    deliverables: [
      "Everything in Complete Systems",
      "Advanced custom applications specific to your market",
      "Multi-location programmatic SEO and local dominance",
      "Advanced automation across all operational workflows",
      "Dedicated implementation specialist on retainer",
      "Monthly board-level strategy and performance reviews",
      "Priority access to new capabilities and tools",
      "Guaranteed outcomes with performance benchmarks",
    ],
    outcome: "Market position locked. All systems automated and integrated. Leadership-level strategic partnership. Competitive advantage built into every operation.",
    caption: "Rolling monthly",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="text-white py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="text-center mb-16">
          <span className="inline-block border border-[#ffb700] text-[#ffb700] text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase bg-black/30 shadow-sm mb-6">
            ENGAGEMENTS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Working Together.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
              Transparent Delivery.
            </span>
          </h2>
          <p className="text-[#ADB7BE] text-base md:text-lg max-w-2xl mx-auto mt-2 leading-relaxed">
            Choose the engagement model that fits your operational requirements and timeline.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0.85, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.tier}
              className={`relative bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black border-2 rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-300 overflow-visible hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(255,183,0,0.15)] ${
                tier.mostPopular
                  ? 'border-[#ffb700] shadow-2xl shadow-[#ffb700]/20 md:scale-105 z-10'
                  : 'border-[#ffb700]/30'
              }`}
              initial={{ opacity: 0.85, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.08 }}
            >
              {tier.mostPopular && (
                <motion.span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ffb700] text-[#1a1a1a] text-xs font-extrabold px-4 py-1 rounded-full shadow-lg tracking-wide uppercase z-30 whitespace-nowrap"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatType: 'loop', delay: 0.6 }}
                >
                  MOST SELECTED
                </motion.span>
              )}

              <h3 className="text-lg font-extrabold tracking-tight text-white mb-1">{tier.tier}</h3>

              <div className="mb-4 md:mb-6">
                <div className="text-2xl md:text-3xl font-black text-[#ffb700] tracking-tight">{tier.price}</div>
                {tier.tagline && (
                  <p className="text-[#ADB7BE] text-xs mt-1.5 leading-snug font-medium">{tier.tagline}</p>
                )}
              </div>

              <ul className="mb-6 md:mb-8 space-y-3 md:space-y-4 flex-grow">
                {tier.deliverables.map((deliverable, j) => (
                  <li key={j} className="flex items-start text-sm text-white/90 gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#ffb700]/10 border border-[#ffb700]/50 flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#ffb700] text-xs" />
                    </span>
                    <span className="font-medium">{deliverable}</span>
                  </li>
                ))}
              </ul>

              {tier.outcome && (
                <div className="mt-4 pt-4 border-t border-[#ffb700]/15 mb-6 text-left">
                  <span className="text-[#ffb700] text-[10px] font-black uppercase tracking-widest block mb-1">Outcome:</span>
                  <p className="text-[#ADB7BE] text-xs leading-relaxed font-semibold">{tier.outcome}</p>
                </div>
              )}

              <div className="mt-auto">
                <CTAButton
                  href="#contact"
                  useBookingWidget={true}
                  className="w-full text-center"
                  eventLabel={`pricing_${tier.tier.toLowerCase().replace(/ /g, '_')}_cta`}
                  caption={tier.caption}
                >
                  {tier.cta}
                </CTAButton>
                {tier.footnote && (
                  <p className="text-[#ADB7BE]/70 text-xs text-center mt-3 leading-snug font-medium">{tier.footnote}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-[#ADB7BE] text-sm max-w-3xl mx-auto mt-12 leading-relaxed font-semibold">
          Exact scope and cost depend on the organisation. A fixed proposal follows within 24 hours of the consultation.
        </p>

      </div>
    </section>
  );
};

export default PricingSection;
