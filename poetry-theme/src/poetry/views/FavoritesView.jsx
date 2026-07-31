import { useState } from 'react'
import ShareQuoteModal from '../components/ShareQuoteModal'

export default function FavoritesView({ favorites, onNavigate, onClearFavorites }) {
  const [shareTarget, setShareTarget] = useState(null)

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
          <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            Favorite Lines
          </h2>
        </div>
        {favorites.length > 0 && (
          <button onClick={onClearFavorites}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-70"
            style={{ color: '#fca5a5', backgroundColor: 'color-mix(in srgb, #fca5a5 15%, transparent)' }}>
            Clear all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No favorite lines yet.</p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)' }}>
            Triple-tap a line while reading to save it as a favorite.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {favorites.map((f) => (
            <div key={f.key}
              className="rounded-xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}
              onClick={() => setShareTarget(f)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>
                    "{f.lineText}"
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>
                      — {f.poemTitle} by {f.author}
                    </p>
                    <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>
                      {new Date(f.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setShareTarget(f) }}
                  className="p-2 rounded-xl flex-shrink-0 transition-all hover:scale-110 active:scale-90"
                  style={{ color: 'var(--tp-secondary)' }}
                  aria-label="Share this quote">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {shareTarget && (
        <ShareQuoteModal
          favorite={shareTarget}
          favorites={favorites}
          initialIndex={favorites.indexOf(shareTarget)}
          onClose={() => setShareTarget(null)}
        />
      )}
    </div>
  )
}