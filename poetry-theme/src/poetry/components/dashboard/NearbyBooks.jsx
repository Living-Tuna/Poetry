import { useLanguage } from '../../../language/LanguageProvider'
import { BookIcon } from '../Icons'

function compactDist(km, t) {
  if (km === null || km === undefined) return '—'
  if (km < 1) return t('dist.under1Km')
  if (km < 1000) return t('dist.tildeKm', { km: Math.round(km) })
  return t('dist.tildeKkm', { km: (km / 1000).toFixed(1).replace(/\.0$/, '') })
}

export default function NearbyBooks({ nearby, onNavigate, onOpenBlendBook }) {
  const { t } = useLanguage()

  if (!nearby || nearby.length === 0) return null

  return (
    <section className="animate-fade-in md:col-start-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
          <BookIcon size={16} /> {t('dashboard.booksNearYou')}
        </h3>
        <button onClick={() => onNavigate('blend')}
          className="text-xs font-medium transition-all hover:opacity-70"
          style={{ color: 'var(--tp-secondary)' }}>
          {t('dashboard.openBlend')}
        </button>
      </div>
      <p className="text-[10px] mb-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>
        {t('dashboard.identitiesPrivate')}
      </p>
      <div className="space-y-2">
        {nearby.slice(0, 4).map((book, i) => {
          const near = book.holders.filter((x) => !x.isSelf && x.distanceKm !== null)[0]
          const km = near ? near.distanceKm : null
          const pages = book.holders[0]?.h?.page_count || ''
          return (
            <button key={i}
              onClick={() => onOpenBlendBook ? onOpenBlendBook(book) : onNavigate('blend')}
              className="w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>
                  {book.title}
                </p>
                {book.author && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--tp-text-secondary)' }}>{book.author}</p>
                )}
                {pages && (
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>
                    {t('shelf.pages', { count: pages })}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-[10px] font-semibold" style={{ color: 'var(--tp-secondary)' }}>{compactDist(km, t)}</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'var(--tp-text-secondary)', opacity: 0.6 }}>{t('dashboard.status')}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
