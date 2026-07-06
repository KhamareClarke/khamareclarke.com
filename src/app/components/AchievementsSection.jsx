"use client";
import React from "react";
import dynamic from "next/dynamic";
import { FaBriefcase, FaPoundSign, FaRobot, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUpNumber from "./CountUpNumber";
import CTAButton from "./CTAButton";

const AnimatedNumbers = dynamic(
  () => {
    return import("react-animated-numbers");
  },
  { ssr: false }
);

const achievementsList = [
  {
    icon: "🏢",
    metric: "Businesses Automated",
    value: "50",
    postfix: "+",
    color: "#3B82F6", // Blue
  },
  {
    icon: "💰",
    metric: "Revenue Unlocked",
    value: "12,000,000",
    prefix: "£",
    postfix: "+",
    color: "#10B981", // Green
  },
  {
    icon: "🤖",
    metric: "AI Workforce Deployed",
    value: "120",
    postfix: "+",
    color: "#8B5CF6", // Purple
  },
  {
    icon: "⭐",
    metric: "Client Retention Rate",
    value: "100",
    postfix: "%",
    color: "#F59E0B", // Amber
  },
];

import { useEffect, useState } from "react";

const AchievementsSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <motion.div
      className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <motion.span
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-sm font-bold px-6 py-3 rounded-full mb-6 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          PROVEN RESULTS
        </motion.span>
        
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Numbers That Matter
        </motion.h2>
        
        <motion.p 
          className="text-[#ADB7BE] text-lg md:text-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Real metrics from real businesses that trusted us to transform their operations with AI.
        </motion.p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
        {achievementsList.map((achievement, index) => {
          return (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] rounded-2xl p-[2px] group-hover:p-[3px] transition-all duration-300">
                <div className="bg-[#0a0a0a] rounded-2xl h-full" />
              </div>
              
              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a]/90 to-[#0f0f0f]/90 backdrop-blur-sm rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center border border-[#ffb700]/20 group-hover:border-[#ffb700]/40 transition-all duration-300">
                
                {/* Icon with Color Background */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${achievement.color}20, ${achievement.color}10)`,
                    border: `2px solid ${achievement.color}40`
                  }}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                </div>
                
                {/* Number */}
                <div className="mb-4">
                  <div className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] drop-shadow-lg flex items-baseline justify-center gap-1 whitespace-nowrap ${achievement.value === "12,000,000" ? "text-2xl sm:text-3xl md:text-4xl" : "text-3xl sm:text-4xl md:text-5xl"}`}>
                    <span>{achievement.prefix}</span>
                    <CountUpNumber value={achievement.value} />
                    <span>{achievement.postfix}</span>
                  </div>
                </div>
                
                {/* Label */}
                <h3 className="text-white font-semibold text-base md:text-lg leading-tight group-hover:text-[#ffb700] transition-colors duration-300">
                  {achievement.metric}
                </h3>
                
                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle at center, ${achievement.color}10, transparent 70%)`
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        viewport={{ once: true }}
      >
        <CTAButton
          icon="bolt"
          eventLabel="achievements_book_strategy_call"
          caption="Designed for teams ready to turn momentum into a repeatable system."
        >
          Book Your Free Strategy Call
        </CTAButton>
      </motion.div>
    </motion.div>
  );
};

export default AchievementsSection;
