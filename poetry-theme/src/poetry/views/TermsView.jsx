import { useEffect } from 'react'

export default function TermsView({ onNavigate }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--tp-bg)' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 select-none"
        style={{ borderBottom: '1px solid var(--tp-border)', backgroundColor: 'var(--tp-bg)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            Terms & Conditions
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2
            className="text-2xl sm:text-3xl font-bold leading-tight mb-6 text-center"
            style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Terms & Conditions
          </h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Acceptance of Terms</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
                By using Poetry, you agree to these terms. All poems shared remain the intellectual property of their respective authors.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Service Disclaimer</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
                This service is provided "as is" without warranties. We reserve the right to update these terms at any time.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>User Responsibilities</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
                You are solely responsible for the content you publish. Prohibited activities include posting unlawful, harmful, or plagiarized material.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Termination</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
                We may suspend or terminate access for violations of these terms.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex-shrink-0 px-5 py-2.5 flex items-center justify-center text-xs"
        style={{ color: 'var(--tp-text-secondary)', borderTop: '1px solid var(--tp-border)', backgroundColor: 'var(--tp-bg)' }}
      >
        <button onClick={() => onNavigate('dashboard')} className="hover:opacity-70">
          ← Back
        </button>
      </div>
    </div>
  )
}
