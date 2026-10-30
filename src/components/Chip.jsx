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
    accent: 'bg-accent-soft text-accent border-accent/40',
    neutral: 'bg-surface text-text-muted border-border'
  };

  const toneClass = tones[tone] || tones.neutral;

  return (
    <span className={`${baseClasses} ${toneClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
