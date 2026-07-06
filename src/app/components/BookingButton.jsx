"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BookingWidget from './BookingWidget';

const BookingButton = ({ 
  children, 
  className = "", 
  onClick = null,
  variant = 'primary',
  trackingLabel = 'booking_button'
}) => {
  const router = useRouter();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    
    // Track the click event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'booking_button_clicked', {
        event_category: 'engagement',
        event_label: trackingLabel
      });
    }
    
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'booking_button_clicked',
        booking_action: 'navigate_to_onboarding',
        source: trackingLabel
      });
    }
    
    // Custom onClick handler
    if (onClick) onClick(e);
    
    // Navigate to onboarding page
    router.push('/onboarding');
  }, [onClick, trackingLabel, router]);

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
      aria-label="Navigate to onboarding"
    >
      {children}
    </button>
  );
};

export default BookingButton;
