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
    type: "case-study",
    id: 3,
    company: "MyApproved (Own Platform)",
    title: "Marketplace Platform & Core Web Vitals",
    image: "/images/testimonials/myapproved.png",
    description: "Technical restructuring of high-performance custom marketplace platform, implementing automated XML sitemaps and Core Web Vitals optimization.",
    metrics: [
      { value: "312%", label: "Organic traffic growth in 6 months" },
      { value: "0.9s", label: "Core Web Vitals load time down from 4.2s" },
    ],
  },
  {
    type: "case-study",
    id: 4,
    company: "Omni WTMS",
    title: "Enterprise Workflow & AI Task Automation",
    image: "/images/testimonials/omni.png",
    description: "Custom AI orchestration system automating high-volume document workflows, data verification, and team scheduling.",
    metrics: [
      { value: "67%", label: "Reduction in document processing time in 30 days" },
      { value: "12k+", label: "Tasks automated monthly in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 5,
    company: "IdentI Marketing",
    title: "Programmatic Content Engine & Lead Gen",
    image: "/images/testimonials/identi.png",
    description: "Large-scale programmatic SEO landing page system and automated social media post creation driving search authority.",
    metrics: [
      { value: "245%", label: "Increase in localized content output in 45 days" },
      { value: "3.5X", label: "Qualified leads generated in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 6,
    company: "SEO Inforce",
    title: "Multi-Channel Technical SEO & Schema",
    image: "/images/projects/2.png",
    description: "Implementation of advanced schema markup, automated site audit correction workers, and semantic search architecture.",
    metrics: [
      { value: "180%", label: "Organic keyword growth in 60 days" },
      { value: "40%", label: "Bounce rate decrease in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 7,
    company: "Flip Republic",
    title: "Property Sourcing Lead Extraction",
    image: "/images/projects/3.png",
    description: "Automated property lead scraping engine integrated with AI cold email outreach and CRM syncing.",
    metrics: [
      { value: "150+", label: "High-intent seller leads weekly in 30 days" },
      { value: "4.2X", label: "Outreach response rate in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 8,
    company: "Ads Starter",
    title: "Google Ads API & Creative Generator",
    image: "/images/projects/4.png",
    description: "High-frequency programmatic ad creative generator connected directly to Google Ads API for multi-campaign scaling.",
    metrics: [
      { value: "42%", label: "Decrease in cost-per-lead in 30 days" },
      { value: "1.5k+", label: "Programmatic ad creatives generated in 14 days" },
    ],
  },
  {
    type: "case-study",
    id: 9,
    company: "Leverage Journal",
    title: "Automated Technical Auditing & CWV",
    image: "/images/projects/5.png",
    description: "Automated Core Web Vitals optimization pipeline that corrects page performance and asset loading issues on the fly.",
    metrics: [
      { value: "98/100", label: "Lighthouse performance score in 14 days" },
      { value: "120%", label: "Page views increase in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 10,
    company: "Alkhemmy",
    title: "AI Agent Integrations & Brand Check",
    image: "/images/projects/6.png",
    description: "Integrated AI copilot checking all outward-facing marketing content against established brand-voice and regulatory rules.",
    metrics: [
      { value: "100%", label: "Brand compliance rate across channels in 30 days" },
      { value: "85%", label: "Reduction in copy review time in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 11,
    company: "Leverage Academy",
    title: "LMS Student Onboarding CRO",
    image: "/images/projects/1.png",
    description: "AI-guided interactive onboarding workflows reducing user drop-off in high-ticket training programmes.",
    metrics: [
      { value: "48%", label: "Student onboarding completion rise in 60 days" },
      { value: "92%", label: "Student course satisfaction rate in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 12,
    company: "Inboker",
    title: "Automated LinkedIn & CRM Outbound",
    image: "/images/projects/2.png",
    description: "Fully automated, hyper-personalized B2B social outreach and CRM sync engine targeting mid-market decision-makers.",
    metrics: [
      { value: "320+", label: "Sales-ready prospects acquired in 30 days" },
      { value: "5.5X", label: "LinkedIn acceptance rate in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 13,
    company: "Staffordshire Trade Association",
    title: "AI Lead Qualifying & CRM Integration",
    image: "/images/blog/TradesChatBot.png.png",
    description: "Automated conversational voice and text AI qualifying and routing contractor opportunities to local suppliers.",
    metrics: [
      { value: "100%", label: "Of incoming trade leads qualified in 30 days" },
      { value: "£14k", label: "Additional revenue sourced in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 14,
    company: "Apex Legal Staffordshire",
    title: "AI Document Ingestion & Compliance",
    image: "/images/blog/automate.png",
    description: "Deep AI parsing system that extracts entity metadata and verifies legal compliance constraints across large document sets.",
    metrics: [
      { value: "94%", label: "Faster case document sorting in 30 days" },
      { value: "Zero", label: "Compliance audit errors in 120 days" },
    ],
  },
  {
    type: "case-study",
    id: 15,
    company: "Stoke Logistics Group",
    title: "AI Route & Dispatch Optimization",
    image: "/images/blog/unlock.png",
    description: "Custom AI supervisor predicting dispatch bottlenecks and optimizing schedules across West Midlands routes.",
    metrics: [
      { value: "18%", label: "Reduction in fuel consumption in 45 days" },
      { value: "99.4%", label: "On-time dispatch rate in 90 days" },
    ],
  },
  {
    type: "case-study",
    id: 16,
    company: "Midlands Dental Practice",
    title: "AI Booking & Patient Reactivation",
    image: "/images/blog/SMEs.png.png",
    description: "SMS/WhatsApp AI receptionist reactivating dormant dental records and booking appointments directly into practice software.",
    metrics: [
      { value: "89", label: "Missed appointments recovered in 30 days" },
      { value: "24/7", label: "Autonomous patient booking in 14 days" },
    ],
  },
  {
    type: "case-study",
    id: 17,
    company: "Lancaster Industrial Supplies",
    title: "B2B Programmatic SEO & Quote Agent",
    image: "/images/projects/4.png",
    description: "Scaled implementation of 15,000 structured SKU landing pages coupled with an AI-driven instant quote responder.",
    metrics: [
      { value: "290%", label: "Increase in catalog search traffic in 90 days" },
      { value: "60+", label: "Wholesale quotes generated weekly in 60 days" },
    ],
  },
  {
    type: "case-study",
    id: 18,
    company: "Prestige Motors Birmingham",
    title: "High-Ticket Lead Gen & Retargeting AI",
    image: "/images/projects/1.png",
    description: "Dynamic programmatic advertising engine synced to real-time inventory API with predictive audience segment matching.",
    metrics: [
      { value: "4.8X", label: "Return on ad spend (ROAS) in 30 days" },
      { value: "45+", label: "Premium test drives scheduled in 60 days" },
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
