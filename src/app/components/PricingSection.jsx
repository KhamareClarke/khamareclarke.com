'use client';

import React from "react";
import OfferCard from "./OfferCard";

/**
 * The homepage offer section.
 *
 * The card itself now lives in components/OfferCard.jsx, shared with /business-bundle —
 * the same arrangement as the enquiry form, so the two pages cannot describe the same
 * offer in two different ways. This component renders it with no props, so every default
 * applies and the homepage's markup is unchanged.
 *
 * The section, its heading and its lede are untouched.
 */
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
        <OfferCard />

      </div>
    </section>
  );
};

export default PricingSection;
