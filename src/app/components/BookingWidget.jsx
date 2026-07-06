"use client";

import { useEffect, useRef } from 'react';

const BookingWidget = ({ 
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
      script.src = 'https://link.msgsndr.com/js/form_embed.js';
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
    height: height,
    ...style
  };

  return (
    <div className={`booking-widget-container w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        src="https://api.leadconnectorhq.com/widget/booking/k6UtbKZXRHXyxKxEAm0i"
        style={combinedStyle}
        scrolling="yes"
        id="k6UtbKZXRHXyxKxEAm0i_1766768206080"
        title="Book a Meeting with Khamare Clarke"
        loading="lazy"
        allow="payment"
      />
    </div>
  );
};

export default BookingWidget;
