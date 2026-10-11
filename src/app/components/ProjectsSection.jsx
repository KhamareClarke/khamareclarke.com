'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUpNumber from "./CountUpNumber";
import CTAButton from "./CTAButton";

const allCards = [
  {
    id: 1,
    company: "Upgrade Roofing Solutions",
    title: "Conversational AI Agent & CRM Automation",
    tag: "Voice & Web AI",
    timeframe: "90-Day Build",
    description: "Designed, built and deployed an autonomous voice receptionist integrated with GHL CRM and local search pack configuration to capture missed inbound contractor leads.",
    metrics: [
      { value: "538%", label: "Google Business Profile interactions growth in 90 days" },
      { value: "30+", label: "Qualified leads booked in the first two weeks" },
    ],
  },
  {
    id: 2,
    company: "City Plaza Abu Dhabi",
    title: "AEO/GEO & Generative Search Positioning",
    tag: "AI Engine Optimization",
    timeframe: "60-Day Run",
    description: "Semantic indexing, schema structures and context optimization ensuring luxury real estate and commercial property rankings across ChatGPT, Gemini, and Perplexity.",
    metrics: [
      { value: "5X", label: "Qualified leads within 60 days" },
      { value: "~20", label: "Qualified enquiries per day at peak" },
    ],
  },
  {
    id: 3,
    company: "MyApproved (Own Platform)",
    title: "Core Web Vitals & Search Architecture",
    tag: "Marketplace Infrastructure",
    timeframe: "6-Month Launch",
    description: "Technical restructuring of high-performance custom marketplace platform, implementing headless programmatic routing, clean XML feeds and assets rendering under 0.9 seconds.",
    metrics: [
      { value: "312%", label: "Organic traffic growth in 6 months" },
      { value: "0.9s", label: "Core Web Vitals load time down from 4.2s" },
    ],
  },
  {
    id: 4,
    company: "Omni WTMS",
    title: "AI Task Orchestration & Data Parsing",
    tag: "Enterprise Automation",
    timeframe: "30-Day Setup",
    description: "Built a centralized worker mode pipeline and custom agent supervisor to parse high-volume logistical files and automate enterprise resource dispatch.",
    metrics: [
      { value: "67%", label: "Reduction in document processing time in 30 days" },
      { value: "12k+", label: "Tasks automated monthly in 90 days" },
    ],
  },
  {
    id: 5,
    company: "IdentI Marketing",
    title: "Content Scaling & Social Outreach API",
    tag: "Programmatic SEO",
    timeframe: "90-Day Integration",
    description: "Configured and deployed a headless CMS integration that automatically generates localized landing pages and schedules content postings via API.",
    metrics: [
      { value: "245%", label: "Increase in localized content output in 45 days" },
      { value: "3.5X", label: "Qualified leads generated in 90 days" },
    ],
  },
  {
    id: 6,
    company: "SEO Inforce",
    title: "Advanced Schema Markup & Technical Audit",
    tag: "Semantic Search",
    timeframe: "60-Day Run",
    description: "Programmed semantic search patterns and automated structural auditing scripts to fix crawling errors and schema anomalies in real-time.",
    metrics: [
      { value: "180%", label: "Organic keyword growth in 60 days" },
      { value: "40%", label: "Bounce rate decrease in 90 days" },
    ],
  },
  {
    id: 7,
    company: "Flip Republic",
    title: "Automated Lead Scraper & Cold Outreach",
    tag: "Lead Extraction",
    timeframe: "60-Day Build",
    description: "Engineered and integrated custom web-scraping agents with AI-drafted messaging pipelines and CRM synchronization protocols.",
    metrics: [
      { value: "150+", label: "High-intent seller leads weekly in 30 days" },
      { value: "4.2X", label: "Outreach response rate in 60 days" },
    ],
  },
  {
    id: 8,
    company: "Ads Starter",
    title: "Programmatic Google Ads API Scaling",
    tag: "Paid Advertising",
    timeframe: "30-Day Integration",
    description: "Constructed an automated campaign creator that connects directly with the Google Ads API to auto-generate and manage thousands of hyper-targeted ad variations.",
    metrics: [
      { value: "42%", label: "Decrease in cost-per-lead in 30 days" },
      { value: "1.5k+", label: "Programmatic ad creatives generated in 14 days" },
    ],
  },
  {
    id: 9,
    company: "Leverage Journal",
    title: "Headless Core Web Vitals Optimization",
    tag: "Performance Optimization",
    timeframe: "90-Day Setup",
    description: "Refactored front-end bundling, asset loading paths and component structure to achieve near-perfect Lighthouse performance rankings.",
    metrics: [
      { value: "98/100", label: "Lighthouse performance score in 14 days" },
      { value: "120%", label: "Page views increase in 90 days" },
    ],
  },
  {
    id: 10,
    company: "Alkhemmy",
    title: "Brand Voice Check & Compliance Copilot",
    tag: "AI Alignment",
    timeframe: "60-Day Integration",
    description: "Developed a local LLM supervisor checking multi-channel copy against corporate brand voice and regulatory guidelines before publication.",
    metrics: [
      { value: "100%", label: "Brand compliance rate across channels in 30 days" },
      { value: "85%", label: "Reduction in copy review time in 60 days" },
    ],
  },
  {
    id: 11,
    company: "Leverage Academy",
    title: "LMS Student Onboarding Flow & CRO",
    tag: "Conversion Optimization",
    timeframe: "90-Day Build",
    description: "Designed and built interactive, AI-driven student onboarding screens to reduce user drop-offs and track individual learning progression.",
    metrics: [
      { value: "48%", label: "Student onboarding completion rise in 60 days" },
      { value: "92%", label: "Student course satisfaction rate in 90 days" },
    ],
  },
  {
    id: 12,
    company: "Inboker",
    title: "LinkedIn Outreach & CRM Sync Pipeline",
    tag: "B2B Outbound",
    timeframe: "60-Day Launch",
    description: "Configured automated LinkedIn messaging workflows and clean contact syncing to automatically qualify and push high-value leads to B2B teams.",
    metrics: [
      { value: "320+", label: "Sales-ready prospects acquired in 30 days" },
      { value: "5.5X", label: "LinkedIn acceptance rate in 60 days" },
    ],
  },
  {
    id: 13,
    company: "Staffordshire Trade Association",
    title: "Multimodal Lead Qualifying & Routing",
    tag: "AI Receptionist",
    timeframe: "60-Day Run",
    description: "Deployed conversational AI agents responding instantly across SMS and web chat, qualifying trade contractor opportunities and dispatching to CRM.",
    metrics: [
      { value: "100%", label: "Of incoming trade leads qualified in 30 days" },
      { value: "£14k", label: "Additional revenue sourced in 60 days" },
    ],
  },
  {
    id: 14,
    company: "Apex Legal Staffordshire",
    title: "AI Document Ingestion & Regulatory Audit",
    tag: "Document Cognition",
    timeframe: "120-Day Build",
    description: "Programmed a secure parsing pipeline to extract legal metadata and cross-verify clauses against national compliance standards.",
    metrics: [
      { value: "94%", label: "Faster case document sorting in 30 days" },
      { value: "Zero", label: "Compliance audit errors in 120 days" },
    ],
  },
  {
    id: 15,
    company: "Stoke Logistics Group",
    title: "AI Dispatching & Logistics Optimization",
    tag: "Operational Cognition",
    timeframe: "90-Day Build",
    description: "Coded a predictive dispatch supervisor that dynamically adjusts transit routes and scheduling based on live traffic API feedback.",
    metrics: [
      { value: "18%", label: "Reduction in fuel consumption in 45 days" },
      { value: "99.4%", label: "On-time dispatch rate in 90 days" },
    ],
  },
  {
    id: 16,
    company: "Midlands Dental Practice",
    title: "AI Patient Reactivation & Automated Booking",
    tag: "Patient Engagement",
    timeframe: "30-Day Setup",
    description: "Configured automated text reactivation campaigns synced to booking portals to schedule dentist appointments 24/7.",
    metrics: [
      { value: "89", label: "Missed appointments recovered in 30 days" },
      { value: "24/7", label: "Autonomous patient booking in 14 days" },
    ],
  },
  {
    id: 17,
    company: "Lancaster Industrial Supplies",
    title: "B2B Catalog Programmatic SEO & Quote AI",
    tag: "SKU Search Engines",
    timeframe: "90-Day Build",
    description: "Programmed programmatic rendering logic for 15,000 product SKUs coupled with instant, AI-generated wholesale pricing quotes.",
    metrics: [
      { value: "290%", label: "Increase in catalog search traffic in 90 days" },
      { value: "60+", label: "Wholesale quotes generated weekly in 60 days" },
    ],
  },
  {
    id: 18,
    company: "Prestige Motors Birmingham",
    title: "API-Driven Programmatic Advertising",
    tag: "Predictive Marketing",
    timeframe: "60-Day Integration",
    description: "Built a direct link between real-time vehicle inventory APIs and dynamic search/display ad platforms using machine learning predictive segmentation.",
    metrics: [
      { value: "4.8X", label: "Return on ad spend (ROAS) in 30 days" },
      { value: "45+", label: "Premium test drives scheduled in 60 days" },
    ],
  },
];

