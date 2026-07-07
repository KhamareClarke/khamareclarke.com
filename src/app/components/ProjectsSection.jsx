'use client';

import React from "react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const caseStudies = [
  {
    id: 1,
    title: "Local SEO for Roofing Contractor",
    company: "Upgrade Roofing Solutions",
    image: "/images/case-studies/upgraderoofs.jpg",
    metrics: [
      { label: "Google Business Profile interactions growth in 90 days", value: "538%" },
      { label: "Qualified calls in the first two weeks", value: "30+" },
    ],
    description: "Local SEO and Google Business Profile optimisation for a UK roofing contractor. Results achieved within the first 90 days of the campaign.",
  },
  {
    id: 2,
    title: "Hotel & Commercial Property, Abu Dhabi",
    company: "City Plaza Abu Dhabi",
    image: "/images/case-studies/uaeprivateinvestor.jpg",
    metrics: [
      { label: "Leads in 60 days", value: "5X" },
      { label: "Qualified enquiries per day at peak", value: "~20" },
    ],
    description: "Local SEO, Google Business Profile management and AI search optimisation. Scaled to ~20 qualified enquiries per day over six months.",
  },
];

const workedWith = [
  { name: "MyApproved", work: "Technical SEO and marketplace architecture" },
  { name: "InBoker", work: "Platform build and technical SEO" },
  { name: "Upgrade Roofing Solutions", work: "Local SEO and Google Business Profile (full case study above)" },
  { name: "Leverage Journal", work: "Content architecture and organic search" },
  { name: "SEOinforce", work: "AI visibility audit tooling" },
  { name: "Leverage Academy", work: "Course platform build and SEO" },
  { name: "Alkhemmy Naturals", work: "E-commerce SEO and brand build" },
  { name: "Flip Republic", work: "Platform build and technical SEO" },
  { name: "Leverage", work: "Brand system and site build" },
  { name: "OmniWTMS", work: "Platform SEO for logistics SaaS" },
  { name: "UAE Private Investor", work: "Lead generation site and SEO" },
  { name: "Identi Marketing", work: "Site build and search optimisation" },
  { name: "Ads Starter", work: "Platform build and conversion copy" },
  { name: "Nelly Logistics", work: "Local SEO and site performance" },
  { name: "MCB Media", work: "SEO and site performance" },
  { name: "Queens Beauty Clinic", work: "Local SEO and Google Business Profile" },
];

const ProjectsSection = () => {
  return (
    <section id="case-studies" className="text-white py-16 lg:py-20 relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 mt-4 w-full text-center">
          <span className="bg-transparent border border-[#ffb700] text-[#ffb700] text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase">
            RESULTS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center relative mb-4">
            <span className="text-[#ffb700]">Documented Results.</span>
          </h2>
          <p className="text-[#ADB7BE] text-center text-sm md:text-base max-w-2xl">
            Real businesses. Documented results. SEO and AI search, ranked by outcome.
          </p>
        </div>

        {/* Two case study cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {caseStudies.map((study) => (
            <motion.div
              key={study.id}
              className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl shadow-2xl border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: study.id * 0.15 }}
              viewport={{ once: true }}
            >
              <div
                className="h-48 w-full"
                style={{ background: `url(${study.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div className="p-6">
                <p className="text-[#ffb700] text-sm font-medium mb-1">{study.company}</p>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">{study.title}</h3>
                <p className="text-[#ADB7BE] text-sm mb-4 leading-relaxed">{study.description}</p>
                <div className="space-y-2">
                  {study.metrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[#ffb700] font-black text-lg whitespace-nowrap">{m.value}</span>
                      <span className="text-[#ADB7BE] text-sm">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* I've Worked With */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-8">
            I&apos;ve Worked With
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {workedWith.map((entry, i) => (
              <div
                key={i}
                className="bg-[#181818]/90 border border-[#ffb700]/15 hover:border-[#ffb700]/35 rounded-xl p-4 transition-all duration-200"
              >
                <p className="text-[#ffb700] font-semibold text-sm mb-1">{entry.name}</p>
                <p className="text-[#ADB7BE] text-xs leading-relaxed">{entry.work}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <CTAButton
            eventLabel="projects_contact_cta"
            caption="30-minute strategy call. No obligation."
          >
            Book Free Call
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
