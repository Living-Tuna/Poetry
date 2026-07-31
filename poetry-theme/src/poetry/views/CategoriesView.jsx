export default function CategoriesView({ categories, onSelectCategory, onNavigate }) {
  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          Categories
        </h2>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No categories available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => onSelectCategory(cat.name)}
              className="rounded-xl p-5 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{cat.name}</p>
              <p className="text-xs mt-1.5" style={{ color: 'var(--tp-text-secondary)' }}>{cat.count} {cat.count === 1 ? 'poem' : 'poems'}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
