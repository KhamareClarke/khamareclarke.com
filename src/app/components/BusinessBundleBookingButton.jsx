"use client";

import { useState, useEffect } from 'react';
import BusinessBundleBookingWidget from './BusinessBundleBookingWidget';
import { Button } from './ui/button';

const BusinessBundleBookingButton = ({ 
  children, 
  className = "", 
  onClick = null,
  trackingLabel = 'business_bundle_booking'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    
    // Track the booking button click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_booking_button', {
        event_category: 'engagement',
        event_label: trackingLabel
      });
    }
    
    if (onClick) onClick(e);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <Button
        variant="default"
        onClick={handleClick}
        className={className}
        aria-label="Open booking widget"
      >
        {children}
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
              aria-label="Close booking widget"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Booking Widget */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Your Business Bundle Consultation</h2>
              <BusinessBundleBookingWidget 
                height="500px"
                onLoad={() => {
                  // Track widget load
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'booking_widget_loaded', {
                      event_category: 'engagement',
                      event_label: trackingLabel
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessBundleBookingButton;
