'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const allCards = [
  {
    type: "case-study",
    id: 1,
    company: "Upgrade Roofing Solutions",
    title: "Conversational AI Agent & CRM Automation",
    tag: "VOICE & WEB AI",
    timeframe: "90-Day Build",
    description: "Designed, built, and deployed an autonomous voice receptionist integrated with GHL CRM and local search pack configuration to capture missed inbound contractor leads.",
    metrics: [
      { value: "538%", label: "Google Business Profile interactions growth in 90 days" },
      { value: "30+", label: "Qualified leads booked in the first two weeks" },
    ],
  },
  {
    type: "case-study",
    id: 2,
    company: "City Plaza Abu Dhabi",
    title: "AEO/GEO & Generative Search Positioning",
    tag: "AI ENGINE OPTIMIZATION",
    timeframe: "60-Day Run",
    description: "Semantic indexing, schema structures, and context optimization ensuring luxury real estate and commercial property rankings across ChatGPT, Gemini, and Perplexity.",
    metrics: [
      { value: "5X", label: "Qualified leads within 60 days" },
      { value: "~20", label: "Qualified enquiries per day at peak" },
    ],
  },
  {
    type: "case-study",
    id: 3,
    company: "MyApproved (Own Platform)",
    title: "Core Web Vitals & Search Architecture",
    tag: "MARKETPLACE INFRASTRUCTURE",
    timeframe: "6-Month Launch",
    description: "Technical restructuring of high-performance custom marketplace platform, implementing headless programmatic routing, clean XML feeds, and assets rendering under 0.9 seconds.",
    metrics: [
      { value: "312%", label: "Organic traffic growth in 6 months" },
      { value: "0.9s", label: "Core Web Vitals load time down from 4.2s" },
    ],
  },
  {
    type: "case-study",
    id: 4,
    company: "Omni WTMS",
    title: "AI Task Orchestration & Data Parsing",
    tag: "ENTERPRISE AUTOMATION",
    timeframe: "30-Day Setup",
    description: "Built a centralized worker mode pipeline and custom agent supervisor to parse high-volume logistical files and automate enterprise resource dispatch.",
    metrics: [
      { value: "67%", label: "Reduction in document processing time in 30 days" },
      { value: "12k+", label: "Tasks automated monthly in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 5,
    company: "IdentI Marketing",
    title: "Content Scaling & Social Outreach API",
    tag: "PROGRAMMATIC SEO",
    timeframe: "90-Day Integration",
    description: "Configured and deployed a headless CMS integration that automatically generates localized landing pages and schedules content postings via API.",
    metrics: [
      { value: "245%", label: "Increase in localized content output in 45 days" },
      { value: "3.5X", label: "Qualified leads generated in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 6,
    company: "SEO Inforce",
    title: "Advanced Schema Markup & Technical Audit",
    tag: "SEMANTIC SEARCH",
    timeframe: "60-Day Run",
    description: "Programmed semantic search patterns and automated structural auditing scripts to fix crawling errors and schema anomalies in real-time.",
    metrics: [
      { value: "180%", label: "Organic keyword growth in 60 days" },
      { value: "40%", label: "Bounce rate decrease in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 7,
    company: "Flip Republic",
    title: "Automated Lead Scraper & Cold Outreach",
    tag: "LEAD EXTRACTION",
    timeframe: "60-Day Build",
    description: "Engineered and integrated custom web-scraping agents with AI-drafted messaging pipelines and CRM synchronization protocols.",
    metrics: [
      { value: "150+", label: "High-intent seller leads weekly in 30 days" },
      { value: "4.2X", label: "Outreach response rate in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 8,
    company: "Ads Starter",
    title: "Programmatic Google Ads API Scaling",
    tag: "PAID ADVERTISING",
    timeframe: "30-Day Integration",
    description: "Constructed an automated campaign creator that connects directly with the Google Ads API to auto-generate and manage thousands of hyper-targeted ad variations.",
    metrics: [
      { value: "42%", label: "Decrease in cost-per-lead in 30 days" },
      { value: "1.5k+", label: "Programmatic ad creatives generated in 14 days" },
    ],
  },
  {
    type: "case-study",
    id: 9,
    company: "Leverage Journal",
    title: "Headless Core Web Vitals Optimization",
    tag: "PERFORMANCE OPTIMIZATION",
    timeframe: "90-Day Setup",
    description: "Refactored front-end bundling, asset loading paths, and component structure to achieve near-perfect Lighthouse performance rankings.",
    metrics: [
      { value: "98/100", label: "Lighthouse performance score in 14 days" },
      { value: "120%", label: "Page views increase in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 10,
    company: "Alkhemmy",
    title: "Brand Voice Check & Compliance Copilot",
    tag: "AI ALIGNMENT",
    timeframe: "60-Day Integration",
    description: "Developed a local LLM supervisor checking multi-channel copy against corporate brand voice and regulatory guidelines before publication.",
    metrics: [
      { value: "100%", label: "Brand compliance rate across channels in 30 days" },
      { value: "85%", label: "Reduction in copy review time in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 11,
    company: "Leverage Academy",
    title: "LMS Student Onboarding Flow & CRO",
    tag: "CONVERSION OPTIMIZATION",
    timeframe: "90-Day Build",
    description: "Designed and built interactive, AI-driven student onboarding screens to reduce user drop-offs and track individual learning progression.",
    metrics: [
      { value: "48%", label: "Student onboarding completion rise in 60 days" },
      { value: "92%", label: "Student course satisfaction rate in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 12,
    company: "Inboker",
    title: "LinkedIn Outreach & CRM Sync Pipeline",
    tag: "B2B OUTBOUND",
    timeframe: "60-Day Launch",
    description: "Configured automated LinkedIn messaging workflows and clean contact syncing to automatically qualify and push high-value leads to B2B teams.",
    metrics: [
      { value: "320+", label: "Sales-ready prospects acquired in 30 days" },
      { value: "5.5X", label: "LinkedIn acceptance rate in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 13,
    company: "Staffordshire Trade Association",
    title: "Multimodal Lead Qualifying & Routing",
    tag: "AI RECEPTIONIST",
    timeframe: "60-Day Run",
    description: "Deployed conversational AI agents responding instantly across SMS and web chat, qualifying trade contractor opportunities and dispatching to CRM.",
    metrics: [
      { value: "100%", label: "Of incoming trade leads qualified in 30 days" },
      { value: "£14k", label: "Additional revenue sourced in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 14,
    company: "Apex Legal Staffordshire",
    title: "AI Document Ingestion & Regulatory Audit",
    tag: "DOCUMENT COGNITION",
    timeframe: "120-Day Build",
    description: "Programmed a secure parsing pipeline to extract legal metadata and cross-verify clauses against national compliance standards.",
    metrics: [
      { value: "94%", label: "Faster case document sorting in 30 days" },
      { value: "Zero", label: "Compliance audit errors in 120 days" },
    ],
  },
  {
    type: "case-study",
    id: 15,
    company: "Stoke Logistics Group",
    title: "AI Dispatching & Logistics Optimization",
    tag: "OPERATIONAL COGNITION",
    timeframe: "90-Day Build",
    description: "Coded a predictive dispatch supervisor that dynamically adjusts transit routes and scheduling based on live traffic API feedback.",
    metrics: [
      { value: "18%", label: "Reduction in fuel consumption in 45 days" },
      { value: "99.4%", label: "On-time dispatch rate in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 16,
    company: "Midlands Dental Practice",
    title: "AI Patient Reactivation & Automated Booking",
    tag: "PATIENT ENGAGEMENT",
    timeframe: "30-Day Setup",
    description: "Configured automated text reactivation campaigns synced to booking portals to schedule dentist appointments 24/7.",
    metrics: [
      { value: "89", label: "Missed appointments recovered in 30 days" },
      { value: "24/7", label: "Autonomous patient booking in 14 days" },
    ],
  },
  {
    type: "case-study",
    id: 17,
    company: "Lancaster Industrial Supplies",
    title: "B2B Catalog Programmatic SEO & Quote AI",
    tag: "SKU SEARCH ENGINES",
    timeframe: "90-Day Build",
    description: "Programmed programmatic rendering logic for 15,000 product SKUs coupled with instant, AI-generated wholesale pricing quotes.",
    metrics: [
      { value: "290%", label: "Increase in catalog search traffic in 90 days" },
      { value: "60+", label: "Wholesale quotes generated weekly in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 18,
    company: "Prestige Motors Birmingham",
    title: "API-Driven Programmatic Advertising",
    tag: "PREDICTIVE MARKETING",
    timeframe: "60-Day Integration",
    description: "Built a direct link between real-time vehicle inventory APIs and dynamic search/display ad platforms using machine learning predictive segmentation.",
    metrics: [
      { value: "4.8X", label: "Return on ad spend (ROAS) in 30 days" },
      { value: "45+", label: "Premium test drives scheduled in 60 days" },
    ],
  },
];

function CaseStudyCard({ card }) {
  return (
    <div className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl border-2 border-[#ffb700]/30 hover:border-[#ffb700]/60 motion-safe:hover:shadow-[0_0_24px_rgba(255,183,0,0.18)] motion-safe:hover:-translate-y-[3px] transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Perfect square empty black placeholder box */}
      <div className="w-full aspect-square bg-black border-b border-[#ffb700]/10 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        {card.image && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ background: `url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        )}
        {!card.image && (
          <span className="text-3xl opacity-[0.04] text-white select-none">◈</span>
        )}
      </div>
      <div className="px-5 pt-5 pb-3 flex-shrink-0 flex items-center justify-between border-b border-[#ffb700]/10 bg-black/40">
        <span className="text-[#ffb700] text-[10px] font-black uppercase tracking-widest bg-[#ffb700]/10 border border-[#ffb700]/25 px-2.5 py-0.5 rounded-full">
          {card.tag || "AI IMPLEMENTATION"}
        </span>
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
          {card.timeframe || "Verified Result"}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[#ffb700]/80 text-[11px] font-extrabold uppercase tracking-widest mb-1.5">{card.company}</p>
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
      {/* Perfect square empty black placeholder box */}
      <div className="w-full aspect-square bg-black border-b border-[#ffb700]/10 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        {card.image && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ background: `url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        )}
        {!card.image && (
          <span className="text-3xl opacity-[0.04] text-white select-none">◈</span>
        )}
      </div>
      <div className="px-5 pt-5 pb-3 flex-shrink-0 flex items-center justify-between border-b border-[#ffb700]/10 bg-black/40">
        <span className="text-[#ffb700] text-[10px] font-black uppercase tracking-widest bg-[#ffb700]/10 border border-[#ffb700]/25 px-2.5 py-0.5 rounded-full">
          {card.tag || "AI IMPLEMENTATION"}
        </span>
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
          {card.timeframe || "Verified Result"}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[#ffb700]/80 text-[11px] font-extrabold uppercase tracking-widest mb-1.5">{card.name}</p>
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
        {maxIndex > 0 && (
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
        )}

        {/* Progress label */}
        <p className="text-center text-[#ADB7BE] text-xs mt-2 font-semibold">
          {perPage >= total ? `1–${total} of ${total}` : `${current + 1}–${Math.min(current + perPage, total)} of ${total}`}
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
