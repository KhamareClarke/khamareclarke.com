"use client";

import { useEffect, useRef } from 'react';

const BusinessBundleBookingWidget = ({ 
  className = "", 
  height = "600px",
  style = {},
  onLoad = null 
}) => {
  const iframeRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load the booking script only once
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://api.khamareclarke.com/js/form_embed.js';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        scriptLoaded.current = true;
        if (onLoad) onLoad();
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Cleanup script if component unmounts
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [onLoad]);

  const combinedStyle = {
    width: '100%',
    border: 'none',
    overflow: 'hidden',
    height: height,
    ...style
  };

  return (
    <div className={`booking-widget-container ${className}`}>
      <iframe
        ref={iframeRef}
        src="https://api.khamareclarke.com/widget/booking/HzYuX1w1R30U3Xr2fU7x"
        style={combinedStyle}
        scrolling="no"
        id="HzYuX1w1R30U3Xr2fU7x_1759339495789"
        title="Business Bundle Booking Widget"
        aria-label="Book your business bundle consultation"
      />
    </div>
  );
};

export default BusinessBundleBookingWidget;
