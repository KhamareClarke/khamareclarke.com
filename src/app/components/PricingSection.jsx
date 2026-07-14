'use client';

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const TIERS = [
  {
    tier: "OPERATIONAL AI AUDIT",
    price: "£495",
    tagline: "A structured assessment of where AI applies to your organisation.",
    mostPopular: false,
    cta: "Book a Consultation",
    deliverables: [
      "Technical and visibility audit across Google and AI search",
      "Review of enquiry handling, follow-up, and reporting",
      "Sixty-minute findings call and a prioritised implementation plan",
    ],
    caption: "Delivered within 7 days · clear findings",
    footnote: "Your roadmap to action, with or without me.",
  },
  {
    tier: "IMPLEMENTATION",
    price: "from £1,250/mo",
    tagline: "Search visibility and process automation, implemented and managed.",
    mostPopular: true,
    cta: "Book a Consultation",
    deliverables: [
      "Local and organic search visibility",
      "AI search optimisation across ChatGPT, Gemini, and Perplexity",
      "Content and on-page technical work",
      "Monthly reporting on rankings, enquiries, and cost per lead",
    ],
    caption: "Rolling monthly",
  },
  {
    tier: "FULL IMPLEMENTATION",
    price: "from £2,500/mo",
    tagline: "Visibility, response, and systems, integrated across the organisation.",
    mostPopular: false,
    cta: "Book a Consultation",
    deliverables: [
      "Everything in Implementation included",
      "AI enquiry handling operating continuously 24/7",
      "Performance-engineered web systems",
      "Custom applications where the operation requires it",
      "Quarterly board-level strategy review",
    ],
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
                  <p className="text-[#ADB7BE]/70 text-xs text-center mt-3 leading-snug italic font-medium">{tier.footnote}</p>
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
