"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";
import CTAButton from "./CTAButton";

const ENGAGEMENT_STEPS = [
  {
    title: "Software Engineering",
    description: "Websites, web apps, portals, and platforms, engineered to rank, convert, and scale."
  },
  {
    title: "Search & Visibility",
    description: "SEO, AEO, and GEO, with programmatic SEO built to dominate search on Google and AI search engines."
  },
  {
    title: "Lead Capture & Enquiry",
    description: "Every call, form, and message captured, qualified, and booked into your CRM and calendar automatically."
  },
  {
    title: "Automation & Systems",
    description: "Trained to remove and relieve you and your team from overwhelming repetitive work, so time is dedicated to the work that actually matters."
  },
  {
    title: "AI Analytical Audit",
    description: "Organising your unused streams of data into a structured data lake, finding the leaks, and turning outcomes into predictive cycles instead of random ones."
  },
  {
    title: "Cybersecurity & Compliance",
    description: "Built GDPR compliant, secured against credential leaks and vulnerabilities, to Cyber Essentials Plus standard, independently assessed."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-surface text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ===== Method / How the Work Is Delivered ===== */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <Badge variant="outline" className="mb-6">Capability</Badge>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
              Khamare <span className="gold-text">Clarke</span>
            </h2>

            <p className="text-[#ADB7BE] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              12 year working history in software engineering, artificial intelligence, and machine learning, working as an AI Solution Architect and Google Cloud Engineer, and training three of the most popular large language models. I now apply that same engineering to SMEs, using practical AI as a productive tool, not a novelty toy like vibe coders do nowadays. A structured audit exposes exactly where a business is leaking, quickly, and the fix follows fast, not the months manual implementation used to take.
            </p>
          </div>

          <motion.div
            className="mx-auto mb-12 max-w-md"
            initial={{ opacity: 0.85, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-surface-muted border border-white/10 rounded-lg p-2">
              <Image
                src="/images/about-image.png"
                width={400}
                height={400}
                alt="Khamare Clarke, AI Implementation Specialist"
                className="rounded-lg w-full h-auto aspect-square object-cover"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ENGAGEMENT_STEPS.map((step, index) => (
              <motion.div
                key={index}
                className="border border-white/10 rounded-lg p-3.5"
                initial={{ opacity: 0.85, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="gold-text font-bold text-xl leading-none tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />
                </div>
                <h4 className="text-white font-bold text-sm md:text-base mb-1.5">{step.title}</h4>
                <p className="text-[#ADB7BE] text-xs md:text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <CTAButton
              href="/#contact"
              eventLabel="capability_cta"
              caption="An honest look at where AI fits."
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
