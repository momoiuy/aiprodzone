import React from 'react';

// Props: { tone?: 'accent' | 'neutral', className?: string, children: React.ReactNode }
export default function Chip({
  tone = 'neutral',
  className = '',
  children,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold select-none transition-colors border';

  const tones = {
    accent: 'bg-accent-soft text-teal-700 dark:text-teal-400 border-accent/40',
    neutral: 'bg-surface text-text-muted border-slate-200/80 dark:border-slate-800'
  };

  const toneClass = tones[tone] || tones.neutral;

  return (
    <span className={`${baseClasses} ${toneClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
