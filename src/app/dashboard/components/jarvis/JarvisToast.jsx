'use client';

import { useState } from 'react';

export default function JarvisToastStack({ toasts, onDismiss }) {
  if (!toasts?.length) return null;
  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-lg border border-[#ffb700]/30 bg-[#1a1a1a]/95 px-4 py-2.5 text-sm text-[#ADB7BE] shadow-lg animate-fade-in flex items-start gap-2"
        >
          <span className="text-[#ffb700] shrink-0">◆</span>
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
