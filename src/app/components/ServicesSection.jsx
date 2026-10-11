"use client";

import React from "react";
import Image from "next/image";
import CTAButton from "./CTAButton";

const ENGAGEMENT_STEPS = [
  {
    title: "Software Engineering",
    description: "Websites, web apps, portals and platforms built to rank, convert and scale."
  },
  {
    title: "Search & Visibility",
    description: "Technical and local SEO, AI search optimisation and programmatic SEO built for Google and the AI assistants."
  },
  {
    title: "Lead Capture & Enquiry",
    description: "Every call, form and message captured, qualified and booked into your CRM and calendar."
  },
  {
    title: "Automation & Systems",
    description: "The repetitive admin taken off you and your team, so time goes on the work that matters."
  },
  {
    title: "AI Analytical Audit",
    description: "Your unused data pulled into one place, the leaks found and outcomes turned into cycles you can predict."
  },
  {
    title: "Cybersecurity & Compliance",
    description: "Built GDPR compliant, to the Cyber Essentials Plus control set. Hardened against credential leaks and the common vulnerability classes."
  }
];

/* One card, shared by the two layouts below. */
const CapabilityCard = ({ step, index }) => (
  <div
    className="reveal border border-white/10 rounded-lg p-3.5 h-full"
    style={{ "--rv-delay": `${index * 110}ms` }}
  >
    <div className="flex items-center gap-2.5 mb-2">
      <span className="gold-text font-bold text-xl leading-none tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />
    </div>
    <h4 className="text-white font-bold text-lg mb-1.5">{step.title}</h4>
    <p className="text-[#ADB7BE] text-sm md:text-base leading-relaxed">{step.description}</p>
  </div>
);

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-20 lg:py-24 bg-surface text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ===== Method / How the Work Is Delivered ===== */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
              Khamare <span className="gold-text">Clarke</span>
            </h2>

            <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
              Twelve years in software engineering, artificial intelligence and machine learning. I have worked as an AI Solution Architect and a Google Cloud Engineer, and I train AI models. I now apply that same architecture to SMEs, using practical AI as a productive tool, not a novelty toy like vibe coders do nowadays. A structured audit quickly exposes exactly where a business is leaking, and the fix follows fast, not the months manual implementation used to take.
            </p>
          </div>

          <div className="reveal-img mx-auto mb-12 max-w-md" style={{ "--rv-delay": "120ms" }}>
            <div className="bg-surface-muted border border-white/10 rounded-lg p-2">
              <Image
                src="/images/about-image.png"
                width={400}
                height={400}
                alt="Khamare Clarke, AI Implementation Specialist"
                className="rounded-lg w-full h-auto aspect-square object-cover"
              />
            </div>
          </div>

          {/* The six capabilities as a plain grid at every width. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ENGAGEMENT_STEPS.map((step, index) => (
              <CapabilityCard key={index} step={step} index={index} />
            ))}
          </div>

          <div className="reveal mt-10 text-center" style={{ "--rv-delay": "420ms" }}>
            <CTAButton
              href="/#contact"
              eventLabel="capability_cta"
              caption="An honest look at where AI is needed."
            >
              Book a Consultation
            </CTAButton>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
