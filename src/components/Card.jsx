// Props: { as?: React.ElementType, interactive?: boolean, className?: string, children: React.ReactNode }
export default function Card({
  as: Component = 'div',
  interactive = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`rounded-2xl border border-border bg-surface transition-all ${
        interactive ? 'cursor-pointer hover:border-accent/60' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
