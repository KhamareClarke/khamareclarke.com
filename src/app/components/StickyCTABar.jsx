"use client";

import BookingButton from './BookingButton';

const StickyCTABar = () => (
  <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#1a1a1a]/95 backdrop-blur-lg border-t-2 border-[#ffb700]/30 flex justify-center items-center py-3 px-4 shadow-2xl">
    <div className="flex flex-col items-center w-full">
      <BookingButton
        className="group relative inline-flex items-center justify-center whitespace-nowrap w-full px-6 py-3 text-base font-black text-black bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-2xl shadow-lg hover:shadow-[#fdbd18]/50 transform hover:scale-105 transition-all duration-300 border-2 border-[#fdbd18]"
        trackingLabel="sticky_cta_mobile"
      >
        <span className="relative z-10">Book Your Free SEO Strategy Call</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#fdbd18] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </BookingButton>
      <div className="mt-1 text-center text-[11px] leading-tight text-white/70">
      </div>
    </div>
  </div>
);

export default StickyCTABar;
