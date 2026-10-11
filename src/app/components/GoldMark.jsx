'use client';

import { useEffect, useRef } from 'react';
import { createGoldWave } from '@/lib/gold-wave';

/**
 * The brand mark, wearing the preloader's gold.
 *
 * The header and footer marks used to be a plain <img>, then an animated CSS gradient
 * sweep. Neither was the preloader's effect, which is canvas sine waves rippling
 * through the lion. This renders the same two layers the preloader does — the flat mark
 * underneath, the chroma wave painted over it in `screen` blend — and drives the wave
 * from the SAME renderer (src/lib/gold-wave.js). So the mark on the loading screen and
 * the mark on the page are not similar, they are the same code.
 *
 * Size comes from `className`, as with any masked or layered mark: the layers are
 * absolute inside this box and inherit whatever height and width you give it. Draw
 * resolution is fixed at 200 and scaled by CSS, exactly as the preloader does.
 *
 * Reduced motion: no canvas loop at all, just the static mark, matching the preloader.
 */
export default function GoldMark({ className = '', alt = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    return createGoldWave(canvasRef.current);
  }, []);

  return (
    <span className={`relative block ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.webp"
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter:
            'drop-shadow(0 0 14px rgba(255,183,0,0.45)) drop-shadow(0 0 40px rgba(255,140,0,0.22))',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
    </span>
  );
}
