export default function ActionCard({ icon, title, subtitle, onClick, className = '' }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-xl p-4 animate-fade-in transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${className}`}
      style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)', color: 'var(--tp-secondary)' }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{title}</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            {subtitle}
          </p>
        </div>
        <svg width="16" height="16" className="mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--tp-text-secondary)' }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}
