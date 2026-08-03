import { usePoetry } from './PoetryContext'
import { useLanguage } from '../language/LanguageProvider'
import { SparkleIcon } from './components/Icons'
import { isIndependentPoem } from '../constants'

export default function PoetryCard() {
  const {
    queue, index, swipeRight, swipeLeft,
    canSwipeLeft, canSwipeRight, openFullscreen,
    toggleLikePoem, hasLiked,
  } = usePoetry()
  const { t } = useLanguage()

  const poem = queue[index] || null

  if (!poem) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl"
        style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
        <p className="flex items-center gap-1.5" style={{ color: 'var(--tp-text-secondary)' }}><SparkleIcon size={14} /> {t('poetry.noMorePoems')}</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.01]"
      style={{
        backgroundColor: 'var(--tp-surface)',
        border: '1.5px solid var(--tp-border)',
        boxShadow: 'var(--tp-card-shadow)',
      }}
      onClick={openFullscreen}
    >
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: 'var(--tp-secondary)' }}>
            {poem.author.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
              {poem.author}
            </h3>
            <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.75rem' }}>{poem.date || ''}</p>
          </div>
        </div>
        <h2 className="text-lg font-bold leading-tight"
          style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {poem.title}
        </h2>
      </div>
      <div className="px-5 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-line line-clamp-5"
          style={{ color: 'var(--tp-text-secondary)', fontFamily: '"Inter", system-ui, sans-serif' }}>
          {poem.content.split('\n').slice(0, 5).join('\n')}
        </p>
        <p className="text-xs mt-1.5 italic" style={{ color: 'var(--tp-muted, #94a3b8)' }}>{t('poetry.tapToRead')}</p>
      </div>
      <div className="px-5 pb-4 flex items-center justify-between border-t" style={{ borderColor: 'var(--tp-border)' }}>
        <div className="flex items-center gap-1.5">
          {isIndependentPoem(poem) ? (
            <button onClick={(e) => { e.stopPropagation(); toggleLikePoem(poem) }}
              className="flex items-center gap-1.5 transition-all active:scale-90"
              style={{ color: 'var(--tp-text-secondary)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={hasLiked(poem.id) ? '#f59e0b' : 'none'}
                stroke={hasLiked(poem.id) ? 'none' : 'currentColor'} strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-medium">{(poem.likes ?? 0).toLocaleString()}</span>
            </button>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-text-secondary) 12%, transparent)', color: 'var(--tp-text-secondary)' }}>
              {t('poetry.historic')}
            </span>
          )}
        </div>
        <div className="flex gap-2 z-20 relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => swipeLeft()}
            disabled={!canSwipeLeft}
            className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:scale-110 active:scale-90"
            style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => swipeRight()}
            disabled={!canSwipeRight}
            className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:scale-110 active:scale-90"
            style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
