export default function TermsView({ onNavigate }) {
  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          Terms & Conditions
        </h2>
      </div>

      <div className="space-y-6 pb-4">
        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Acceptance of Terms</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            By using Poetry, you agree to these terms. All poems shared remain the intellectual property of their respective authors.
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Service Disclaimer</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            This service is provided "as is" without warranties. We reserve the right to update these terms at any time.
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>User Responsibilities</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            You are solely responsible for the content you publish. Prohibited activities include posting unlawful, harmful, or plagiarized material.
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Termination</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            We may suspend or terminate access for violations of these terms.
          </p>
        </section>
      </div>
    </div>
  )
}
