"use client";

import { useState, useEffect, useCallback } from 'react';
import BookingWidget from './BookingWidget';
import { Button } from './ui/button';

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/k6UtbKZXRHXyxKxEAm0i";

const BookingButton = ({
  children,
  className = "",
  onClick = null,
  trackingLabel = 'booking_button'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    setIsModalOpen(true);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'booking_button_clicked', {
        event_category: 'engagement',
        event_label: trackingLabel
      });
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'booking_button_clicked',
        booking_action: 'widget_opened',
        source: trackingLabel
      });
    }

    if (onClick) onClick(e);
  }, [onClick, trackingLabel]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, closeModal]);

  return (
    <>
      <Button
        asChild
        variant="default"
        className={className}
        onClick={handleClick}
        aria-label="Book a free strategy call with Khamare Clarke"
      >
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#ffb700]/20">
              <h2 className="text-lg font-bold text-white">Book Your Free Strategy Call</h2>
              <button
                onClick={closeModal}
                className="text-[#ADB7BE] hover:text-white transition-colors p-1 rounded"
                aria-label="Close booking widget"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <BookingWidget height="550px" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingButton;
