"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import BookingButton from './BookingButton';

const HeroSection = () => {
  return (
    <section className="pt-4 pb-8 sm:pt-8 sm:pb-16 lg:pt-4 lg:pb-20 bg-[#111015]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
        >
          <div className="mb-4 flex items-center gap-2 relative">
                        {/* Subtle AI/tech SVG background graphic */}
            <motion.span
              className="absolute -z-10 left-[-40px] top-[-30px] pointer-events-none select-none"
              initial={{ opacity: 0.12 }}
              animate={{ opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
            >
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none"><ellipse cx="60" cy="40" rx="55" ry="28" fill="#ffb700" opacity="0.12"/><ellipse cx="60" cy="40" rx="40" ry="18" fill="#fff" opacity="0.09"/></svg>
            </motion.span>
          </div>
<h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-4 lg:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700]" style={{fontFamily:'Montserrat, sans-serif', letterSpacing:'-0.03em'}}>
  The SEO specialist with a Master&apos;s in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">AI.</span>
</h1>
<p className="text-lg sm:text-xl lg:text-xl max-w-2xl font-medium mb-2 lg:mb-3" style={{fontFamily:'Montserrat, sans-serif'}}>
  <span className="text-[#ffb700] font-bold">I rank UK businesses on Google and in AI search.</span>
</p>
<p className="text-[#ADB7BE] text-base sm:text-lg lg:text-lg max-w-2xl lg:max-w-3xl font-normal mb-6 lg:mb-8" style={{fontFamily:'Montserrat, sans-serif'}}>
  538% visibility growth, 5X leads in 60 days, documented below.
</p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full sm:w-auto items-center sm:items-start justify-center sm:justify-start">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <BookingButton
                className="group relative inline-flex items-center justify-center px-10 py-5 lg:px-12 lg:py-6 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] text-black font-black rounded-xl hover:scale-105 transform transition-all duration-300 text-lg lg:text-xl shadow-xl hover:shadow-[#fdbd18]/50 border-2 border-[#fdbd18]"
                trackingLabel="hero_book_call"
              >
                <span className="relative z-10">Book Your Free SEO Strategy Call</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#fdbd18] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </BookingButton>
              <div className="mt-2 text-center text-[11px] sm:text-xs text-white/60 leading-snug">
              </div>
            </div>
          </div>
                  </motion.div>
          
          <div className="flex justify-center lg:justify-start space-x-6 mb-8">
            <motion.a
              href="https://www.linkedin.com/in/khamareclarke"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#ffb700] transition-colors text-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <FaLinkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/khamareclarke"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#ffb700] transition-colors text-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.3 }}
            >
              <FaInstagram className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.facebook.com/khamareclarke"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#ffb700] transition-colors text-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.4 }}
            >
              <FaFacebook className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.tiktok.com/@khamareclarke"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#ffb700] transition-colors text-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.5 }}
            >
              <FaTiktok className="w-6 h-6" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 place-self-center order-1 lg:order-2 mt-8 sm:mt-12 lg:mt-0"
        >
          <div className="rounded-full w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px] relative shadow-2xl border-4 border-[#ffb700]/80 bg-[#111015] flex items-center justify-center ring-4 ring-[#ffb700]/20 mx-auto overflow-hidden hover:ring-[#ffb700]/40 transition-all duration-300">
            <Image
              src="/images/hero-image.png"
              alt="Khamare Clarke - AI Automation Expert and Business Growth Architect"
              className="object-contain w-full h-full scale-85 hover:scale-90 transition-transform duration-300"
              width={550}
              height={550}
              priority
            />
            {/* Floating sparkle accent */}
            <motion.span
              className="absolute top-5 right-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 1.8, delay: 1, repeat: Infinity, repeatDelay: 4 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffb700"><circle cx="12" cy="12" r="3.5"/><g opacity="0.6"><circle cx="4" cy="12" r="1.6"/><circle cx="20" cy="12" r="1.6"/><circle cx="12" cy="4" r="1.6"/><circle cx="12" cy="20" r="1.6"/></g></svg>
            </motion.span>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
