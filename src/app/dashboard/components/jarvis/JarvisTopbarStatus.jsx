'use client';

import useJarvisTopbarStatus from './useJarvisTopbarStatus';

const LABELS = [
  { key: 'empireOs', label: 'Empire OS' },
  { key: 'fleet', label: 'Fleet' },
  { key: 'supabase', label: 'Supabase' },
];

export default function JarvisTopbarStatus() {
  const status = useJarvisTopbarStatus();

  return (
    <div className="jarvis-status-dots hidden lg:flex items-center gap-3" aria-label="Service status">
      {LABELS.map(({ key, label }) => {
        const state = status[key] || 'unknown';
        return (
          <span key={key} className="jarvis-status-item" title={`${label}: ${state}`}>
            <span className={`jarvis-status-dot jarvis-status-dot--${state}`} aria-hidden />
            <span className="jarvis-status-label">{label}</span>
          </span>
        );
      })}
    </div>
  );
}
