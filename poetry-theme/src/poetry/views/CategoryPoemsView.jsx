export default function CategoryPoemsView({ category, poems, onNavigate, navigateToPoem }) {
  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('categories')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {category}
        </h2>
      </div>

      {poems.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No poems in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {poems.map((p) => (
            <button key={p.id} onClick={() => navigateToPoem(p)}
              className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
              <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{p.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>by {p.author}</span>
                <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.date || p.createdAt || ''}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
