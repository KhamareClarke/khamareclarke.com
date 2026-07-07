"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import BookingButton from './BookingButton';

const HeroSection = () => {
  return (
    <section className="pt-4 pb-8 sm:pt-8 sm:pb-16 lg:pt-28 lg:pb-20 bg-[#111015] relative overflow-hidden">
      {/* Warm radial glow — centred on portrait column, fades left into dark page bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 65% 90% at 82% 50%, rgba(255,183,0,0.18) 0%, rgba(255,140,0,0.10) 28%, rgba(255,183,0,0.04) 55%, transparent 75%)',
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
        >
          {/* Badge — static, always visible */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-[11px] sm:text-xs font-bold px-5 py-2.5 rounded-full tracking-wider uppercase">
              THE SEO SPECIALIST WITH A MASTER&apos;S IN AI
            </span>
          </div>

          <h1 className="font-extrabold uppercase leading-none mb-4 lg:mb-5 text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl" style={{fontFamily:'Montserrat, sans-serif', letterSpacing:'-0.03em'}}>
            <span className="block text-white">Khamare</span>
            <span className="block text-[#ffb700]">Clarke</span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-xl max-w-xl font-medium mb-4 lg:mb-5 text-[#ADB7BE]" style={{fontFamily:'Montserrat, sans-serif'}}>
            UK businesses that rank higher, earn more, and run leaner.
          </p>

          <p className="text-base lg:text-lg max-w-xl text-[#ADB7BE]/80 mb-4 lg:mb-5 leading-relaxed" style={{fontFamily:'Montserrat, sans-serif'}}>
            I rank UK businesses with SEO backed by AI systems built in production. I write the code, run the campaigns, and build the systems that convert the traffic.
          </p>

          <p className="text-2xl sm:text-3xl font-black text-[#ffb700] mb-6 lg:mb-8 text-center lg:text-left" style={{fontFamily:'Montserrat, sans-serif', letterSpacing:'-0.02em'}}>
            Page 1. Guaranteed.
          </p>

          <div className="flex flex-col items-center lg:items-start mb-8">
            <BookingButton
              className="group relative inline-flex items-center justify-center px-10 py-5 lg:px-12 lg:py-6 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] text-black font-black rounded-xl hover:scale-105 transform transition-all duration-300 text-lg lg:text-xl shadow-xl hover:shadow-[#fdbd18]/50 border-2 border-[#fdbd18]"
              trackingLabel="hero_book_call"
            >
              <span className="relative z-10">Book Free Call</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#fdbd18] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </BookingButton>
            <p className="mt-2 text-center lg:text-left text-[11px] sm:text-xs text-white/50 leading-snug">
              30-minute strategy call. No obligation.
            </p>
          </div>

          {/* Trust icons — static, no animation dependency */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 mb-8">
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-xl">🔒</span>
              <span className="text-white text-xs font-semibold leading-snug text-center lg:text-left">Ranked or Refunded</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-xl">⚡</span>
              <span className="text-white text-xs font-semibold leading-snug text-center lg:text-left">Results in 60 Days</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-xl">🔍</span>
              <span className="text-white text-xs font-semibold leading-snug text-center lg:text-left">No Black Box</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-xl">⭐</span>
              <span className="text-white text-xs font-semibold leading-snug text-center lg:text-left">Guaranteed Outcomes</span>
            </div>
          </div>

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
          <div className="relative inline-block mx-auto">
            {/* Radial glow behind portrait — pure CSS, decorative */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: '160%',
                height: '160%',
                background: 'radial-gradient(circle, rgba(255,183,0,0.22) 0%, rgba(255,140,0,0.12) 35%, rgba(255,183,0,0.04) 60%, transparent 80%)',
              }}
            />
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
          </div>{/* end inline-block glow wrapper */}
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
