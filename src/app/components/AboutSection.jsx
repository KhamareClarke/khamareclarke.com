"use client";

import React from "react";
import Image from "next/image";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const ENGAGEMENT_STEPS = [
  {
    icon: "🔍",
    title: "Assessment",
    description: "Existing operations reviewed. Suitable use cases identified. Where AI does not apply, I say so."
  },
  {
    icon: "⚙️",
    title: "Implementation",
    description: "Systems built, integrated, and configured alongside current teams and processes."
  },
  {
    icon: "👨‍🏫",
    title: "Training",
    description: "Staff trained on the systems they will use daily."
  },
  {
    icon: "📖",
    title: "Documentation",
    description: "Written in plain English, so the organisation is never dependent on any single individual."
  },
  {
    icon: "🛡️",
    title: "Support",
    description: "Ongoing, in line with organisational policy, data protection, and compliance requirements."
  }
];

const AboutSection = () => {
  return (
    <section className="text-white py-10 md:py-14 relative overflow-hidden" id="about">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#ffb700]/6 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-[#ff8c00]/4 blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.span
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-sm font-bold px-6 py-3 rounded-full mb-6 tracking-wider uppercase"
            initial={{ opacity: 0.85, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            METHOD
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            initial={{ opacity: 0.85, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
              How the Work Is Delivered
            </span>
          </motion.h2>

          <p className="text-[#ADB7BE] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Every engagement begins with an operational assessment. I examine how the organisation currently runs, where enquiries and hours are lost, and which processes are already working and should be left alone.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* Left: Image (4/12 col width) */}
          <motion.div
            className="lg:col-span-5 relative order-2 lg:order-1"
            initial={{ opacity: 0.85, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative max-w-sm mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] rounded-2xl p-[2px]">
                <div className="bg-[#0a0a0a] rounded-2xl h-full" />
              </div>

              <div className="relative bg-gradient-to-br from-[#1a1a1a]/90 to-[#0f0f0f]/90 rounded-2xl p-4">
                <Image
                  src="/images/about-image.png"
                  width={400}
                  height={400}
                  alt="Khamare Clarke, AI Implementation Specialist"
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Methodology Steps (7/12 col width) */}
          <motion.div
            className="lg:col-span-7 space-y-4 order-1 lg:order-2"
            initial={{ opacity: 0.85, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#1a1a1a]/60 to-[#0f0f0f]/60 backdrop-blur-sm border border-[#ffb700]/20 rounded-xl p-5 md:p-6 space-y-3">
              <div className="space-y-3">
                {ENGAGEMENT_STEPS.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#0a0a0a]/40 rounded-xl border border-[#ffb700]/10 hover:border-[#ffb700]/30 transition-all duration-300"
                  >
                    <span className="text-xl p-2 bg-[#ffb700]/10 rounded-lg flex-shrink-0">{step.icon}</span>
                    <div>
                      <h4 className="text-white font-extrabold text-base md:text-lg mb-1">{step.title}</h4>
                      <p className="text-[#ADB7BE] text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#ffb700]/10">
                <p className="text-[#ADB7BE] text-sm leading-relaxed italic">
                  Existing marketing teams, developers, and agencies remain in place. The people already trusted with the work gain capability they do not currently have.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Centered CTA */}
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0.85, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <CTAButton
            href="/#contact"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-xl hover:scale-105 transform transition-all duration-300 text-lg shadow-xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
            icon="bolt"
            eventLabel="about_book_consultation"
            caption="30 minutes. An honest assessment of where AI applies to your operation."
          >
            <span className="relative z-10 flex items-center gap-2">
              Book a Consultation
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
