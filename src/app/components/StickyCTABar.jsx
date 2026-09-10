"use client";

import BookingButton from './BookingButton';

const StickyCTABar = () => (
  <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#1a1a1a]/95 backdrop-blur-lg border-t-2 border-[#ffb700]/30 flex justify-center items-center py-3 px-4 shadow-2xl">
    <div className="flex flex-col items-center w-full">
      <BookingButton
        className="group relative inline-flex items-center justify-center whitespace-nowrap w-full px-6 py-3 text-base font-black text-white rounded-2xl shadow-lg hover:shadow-[#ff1e1e]/60 transform hover:scale-105 transition-all duration-300 border-2 border-[#ff3b3b]"
        style={{ background: 'var(--crimson-gradient)' }}
        trackingLabel="sticky_cta_mobile"
      >
        <span className="relative z-10">Book a Consultation</span>
      </BookingButton>
      <div className="mt-1 text-center text-[11px] leading-tight text-white/70">
      </div>
    </div>
  </div>
);

export default StickyCTABar;
