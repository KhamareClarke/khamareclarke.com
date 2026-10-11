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
  compact = false,
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

  // Two sizes only. The default is the hero-sized button, which every section uses so
  // they all match. `compact` is for the navbar, where the section sizing would push the
  // fixed bar past the height `--nav-h` reserves and drop it onto the hero. It is a
  // switch here rather than something the caller sets, because Tailwind resolves
  // conflicting utilities by stylesheet order rather than by the order they appear in
  // this string, so the navbar cannot win by passing its own padding and text classes.
  // If this size changes, `--nav-h` in globals.css must be re-measured to match.
  const sizeClass = compact
    ? 'text-lg px-8 py-4'
    : 'text-lg lg:text-xl px-10 py-5 lg:px-12 lg:py-6';
  const baseClass = `group inline-flex items-center justify-center gap-2 font-bold ${sizeClass} ${fullWidth ? 'w-full' : ''}`;

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
    <p className={`gold-text mt-2 text-center ${captionClassName} ${compact ? 'text-base' : 'text-lg'} leading-snug`}>
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
