import { useLanguage } from '../../../language/LanguageProvider'
import { PenIcon } from '../Icons'
import DataIndicator from '../DataIndicator'

export default function MyWritings({ user, myPoems, myPoemsCachedOnly, navigateToPoem, onNewPoem, onNavigate }) {
  const { t } = useLanguage()

  return (
    <section className="animate-fade-in md:col-start-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
            <PenIcon size={16} /> {t('dashboard.myWritings')}</h3>
          {user && <DataIndicator cachedOnly={myPoemsCachedOnly} size={10} />}
        </div>
        <button onClick={onNewPoem}
          className="text-xs px-3 py-1 rounded-lg font-medium transition-all hover:opacity-70"
          style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)' }}>
          {t('dashboard.new')}
        </button>
      </div>
      {myPoems.length === 0 ? (
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{t('dashboard.noWritingsTap')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myPoems.slice(0, 4).map((p) => (
            <button key={p.id} onClick={() => navigateToPoem(p)}
              className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
              <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{p.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.createdAt}</p>
                <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{t('common.byAuthor', { author: p.author })}</span>
              </div>
            </button>
          ))}
          {myPoems.length > 4 && (
            <button onClick={() => onNavigate('my-writings')}
              className="w-full text-center text-xs py-2 rounded-xl transition-colors"
              style={{ color: 'var(--tp-secondary)' }}>
              {t('dashboard.viewAllWritings', { count: myPoems.length })}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
