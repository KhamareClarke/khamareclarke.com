'use client';

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const TIERS = [
  {
    tier: "GET FOUND",
    price: "from £495/mo",
    tagline: "The full system. Nothing to manage.",
    mostPopular: false,
    cta: "Get Found",
    deliverables: [
      "Ranked on Google, ChatGPT, Gemini, and Perplexity — all four channels, handled",
      "Google Business Profile managed: calls coming in, not just views",
      "AI agent captures every enquiry 24/7 — no lead falls through while you're on a job",
      "Every follow-up sent automatically until they book or say no",
      "Plain-English monthly report: what ranked, what moved, what's next",
      "Proven: 538% GBP growth and 30+ booked calls in two weeks",
    ],
    caption: "Rolling monthly from day one · ranked or refunded",
    footnote: "Most clients start here. The system scales as your results do.",
  },
  {
    tier: "RUN THE AREA",
    price: "from £1,250/mo",
    tagline: "The full system, plus your own corner of the internet.",
    mostPopular: true,
    cta: "Run The Area",
    deliverables: [
      "Everything in Get Found at 2× the hours",
      "Custom website built to rank and convert — yours permanently",
      "Programmatic SEO: every service × every area you cover, indexed and ranking",
      "Email campaigns that wake up cold enquiries and turn them into booked work",
      "Proven: 5× leads for a commercial property client in 60 days",
    ],
    caption: "6-month build term, then rolling monthly · the site is yours",
  },
  {
    tier: "OWN THE MARKET",
    price: "from £2,500/mo",
    tagline: "Total AI infrastructure. Market position locked.",
    mostPopular: false,
    cta: "Own The Market",
    deliverables: [
      "Everything above at 4× the hours, running in parallel",
      "Google Ads via the Ads API — engineered for lower cost per lead, not agency guesswork",
      "Custom AI apps built to your workflow: quoting, booking, lead routing",
      "Quarterly strategy session: what's dominating, what's next",
      "No package ceiling — if it grows your business, it's in scope",
    ],
    caption: "6-month initial term, then rolling monthly · guaranteed lead system",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="text-white py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="text-center mb-10">
          <span className="inline-block border border-[#ffb700] text-[#ffb700] text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase bg-black/30 shadow-sm mb-6">
            PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Transparent Pricing.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
              No Retainer Traps.
            </span>
          </h2>
        </div>

        <div className="text-center mb-10">
          <a
            href="#contact"
            className="text-[#ffb700] hover:text-[#ff8c00] transition-colors duration-200 text-sm font-medium underline underline-offset-2"
          >
            Not ready? Get your free AI Visibility Score first →
          </a>
          <p className="text-[#ADB7BE] text-xs mt-1">Two minutes. Costs nothing.</p>
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
                  MOST POPULAR
                </motion.span>
              )}

              <h3 className="text-lg font-extrabold tracking-tight text-white mb-1">{tier.tier}</h3>

              <div className="mb-4 md:mb-6">
                <div className="text-2xl md:text-3xl font-black text-[#ffb700] tracking-tight">{tier.price}</div>
                {tier.tagline && (
                  <p className="text-[#ADB7BE] text-xs mt-1.5 leading-snug">{tier.tagline}</p>
                )}
              </div>

              <ul className="mb-6 md:mb-8 space-y-3 md:space-y-4 flex-grow">
                {tier.deliverables.map((deliverable, j) => (
                  <li key={j} className="flex items-start text-sm text-white/90 gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#ffb700]/10 border border-[#ffb700]/50 flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#ffb700] text-xs" />
                    </span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <CTAButton
                  href="#contact"
                  className="w-full text-center"
                  eventLabel={`pricing_${tier.tier.toLowerCase().replace(/ /g, '_')}_cta`}
                  caption={tier.caption}
                >
                  {tier.cta}
                </CTAButton>
                {tier.footnote && (
                  <p className="text-[#ADB7BE]/70 text-xs text-center mt-3 leading-snug italic">{tier.footnote}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-[#ADB7BE] text-sm max-w-3xl mx-auto mt-10 leading-relaxed">
          Every package runs on the same AI system. What scales is build capacity: hours, pages, campaigns, apps. Exact price depends on your size and market — fixed quote within 24 hours of your free call.
        </p>

      </div>
    </section>
  );
};

export default PricingSection;
