'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const allCards = [
  {
    type: "case-study",
    id: 1,
    company: "Upgrade Roofing Solutions",
    title: "AI Enquiry Handling & Local Search",
    image: "/images/case-studies/upgraderoofs.jpg",
    description: "Automated AI agent captures, qualifies, and schedules roofing leads 24/7, combined with targeted local search visibility.",
    metrics: [
      { value: "538%", label: "Google Business Profile interactions growth in 90 days" },
      { value: "30+", label: "Qualified leads booked in the first two weeks" },
    ],
  },
  {
    type: "case-study",
    id: 2,
    company: "City Plaza Abu Dhabi",
    title: "AI Search (AEO/GEO) & Global Visibility",
    image: "/images/case-studies/uaeprivateinvestor.jpg",
    description: "Generative Engine Optimisation ensuring luxury hotel & commercial property rankings across ChatGPT, Gemini, and Perplexity.",
    metrics: [
      { value: "5X", label: "Qualified leads within 60 days" },
      { value: "~20", label: "Qualified enquiries per day at peak" },
    ],
  },
  {
    type: "portfolio",
    name: "MyApproved",
    title: "Marketplace Platform & Core Web Vitals",
    description: "Full stack development, technical restructuring, and automated XML sitemap feeds for a UK property approval marketplace.",
    metrics: [
      { value: "312%", label: "Organic traffic growth in 6 months" },
      { value: "0.9s", label: "Core Web Vitals load time, down from 4.2s" },
    ],
  },
  {
    type: "portfolio",
    name: "InBoker",
    title: "Comparison Platform Build & Lead Routing",
    description: "Custom full-stack UK broker comparison web application, integrated with automated email routing and lead status tracking.",
    metrics: [
      { value: "Page 1", label: "Target terms ranked in 90 days" },
      { value: "2.8×", label: "Contact form conversion improvement" },
    ],
  },
  {
    type: "portfolio",
    name: "Upgrade Roofing Solutions",
    title: "AI Receptionist & CRM Integration",
    description: "Continuous AI enquiry response system capturing missed voicemail leads and writing them directly to active client CRM pipelines.",
    metrics: [
      { value: "538%", label: "GBP interactions growth in 90 days" },
      { value: "30+", label: "Booked calls in two weeks" },
    ],
  },
  {
    type: "portfolio",
    name: "Leverage Journal",
    title: "Content Automation & Headless CMS Build",
    description: "Headless CMS website integrated with programmatic content generation tools, indexing thousands of search topics automatically.",
    metrics: [
      { value: "220%", label: "Increase in organic traffic sessions" },
      { value: "48", label: "Core authority topics ranking Page 1" },
    ],
  },
  {
    type: "portfolio",
    name: "SEOinforce",
    title: "AI Search Audit Engine (SaaS Dev)",
    description: "Development of a custom SaaS auditing application that monitors brand presence across major Generative AI models.",
    metrics: [
      { value: "7", label: "Generative AI engines monitored" },
      { value: "94%", label: "Data verification accuracy" },
    ],
  },
  {
    type: "portfolio",
    name: "Leverage Academy",
    title: "LMS Build & Student Onboarding Automation",
    description: "Custom Learning Management System with automated onboarding workflows, email triggers, and certificate generation.",
    metrics: [
      { value: "3×", label: "Organic enrolment growth in 60 days" },
      { value: "9", label: "Target course keywords ranking Page 1" },
    ],
  },
  {
    type: "portfolio",
    name: "Alkhemmy Naturals",
    title: "E-commerce Platform Build & Email Marketing",
    description: "Custom headless e-commerce store with automated email abandoned-cart recovery, upsells, and lifecycle marketing flows.",
    metrics: [
      { value: "178%", label: "Increase in organic revenue" },
      { value: "42", label: "Product pages ranking Page 1" },
    ],
  },
  {
    type: "portfolio",
    name: "Flip Republic",
    title: "Portal Build & Real-Time Property Scraper",
    description: "Custom portal with a background Node.js scraper that aggregates property deals, indexing them for community organic reach.",
    metrics: [
      { value: "8", label: "City-level keywords ranking Page 1" },
      { value: "3.1×", label: "Active lead volume increase post-launch" },
    ],
  },
  {
    type: "portfolio",
    name: "Leverage",
    title: "Custom Web App & UX Design",
    description: "High-fidelity, performance-engineered corporate web system. Fully custom layouts and sub-second rendering.",
    metrics: [
      { value: "Sub 1s", label: "Mobile rendering and load time" },
      { value: "98", label: "Lighthouse core performance score" },
    ],
  },
  {
    type: "portfolio",
    name: "OmniWTMS",
    title: "Logistics SaaS App & API Automation",
    description: "B2B SaaS platform optimization. Built automated calendar scheduling, enquiry qualification, and CRM routing pipelines.",
    metrics: [
      { value: "11", label: "B2B SaaS keywords ranking Page 1" },
      { value: "260%", label: "Increase in demo requests from organic" },
    ],
  },
  {
    type: "portfolio",
    name: "UAE Private Investor",
    title: "Investor Portal Build & Lead Funnels",
    description: "Private investment hub featuring a secure enquiry qualification portal with automated email notifications for directors.",
    metrics: [
      { value: "~20", label: "Qualified leads per day at peak" },
      { value: "6.4×", label: "Increase in inbound leads within 6 months" },
    ],
  },
  {
    type: "portfolio",
    name: "Identi Marketing",
    title: "Next.js Site & Lead Capture Funnels",
    description: "Performance site build with integrated lead qualification forms, capturing and qualifying agency prospects.",
    metrics: [
      { value: "Page 1", label: "Target terms ranked in 3 months" },
      { value: "2.4×", label: "Form conversion rate improvement" },
    ],
  },
  {
    type: "portfolio",
    name: "Ads Starter",
    title: "Google Ads API & Custom Dashboard Build",
    description: "Built a custom dashboard that utilizes the Google Ads API to track lead conversion rates and optimize ad spends automatically.",
    metrics: [
      { value: "34%", label: "Improvement in trial sign-up rate" },
      { value: "1.2s", label: "Dashboard loading speed on mobile" },
    ],
  },
  {
    type: "portfolio",
    name: "Nelly Logistics",
    title: "Courier Logistics Portal & API Integration",
    description: "Operational courier tracking portal integrated with local search visibility and automated notification emails on order dispatch.",
    metrics: [
      { value: "6", label: "Local courier keywords ranking Page 1" },
      { value: "189%", label: "Growth in quote requests from organic" },
    ],
  },
  {
    type: "portfolio",
    name: "MCB Media",
    title: "Media Portfolio Build & Lead Automation",
    description: "Interactive video-heavy showcase platform with automated inquiry categorization and CRM lead assignment.",
    metrics: [
      { value: "247%", label: "Organic sessions growth in 5 months" },
      { value: "1.8×", label: "Client booking volume increase" },
    ],
  },
  {
    type: "portfolio",
    name: "Queens Beauty Clinic",
    title: "AI Booking Agent & Local Search",
    description: "Automated AI appointment scheduling assistant integrated with local Google Business Profile to capture direct booking intents.",
    metrics: [
      { value: "412%", label: "Google Business Profile views increase" },
      { value: "12", label: "Local service keywords ranking Page 1" },
    ],
  },
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
        <p className="text-[#ffb700] text-xs font-semibold uppercase tracking-wide mb-1">{card.name}</p>
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
          <p className="text-[#ADB7BE] text-sm md:text-base max-w-2xl leading-relaxed">
            Real organisations. Documented results. AI, systems, and visibility, ranked by outcome.
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
        <p className="text-center text-[#ADB7BE] text-xs mt-2 font-semibold">
          {current + 1}–{Math.min(current + perPage, total)} of {total}
        </p>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <CTAButton
            eventLabel="projects_contact_cta"
            caption="Want numbers like these? 30 minutes, no obligation."
          >
            Book a Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
