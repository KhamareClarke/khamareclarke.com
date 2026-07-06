'use client';

import { useCallback, ReactNode } from 'react';
import { FaArrowRight, FaPhone, FaCalendarAlt, FaDownload, FaBook, FaBolt, FaRocket } from 'react-icons/fa';
import BookingButton from './BookingButton';

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

export default function CTAButton({ 
  children, 
  className = "", 
  onClick, 
  eventLabel = 'cta_click',
  variant = 'primary',
  icon = 'arrow',
  fullWidth = false,
  caption = null,
  captionClassName = "",
  href = null, // Remove default Calendly URL
  useBookingWidget = true, // New prop to control booking widget usage
  type = 'button',
  ...rest
}) {
  const handleClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
    trackEvent('engagement', 'click_primary_cta', eventLabel);
  }, [onClick, eventLabel]);

  // Define button variants
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-[#fdbd18] to-[#ff8c00]',
      hoverBg: 'from-[#ff8c00] to-[#fdbd18]',
      text: 'text-black',
      border: 'border-[#fdbd18]',
      shadow: 'hover:shadow-[#fdbd18]/50',
      ring: 'focus:ring-[#ffb700]'
    },
    secondary: {
      bg: 'bg-[#1a1a1a]',
      hoverBg: 'from-[#1a1a1a] to-[#2a2a2a]',
      text: 'text-white',
      border: 'border-[#333]',
      shadow: 'hover:shadow-[#333]/50',
      ring: 'focus:ring-[#555]'
    },
    outline: {
      bg: 'bg-transparent',
      hoverBg: 'from-[#ff8c00] to-[#fdbd18]',
      text: 'text-white',
      border: 'border-[#fdbd18]',
      shadow: 'hover:shadow-[#fdbd18]/30',
      ring: 'focus:ring-[#ffb700]'
    }
  };

  // Define icon components with emojis and consistent spacing
  const icons = {
    arrow: <span className="ml-2 text-lg">→</span>,
    phone: <span className="mr-2">📞</span>,
    calendar: <span className="mr-2">📅</span>,
    download: <span className="mr-2">⬇️</span>,
    book: <span className="mr-2">📖</span>,
    bolt: <span className="ml-2 text-lg">⚡</span>,
    folder: <span className="ml-2">📁</span>,
    none: null
  };

  const variantStyles = variants[variant] || variants.primary;
  const IconComponent = typeof icon === 'string' ? icons[icon] || null : icon;

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center justify-center">
        <span className="flex items-center gap-1">
          {icon === 'phone' || icon === 'calendar' || icon === 'download' || icon === 'book' ? (
            <>
              {IconComponent}
              <span>{children}</span>
            </>
          ) : (
            <>
              <span className="whitespace-nowrap">{children}</span>
              {icon !== 'none' && IconComponent}
            </>
          )}
        </span>
      </span>
      <div className={`absolute inset-0 bg-gradient-to-r ${variantStyles.hoverBg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </>
  );

  const buttonClassName = `group relative inline-flex items-center justify-center mx-auto font-black rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 focus:outline-none focus:ring-2 text-center whitespace-nowrap 
    ${className}
    py-4 px-8 text-base sm:text-lg
    ${variantStyles.bg} 
    ${variantStyles.text} 
    ${variantStyles.border} 
    ${variantStyles.shadow} 
    ${variantStyles.ring}
    ${fullWidth ? 'w-full' : ''}`;

  // If useBookingWidget is true, use BookingButton, otherwise use regular link
  if (useBookingWidget) {
    return (
      <div className={`flex flex-col items-center ${fullWidth ? 'w-full' : ''}`}>
        <BookingButton
          className={buttonClassName}
          onClick={handleClick}
          trackingLabel={eventLabel}
          {...rest}
        >
          {buttonContent}
        </BookingButton>
        {caption ? (
          <div className={`mt-2 text-center ${captionClassName} text-[11px] sm:text-xs text-white/60 leading-snug`}>
            {caption}
          </div>
        ) : null}
      </div>
    );
  }

  // If href is provided and useBookingWidget is false, render a regular link
  if (href) {
    return (
      <div className={`flex flex-col items-center ${fullWidth ? 'w-full' : ''}`}>
        <a
          href={href}
          className={buttonClassName}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
          {...rest}
        >
          {buttonContent}
        </a>
        {caption ? (
          <div className={`mt-2 text-center ${captionClassName} text-[11px] sm:text-xs text-white/60 leading-snug`}>
            {caption}
          </div>
        ) : null}
      </div>
    );
  }

  // Otherwise, render a native button (useful for forms)
  return (
    <div className={`flex flex-col items-center ${fullWidth ? 'w-full' : ''}`}>
      <button
        type={type}
        className={buttonClassName}
        onClick={handleClick}
        {...rest}
      >
        {buttonContent}
      </button>
      {caption ? (
        <div className={`mt-2 text-center ${captionClassName} text-[11px] sm:text-xs text-white/60 leading-snug`}>
          {caption}
        </div>
      ) : null}
    </div>
  );
}
