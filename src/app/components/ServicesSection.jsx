"use client";

import React from "react";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const capabilitiesList = [
  {
    icon: "🔍",
    title: "Search and Visibility",
    description: "Presence in Google, and in AI search — ChatGPT, Gemini, Perplexity. Two distinct disciplines. Both required. Measured in enquiries received."
  },
  {
    icon: "💬",
    title: "Enquiry Handling",
    description: "Every enquiry answered, qualified, and scheduled, at any hour. Teams receive briefed leads rather than voicemail."
  },
  {
    icon: "⚙️",
    title: "Process Automation",
    description: "Follow-up, review generation, pipeline management, and internal reporting — configured once, running continuously."
  },
  {
    icon: "📊",
    title: "Analytics and Reporting",
    description: "Where enquiries originate, what they cost, and what converts. One report each month, in language the board can act on."
  },
  {
    icon: "📝",
    title: "Content Production",
    description: "Produced at a volume a team cannot sustain manually, on the subjects customers are actually searching. Reviewed and approved internally."
  },
  {
    icon: "💻",
    title: "Systems and Applications",
    description: "Custom software where the operation requires it. Websites engineered for performance, conversion, and machine readability."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-[#111015] text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-sm font-bold px-6 py-3 rounded-full mb-6 tracking-wider uppercase"
            initial={{ opacity: 0.85, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            CAPABILITY
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]"
            initial={{ opacity: 0.85, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Where AI Applies
          </motion.h2>

          <p className="text-[#ADB7BE] text-lg md:text-xl max-w-2xl mx-auto">
            Practical capability engineered for performance, compliance, and real-world outcomes.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {capabilitiesList.map((capability, index) => (
            <motion.div
              key={index}
              className="bg-[#1a191f] p-8 rounded-2xl border border-gray-800 hover:border-[#ffb700]/30 transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_20px_rgba(255,183,0,0.08)]"
              initial={{ opacity: 0.85, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div>
                <span className="text-4xl block mb-4 p-2 bg-black/40 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">{capability.icon}</span>
                <h4 className="text-xl font-bold mb-3 text-white group-hover:text-[#ffb700] transition-colors">{capability.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{capability.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-gradient-to-r from-[#ffb700]/10 to-[#ff8c00]/10 rounded-3xl p-8 md:p-12 border border-[#ffb700]/20 max-w-4xl mx-auto"
          initial={{ opacity: 0.85, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4">
            Ready to get clarity and move fast?
          </h3>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto font-medium">
            Book a 30-minute consultation to discuss where AI applies to your operation. Zero obligation.
          </p>
          <div className="inline-block">
            <CTAButton
              className="whitespace-nowrap text-base px-8 py-4 font-bold"
              icon="phone"
              eventLabel="services_book_consultation"
              caption="30 minutes. An honest assessment of where AI applies."
            >
              Book a Consultation
            </CTAButton>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesSection;
