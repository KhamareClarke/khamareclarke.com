'use client';

import { useCallback } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import BookingButton from './BookingButton';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

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
  fullWidth = false,
  caption = null,
  captionClassName = "",
  href = null,
  useBookingWidget = true,
  type = 'button',
  ...rest
}) {
  const handleClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
    trackEvent('engagement', 'click_primary_cta', eventLabel);
  }, [onClick, eventLabel]);

  const variants = {
    primary: 'default',
    secondary: 'secondary',
    ghost: 'ghost',
  };

  const baseClass = `group inline-flex items-center justify-center gap-2 font-bold py-3 px-6 text-base ${fullWidth ? 'w-full' : ''}`;

  const className$ = cn(
    buttonVariants({ variant: variants[variant] || 'default', size: 'default' }),
    baseClass,
    className
  );

  const content = (
    <>
      {children}
      <FaArrowRight className="shrink-0" aria-hidden="true" />
    </>
  );

  const captionEl = caption ? (
    <p className={`mt-2 text-center ${captionClassName} text-[11px] sm:text-xs text-white/60 leading-snug`}>
      {caption}
    </p>
  ) : null;

  const wrapperClassName = `flex flex-col items-center ${fullWidth ? 'w-full' : ''}`;

  if (useBookingWidget) {
    return (
      <div className={wrapperClassName}>
        <BookingButton
          className={className$}
          onClick={handleClick}
          trackingLabel={eventLabel}
          {...rest}
        >
          {content}
        </BookingButton>
        {captionEl}
      </div>
    );
  }

  if (href) {
    return (
      <div className={wrapperClassName}>
        <a
          href={href}
          className={className$}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
          {...rest}
        >
          {content}
        </a>
        {captionEl}
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <button
        type={type}
        className={className$}
        onClick={handleClick}
        {...rest}
      >
        {content}
      </button>
      {captionEl}
    </div>
  );
}
