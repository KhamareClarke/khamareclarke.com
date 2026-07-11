'use client';

import { useState } from 'react';

export default function JarvisToastStack({ toasts, onDismiss, className = '' }) {
  if (!toasts?.length) return null;
  return (
    <div
      className={`fixed bottom-24 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none ${className}`}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-2xl border border-sky-400/30 bg-sky-950/95 px-4 py-2.5 text-sm text-sky-100/90 shadow-lg shadow-cyan-500/10 animate-fade-in flex items-start gap-2 backdrop-blur-md"
        >
          <span className="text-cyan-400 shrink-0">◆</span>
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-[#666] hover:text-white text-xs shrink-0"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export function useJarvisToasts() {
  const [toasts, setToasts] = useState([]);

  const pushToast = (message) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev.slice(-4), { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 8000);
  };

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, pushToast, dismissToast };
}
