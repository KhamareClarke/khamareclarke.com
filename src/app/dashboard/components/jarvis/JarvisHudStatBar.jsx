'use client';

export default function JarvisHudStatBar({ label, value, max = 20 }) {
  const num = typeof value === 'number' ? value : 0;
  const pct = Math.min(100, Math.round((num / max) * 100));

  return (
    <div className="jarvis-hud-stat w-full">
      <div className="flex justify-between items-baseline gap-2">
        <p className="text-[9px] uppercase tracking-[0.28em] text-sky-500/65">{label}</p>
        <p className="text-lg font-light text-cyan-300 tabular-nums">{value ?? '—'}</p>
      </div>
      <div className="jarvis-stat-bar mt-1.5 h-0.5 w-full bg-sky-900/80 overflow-hidden rounded-full">
        <div
          className="jarvis-stat-bar-fill h-full bg-gradient-to-r from-cyan-600 to-sky-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
