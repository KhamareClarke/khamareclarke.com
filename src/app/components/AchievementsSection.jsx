"use client";
import React from "react";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";
import { Badge } from "./ui/Badge";

const credentials = [
  "Member of Staffordshire Chamber of Commerce",
  "Google Ads Partner",
  "NetworkIN Member"
];

const AchievementsSection = () => {
  return (
    <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <Badge variant="outline" className="mb-6">Trust</Badge>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight text-white">
          Credentials that back the work
        </h2>
      </div>

      {/* Credentials */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {credentials.map((credential, index) => (
            <motion.div
              key={index}
              className="bg-surface-muted border border-white/10 rounded-lg p-5 md:p-6 flex items-center justify-center text-center"
              initial={{ opacity: 0.85, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.04 }}
            >
              <span className="text-white/80 text-sm md:text-base leading-snug font-medium">
                {credential}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="max-w-7xl mx-auto text-center text-[#ADB7BE] text-sm md:text-base mb-10">
        MSc Computer Science &amp; AI, Keele University. Finishing 2027.
      </p>

      <div className="max-w-7xl mx-auto text-center">
        <CTAButton
          href="/#contact"
          eventLabel="achievements_book_consultation"
          caption="An honest look at where AI fits."
        >
          Book a Consultation
        </CTAButton>
      </div>
    </div>
  );
};

export default AchievementsSection;
