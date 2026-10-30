// Props: { variant?: 'primary' | 'secondary' | 'ghost', type?: 'button' | 'submit' | 'reset', className?: string, children: React.ReactNode }
export default function Button({
  variant = 'secondary',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-1.5 rounded-xl font-extrabold transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-accent text-accent-ink hover:opacity-90 shadow-sm border border-transparent',
    secondary: 'bg-surface-2 text-text border border-border hover:border-accent hover:text-text-heading',
    ghost: 'bg-transparent text-text-muted hover:text-text-heading hover:bg-surface-2 border border-transparent'
  };

  const variantClass = variants[variant] || variants.secondary;

  return (
    <button type={type} className={`${baseClasses} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
