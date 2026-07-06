"use client";

import { useState, useEffect } from "react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-[#ffb700]/30 p-4 shadow-2xl">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2 text-sm md:text-base">
              🍪 We use cookies to enhance your experience
            </h3>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed">
              We use cookies to analyze site traffic, personalize content, and improve our services. 
              By continuing to use our site, you consent to our use of cookies. 
              <a href="/cookies" className="text-[#ffb700] hover:text-[#ff8c00] underline ml-1">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-white/70 hover:text-white text-sm border border-white/20 hover:border-white/40 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-[#ffb700] hover:bg-[#ff8c00] text-black font-semibold text-sm rounded-lg transition-colors shadow-lg"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