function CaseStudyCard({ card, isActive }) {
  const hasImage = card.id <= 6;
  return (
    <div className="bg-surface-muted border border-white/10 rounded-lg overflow-hidden flex flex-col md:flex-row">
      {/* Image / placeholder */}
      <div className="relative w-full md:w-2/5 shrink-0 aspect-square md:aspect-auto md:min-h-[20rem] bg-surface border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
        {hasImage ? (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: `url(/images/projects/${card.id}.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-surface-muted flex items-center justify-center">
            <span className="text-6xl opacity-30 text-white font-bold">
              {card.company.charAt(0)}
            </span>
          </div>
        )}
        <span className="absolute top-4 left-4 bg-primary text-[#111015] text-[13px] font-bold px-3 py-1 rounded-full z-10">
          {card.tag}
        </span>
      </div>

      {/* Copy */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="gold-text text-sm font-bold flex-shrink-0 w-7">{String(card.id).padStart(2, '0')}</span>
          <span className="text-[#ADB7BE] text-[13px] font-semibold uppercase tracking-widest">{card.company}</span>
        </div>

        <h3 className="text-lg font-extrabold text-white mb-1 leading-snug">{card.title}</h3>
        <p className="text-[#ADB7BE] text-[13px] font-semibold mb-3">{card.tag} · {card.timeframe}</p>
        <p className="text-[#ADB7BE] text-base mb-6 leading-relaxed">{card.description}</p>

        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {card.metrics.map((m, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-4">
              <div className="gold-text font-black text-2xl md:text-3xl">
                <CountUpNumber value={m.value} />
              </div>
              <div className="text-[#ADB7BE] text-sm leading-snug mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ProjectsSection = () => {
  const total = allCards.length;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const goTo = (idx) => {
    const next = (idx + total) % total;
    setDir(next === current ? dir : (idx > current ? 1 : -1));
    setCurrent(next);
  };

  return (
    <section id="case-studies" className="text-white py-16 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
            Documented <span className="gold-text">results</span>
          </h2>
          <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
            Systems I built for roofing, legal, logistics, dental, automotive and real estate firms. Every number below is what each one did, and I can take you through any of them.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          <button
            aria-label="Previous case study"
            onClick={() => goTo(current - 1)}
            className="absolute left-0 z-10 bg-surface-muted border border-white/10 hover:border-[#ffb700] text-[#ffb700] rounded-lg w-10 h-10 flex items-center justify-center transition-colors md:-left-12"
          >
            &#8592;
          </button>

          {/* Direction-aware slide between case studies. The outgoing card leaves the
              way the incoming one arrives, so the motion says which way you moved.
              overflow-hidden on the frame stops the sliding card widening the page. */}
          <div className="w-full max-w-4xl overflow-hidden reveal">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ x: dir > 0 ? 56 : -56, opacity: 0.35 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir > 0 ? -56 : 56, opacity: 0.35 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <CaseStudyCard card={allCards[current]} isActive />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            aria-label="Next case study"
            onClick={() => goTo(current + 1)}
            className="absolute right-0 z-10 bg-surface-muted border border-white/10 hover:border-[#ffb700] text-[#ffb700] rounded-lg w-10 h-10 flex items-center justify-center transition-colors md:-right-12"
          >
            &#8594;
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {allCards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => goTo(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-[#ffb700] ${idx === current ? 'bg-[#ffb700]' : 'bg-transparent'}`}
              aria-label={`Go to case study ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="reveal mt-10 text-center" style={{ "--rv-delay": "420ms" }}>
          <CTAButton
            href="/#contact"
            eventLabel="projects_contact_cta"
            caption="Access the results."
          >
            Book a Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
