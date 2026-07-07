'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const allCards = [
  {
    type: "case-study",
    id: 1,
    company: "Upgrade Roofing Solutions",
    title: "Local SEO for Roofing Contractor",
    image: "/images/case-studies/upgraderoofs.jpg",
    description: "Local SEO and Google Business Profile optimisation for a UK roofing contractor. Results achieved within the first 90 days of the campaign.",
    metrics: [
      { value: "538%", label: "Google Business Profile interactions growth in 90 days" },
      { value: "30+", label: "Qualified calls in the first two weeks" },
    ],
  },
  {
    type: "case-study",
    id: 2,
    company: "City Plaza Abu Dhabi",
    title: "Hotel & Commercial Property, Abu Dhabi",
    image: "/images/case-studies/uaeprivateinvestor.jpg",
    description: "Local SEO, Google Business Profile management and AI search optimisation. Scaled to ~20 qualified enquiries per day over six months.",
    metrics: [
      { value: "5X", label: "Leads in 60 days" },
      { value: "~20", label: "Qualified enquiries per day at peak" },
    ],
  },
  { type: "portfolio", name: "MyApproved", work: "Technical SEO and marketplace architecture" },
  { type: "portfolio", name: "InBoker", work: "Platform build and technical SEO" },
  { type: "portfolio", name: "Upgrade Roofing Solutions", work: "Local SEO and Google Business Profile (full case study above)" },
  { type: "portfolio", name: "Leverage Journal", work: "Content architecture and organic search" },
  { type: "portfolio", name: "SEOinforce", work: "AI visibility audit tooling" },
  { type: "portfolio", name: "Leverage Academy", work: "Course platform build and SEO" },
  { type: "portfolio", name: "Alkhemmy Naturals", work: "E-commerce SEO and brand build" },
  { type: "portfolio", name: "Flip Republic", work: "Platform build and technical SEO" },
  { type: "portfolio", name: "Leverage", work: "Brand system and site build" },
  { type: "portfolio", name: "OmniWTMS", work: "Platform SEO for logistics SaaS" },
  { type: "portfolio", name: "UAE Private Investor", work: "Lead generation site and SEO" },
  { type: "portfolio", name: "Identi Marketing", work: "Site build and search optimisation" },
  { type: "portfolio", name: "Ads Starter", work: "Platform build and conversion copy" },
  { type: "portfolio", name: "Nelly Logistics", work: "Local SEO and site performance" },
  { type: "portfolio", name: "MCB Media", work: "SEO and site performance" },
  { type: "portfolio", name: "Queens Beauty Clinic", work: "Local SEO and Google Business Profile" },
];

function CaseStudyCard({ card }) {
  return (
    <div className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl border-2 border-[#ffb700]/30 hover:border-[#ffb700]/60 motion-safe:hover:shadow-[0_0_24px_rgba(255,183,0,0.18)] motion-safe:hover:-translate-y-[3px] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div
        className="h-44 w-full flex-shrink-0"
        style={{ background: `url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[#ffb700] text-xs font-semibold uppercase tracking-wide mb-1">{card.company}</p>
        <h3 className="text-base md:text-lg font-extrabold text-white mb-2 leading-snug">{card.title}</h3>
        <p className="text-[#ADB7BE] text-xs mb-4 leading-relaxed flex-1">{card.description}</p>
        <div className="space-y-1.5 border-t border-[#ffb700]/15 pt-3">
          {card.metrics.map((m, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="text-[#ffb700] font-black text-base whitespace-nowrap">{m.value}</span>
              <span className="text-[#ADB7BE] text-xs leading-tight">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ card }) {
  return (
    <div className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl border-2 border-[#ffb700]/30 hover:border-[#ffb700]/60 motion-safe:hover:shadow-[0_0_24px_rgba(255,183,0,0.18)] motion-safe:hover:-translate-y-[3px] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="h-44 w-full flex-shrink-0 bg-gradient-to-br from-[#1c1c1c] via-[#111015] to-[#0a0a0a] flex items-center justify-center border-b border-[#ffb700]/10">
        <span className="text-5xl opacity-[0.07] select-none">◈</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[#ffb700] text-xs font-semibold uppercase tracking-wide mb-1">Portfolio</p>
        <h3 className="text-base md:text-lg font-extrabold text-white mb-2 leading-snug">{card.name}</h3>
        <p className="text-[#ADB7BE] text-xs leading-relaxed flex-1">{card.work}</p>
      </div>
    </div>
  );
}

const ProjectsSection = () => {
  const [current, setCurrent] = useState(0);
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setPerPage(3);
      else if (window.innerWidth >= 640) setPerPage(2);
      else setPerPage(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = allCards.length;
  const maxIndex = Math.max(0, total - perPage);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const visible = allCards.slice(current, current + perPage);

  return (
    <section id="case-studies" className="text-white py-16 lg:py-20 relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 mt-4 w-full text-center">
          <span className="bg-transparent border border-[#ffb700] text-[#ffb700] text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase">
            RESULTS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            <span className="text-[#ffb700]">Documented Results.</span>
          </h2>
          <p className="text-[#ADB7BE] text-sm md:text-base max-w-2xl">
            Real businesses. Documented results. SEO and AI search, ranked by outcome.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-10 md:px-14">
          {/* Cards */}
          <motion.div
            key={current}
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${Math.min(perPage, visible.length)}, minmax(0, 1fr))` }}
            initial={{ opacity: 0.85, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            {visible.map((card, i) =>
              card.type === "case-study" ? (
                <CaseStudyCard key={card.id} card={card} />
              ) : (
                <PortfolioCard key={card.name + i} card={card} />
              )
            )}
          </motion.div>

          {/* Prev arrow */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border-2 border-[#ffb700]/30 hover:border-[#ffb700] text-[#ffb700] p-2.5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            disabled={current >= maxIndex}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border-2 border-[#ffb700]/30 hover:border-[#ffb700] text-[#ffb700] p-2.5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === current ? "bg-[#ffb700] w-5 h-2" : "bg-[#ffb700]/30 w-2 h-2"
              }`}
            />
          ))}
        </div>

        {/* Progress label */}
        <p className="text-center text-[#ADB7BE] text-xs mt-2">
          {current + 1}–{Math.min(current + perPage, total)} of {total}
        </p>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <CTAButton
            eventLabel="projects_contact_cta"
            caption="Want numbers like these? 30 minutes, no obligation."
          >
            Book Free Call
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
