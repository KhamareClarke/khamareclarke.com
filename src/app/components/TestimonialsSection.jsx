"use client";
import React from "react";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const results = [
  {
    icon: "📈",
    stat: "538%",
    label: "Google Business Profile interactions growth",
    detail: "UK roofing contractor. 90-day local SEO campaign.",
  },
  {
    icon: "📞",
    stat: "30+",
    label: "Qualified calls in the first two weeks",
    detail: "Upgrade Roofing. Google Business Profile optimisation + on-page SEO.",
  },
  {
    icon: "🎯",
    stat: "5X",
    label: "Leads in 60 days",
    detail: "Sustained pipeline growth through local SEO and AI search visibility.",
  },
  {
    icon: "📊",
    stat: "~20",
    label: "Qualified enquiries per day",
    detail: "Sustained over 6 months via GBP management and AI search optimisation.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="text-white py-12 md:py-16 lg:py-20 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-10 mt-1 w-full text-center px-2">
          <motion.span
            className="bg-transparent border border-[#ffb700] text-[#ffb700] text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            RESULTS
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-2 pb-2 text-[#ffb700] relative inline-block mx-auto">
            What the Numbers Show
            <motion.span
              className="absolute inset-x-0 bottom-0 h-1 w-full rounded-full bg-[#ffb700]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.3 }}
            />
          </h2>
          <p className="text-[#ADB7BE] mt-4 text-base md:text-lg max-w-2xl">Documented from live client accounts. No projections.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {results.map((item, i) => (
            <motion.div
              key={i}
              className="bg-[#1a1a1a]/90 border border-[#ffb700]/20 hover:border-[#ffb700]/50 rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl">{item.icon}</span>
              <div className="text-3xl font-black text-[#ffb700]">{item.stat}</div>
              <div className="text-white font-semibold text-sm leading-snug">{item.label}</div>
              <div className="text-[#ADB7BE] text-xs leading-relaxed">{item.detail}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <CTAButton
            icon="bolt"
            eventLabel="results_book_strategy_call"
            className="px-8 py-3 text-lg"
            caption="30 min strategy, zero obligation"
          >
            Book Free Call
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
