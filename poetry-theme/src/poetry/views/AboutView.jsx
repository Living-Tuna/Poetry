export default function AboutView({ onNavigate }) {
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
          About
        </h2>
      </div>

      <div className="space-y-6 pb-4">
        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Our Mission</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            From the verses of prehistoric and ancient times to the poems written tonight, we carry humanity's literature
            forward — and connect like-minded readers to share real books through Blend.
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>The History Library</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            Browse 150+ passages from the greatest works of all time — the Bible, the Quran, the Odyssey, the Iliad,
            the Bhagavad Gita, the Tao Te Ching, Shakespeare, Milton, Dante, and the world's poets — all public domain
            and unexpurgated.
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Blend</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            Blend is our book exchange. List a book on your shelf, search for the book you want, and request it from a
            nearby reader. Books travel the world, one reader at a time.
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>Stay Safe</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            Never share personal information, and always strictly follow the Privacy Policy when exchanging books or
            messaging other readers.
          </p>
        </section>
      </div>
    </div>
  )
}
