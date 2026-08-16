import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../../language/LanguageProvider'
import ShareQuoteModal from '../components/ShareQuoteModal'

const PAGE_SIZE = 5

export default function FavoritesView({ favorites, onNavigate, onClearFavorites, focusFavorite }) {
  const { t, lang } = useLanguage()
  const [shareTarget, setShareTarget] = useState(null)
  const [page, setPage] = useState(1)

  const sortedFavorites = useMemo(
    () => [...favorites].sort((a, b) => (b.date || 0) - (a.date || 0)),
    [favorites]
  )

  const pageCount = Math.max(1, Math.ceil(sortedFavorites.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * PAGE_SIZE
  const pageFavorites = sortedFavorites.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    if (page > pageCount) setPage(1)
  }, [sortedFavorites.length, page, pageCount])

  useEffect(() => {
    if (focusFavorite && sortedFavorites.some((f) => f.key === focusFavorite.key)) {
      setShareTarget(focusFavorite)
    }
  }, [focusFavorite, sortedFavorites])

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
            {t('profile.favoriteLines')}
          </h2>
        </div>
        {sortedFavorites.length > 0 && (
          <button onClick={onClearFavorites}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-70"
            style={{ color: '#fca5a5', backgroundColor: 'color-mix(in srgb, #fca5a5 15%, transparent)' }}>
            {t('favorites.clearAll')}
          </button>
        )}
      </div>

      {sortedFavorites.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{t('favorites.empty')}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('favorites.hint')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pageFavorites.map((f) => (
            <div key={f.key}
              className="rounded-xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}
              onClick={() => setShareTarget(f)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>
                    "{f.sentenceText || f.lineText}"
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>
                      {t('favorites.attribution', { poem: f.poemTitle, author: f.author })}
                    </p>
                    <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>
                      {new Date(f.date).toLocaleDateString(lang || 'en-US')}
                    </span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setShareTarget(f) }}
                  className="p-2 rounded-xl flex-shrink-0 transition-all hover:scale-110 active:scale-90"
                  style={{ color: 'var(--tp-secondary)' }}
                  aria-label={t('favorites.shareQuote')}>
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

      {sortedFavorites.length > 0 && pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setPage(safePage - 1)}
            disabled={safePage <= 1}
            className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
            style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)' }}
            aria-label={t('favorites.previousPage')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="text-xs font-medium" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('favorites.pageOf', { page: safePage, count: pageCount })}
          </span>
          <button
            onClick={() => setPage(safePage + 1)}
            disabled={safePage >= pageCount}
            className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
            style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)' }}
            aria-label={t('favorites.nextPage')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}

      {shareTarget && (
        <ShareQuoteModal
          favorite={shareTarget}
          favorites={sortedFavorites}
          initialIndex={sortedFavorites.indexOf(shareTarget)}
          onClose={() => setShareTarget(null)}
        />
      )}
    </div>
  )
}
