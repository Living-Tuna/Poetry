import DataIndicator from '../components/DataIndicator'

export default function WritingsView({ myPoems, myPoemsCachedOnly, onNavigate, onEditPoem, onDeletePoem, onNewPoem, navigateToPoem }) {
  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
              My Writings
            </h2>
            <DataIndicator cachedOnly={myPoemsCachedOnly} />
          </div>
        </div>
        <button onClick={onNewPoem}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-70"
          style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)' }}>
          + New
        </button>
      </div>

      {myPoems.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No writings yet.</p>
          <button onClick={onNewPoem}
            className="mt-3 text-xs px-4 py-2 rounded-lg font-medium"
            style={{ color: '#fff', backgroundColor: 'var(--tp-secondary)' }}>
            Write your first poem
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {myPoems.map((p) => (
            <div key={p.id}
              className="rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => navigateToPoem(p)}>
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{p.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.createdAt}</p>
                    {(p.categories && p.categories.length > 0) && (
                      <div className="flex gap-1">
                        {p.categories.map((cat) => (
                          <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 20%, transparent)', color: 'var(--tp-secondary)' }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); navigateToPoem(p) }}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }} aria-label="View">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onEditPoem(p) }}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: 'rgba(255,255,255,0.5)' }} aria-label="Edit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeletePoem(p.id) }}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: '#ef4444' }} aria-label="Delete">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}