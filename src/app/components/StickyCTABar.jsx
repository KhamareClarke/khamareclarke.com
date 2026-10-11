"use client";

import { motion } from "framer-motion";
import BookingButton from './BookingButton';

/**
 * Motion: slides up from below on mount instead of appearing instantly.
 * Transform-only (no opacity), so it is never invisible if JS is slow.
 * Layout, classes, copy and the tracking label are unchanged.
 */
const StickyCTABar = () => (
  <motion.div
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#1a1a1a]/95 backdrop-blur-lg border-t-2 border-[#ffb700]/30 flex justify-center items-center py-3 px-4 shadow-2xl"
  >
    <div className="flex flex-col items-center w-full">
      <BookingButton
        className="group relative inline-flex items-center justify-center whitespace-nowrap w-full px-6 py-3 text-base font-black text-white rounded-2xl shadow-lg hover:shadow-[#ff1e1e]/60 transform hover:scale-105 transition-all duration-300 border-2 border-[#ff3b3b]"
        style={{ background: 'var(--crimson-gradient)' }}
        trackingLabel="sticky_cta_mobile"
      >
        <span className="relative z-10">Book a Consultation</span>
      </BookingButton>
      <div className="mt-1 text-center text-sm leading-tight text-white/70">
      </div>
    </div>
  </motion.div>
);

export default StickyCTABar;
