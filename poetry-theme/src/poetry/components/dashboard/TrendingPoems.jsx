import { useLanguage } from '../../../language/LanguageProvider'
import { isIndependentPoem } from '../../../constants'

export default function TrendingPoems({ trending, trendingScroll, scrollTrending, navigateToPoem }) {
  const { t } = useLanguage()
  if (!trending || trending.length === 0) return null

  return (
    <section className="animate-fade-in md:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 1 1.133 1 2.867 1 4a5.5 5.5 0 0 1-11 0z" />
          </svg>
          {t('dashboard.trendingPoems')}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => scrollTrending(-1)}
            className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollTrending(1)}
            className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
      <div ref={trendingScroll} className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {trending.map((p) => (
          <button key={p.id} onClick={() => navigateToPoem(p)}
            className="flex-shrink-0 w-48 snap-start rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
            <p className="text-xs font-bold truncate" style={{ color: 'var(--tp-secondary)' }}>{p.author}</p>
            <p className="text-sm font-bold leading-tight mt-1" style={{ color: 'var(--tp-text)' }}>{p.title}</p>
            <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--tp-text-secondary)' }}>
              {p.content.split('\n')[0]}...
            </p>
            <div className="flex items-center gap-1 mt-2">
              {isIndependentPoem(p) ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{p.likes?.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-text-secondary) 12%, transparent)', color: 'var(--tp-text-secondary)' }}>
                  {t('poetry.historic')}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
