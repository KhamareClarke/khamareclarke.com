'use client';

import { useEffect, useRef } from 'react';
import { useFocusTrap } from './useFocusTrap';

/**
 * Sheet slide-over (shadcn-style behaviour, obsidian/gold tokens).
 */
export default function JarvisSheet({ open, onClose, children, title = 'JARVIS' }) {
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="relative z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-auto">
          <div
            ref={trapRef}
            className="w-screen max-w-md jarvis-sheet-enter flex h-full flex-col bg-[#0a0a0a] border-l border-[#ffb700]/20 shadow-2xl"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
