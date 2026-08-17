const LINKS = [
  { view: 'terms', label: 'Terms' },
  { view: 'privacy', label: 'Privacy Policy' },
  { view: 'about', label: 'About' },
]

export default function LegalLinks({ onNavigate }) {
  return (
    <div className="w-full text-center space-y-2">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {LINKS.map((l) => (
          <button key={l.view} onClick={() => onNavigate(l.view)}
            className="text-[11px] font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}>
            {l.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] font-medium" style={{ color: 'var(--tp-text-secondary)', opacity: 0.5 }}>
        A Del<span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--tp-secondary)' }}>v</span>are Enterprise
      </p>
    </div>
  )
}
