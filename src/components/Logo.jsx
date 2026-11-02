/**
 * @param {{ onClick?: () => void, showSubtitle?: boolean, className?: string }} props
 */
export default function Logo({ onClick = () => {}, showSubtitle = false, className = '' }) {
  return (
    <div
      onClick={onClick}
      dir="ltr"
      className={`flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none group shrink-0 text-left ${className}`}
      title="AIProdZone — دورات وكتب إلكترونية مجانية"
    >
      <svg
        viewBox="0 0 44 44"
        width="36"
        height="36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '36px', maxHeight: '36px' }}
        className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 shadow-sm"
      >
        <rect
          x="1.5"
          y="1.5"
          width="41"
          height="41"
          rx="10.5"
          fill="var(--surface-2)"
          stroke="var(--accent)"
          strokeWidth="1.75"
          strokeOpacity="0.85"
        />
        <rect
          x="3"
          y="3"
          width="38"
          height="38"
          rx="9"
          fill="url(#aiprodzone_grad)"
          fillOpacity="0.22"
        />
        <path
          d="M32.5 8.2L33.65 11.6L37 12.75L33.65 13.9L32.5 17.3L31.35 13.9L28 12.75L31.35 11.6L32.5 8.2Z"
          fill="var(--text-heading)"
          className="transition-transform duration-300 group-hover:rotate-12"
        />
        <path
          d="M15.5 24.5H26.5"
          stroke="var(--text-heading)"
          strokeWidth="3.3"
          strokeLinecap="round"
        />
        <path
          d="M12.5 30.5L21 12.5L29.5 30.5"
          stroke="var(--accent)"
          strokeWidth="4.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 35.2C14.2 33.8 18.2 33.8 21 35.3C23.8 33.8 27.8 33.8 31 35.2"
          stroke="var(--text-muted)"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="aiprodzone_grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--surface-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col justify-center items-start leading-none">
        <div className="font-extrabold text-[15px] sm:text-[19px] tracking-tight leading-none flex items-center">
          <span className="text-text-heading">AIProd</span>
          <span className="text-accent">Zone</span>
        </div>
        {showSubtitle && (
          <span className="block text-[10px] font-bold mt-1 tracking-normal text-text-muted">
            دورات وكتب إلكترونية مجانية
          </span>
        )}
      </div>
    </div>
  );
}
