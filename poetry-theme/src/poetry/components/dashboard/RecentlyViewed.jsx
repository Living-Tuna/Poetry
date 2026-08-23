import { useLanguage } from '../../../language/LanguageProvider'
import { ClockIcon } from '../Icons'

export default function RecentlyViewed({ items, navigateToPoem }) {
  const { t } = useLanguage()

  if (!items || items.length === 0) return null

  return (
    <section className="animate-fade-in md:col-start-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
          <ClockIcon size={16} /> {t('dashboard.recentlyViewed')}
        </h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.slice(0, 6).map((p) => (
          <button key={`rec-${p.id}`} onClick={() => navigateToPoem(p)}
            className="flex-shrink-0 w-40 snap-start rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
            <p className="text-xs font-bold truncate" style={{ color: 'var(--tp-secondary)' }}>{p.author}</p>
            <p className="text-sm font-bold leading-tight mt-1 line-clamp-2" style={{ color: 'var(--tp-text)' }}>{p.title}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--tp-text-secondary)' }}>{p.date || p.createdAt || ''}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
