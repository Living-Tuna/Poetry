import { useLanguage } from '../../../language/LanguageProvider'
import { ClockIcon } from '../Icons'

export default function LatestPoems({ latest, navigateToPoem }) {
  const { t, lang } = useLanguage()

  if (!latest || latest.length === 0) return null

  const mid = Math.ceil(latest.length / 2)

  return (
    <section className="animate-fade-in md:col-span-2">
      <h3 className="text-sm font-bold flex items-center justify-center gap-1.5 mb-3" style={{ color: 'var(--tp-text)' }}>
        <ClockIcon size={16} /> {t('dashboard.latestPoems')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          {latest.slice(0, mid).map((p) => (
            <PoemRow key={p.id} poem={p} onClick={navigateToPoem} lang={lang} />
          ))}
        </div>
        <div className="space-y-2">
          {latest.slice(mid).map((p) => (
            <PoemRow key={p.id} poem={p} onClick={navigateToPoem} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PoemRow({ poem, onClick, lang }) {
  const { t } = useLanguage()
  return (
    <button onClick={() => onClick(poem)}
      className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
      style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
      <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{poem.title}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{poem.created_at ? new Date(poem.created_at).toLocaleDateString(lang || 'en-US') : ''}</p>
        <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{t('common.byAuthor', { author: poem.author })}</span>
      </div>
    </button>
  )
}
