import { useLanguage } from '../../../language/LanguageProvider'
import { SITE_NAME } from '../../../constants'

function formatCount(n) {
  if (!n) return '0'
  if (n < 1000) return String(n)
  if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k'
  return (n / 1000000).toFixed(n < 10000000 ? 1 : 0).replace(/\.0$/, '') + 'm'
}

function StatCell({ value, label }) {
  return (
    <div className="rounded-xl px-3 py-2.5 text-center"
      style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
      <p className="text-lg font-bold leading-tight"
        style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>
        {value}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>{label}</p>
    </div>
  )
}

export default function StatsHero({ user, stats, onlineCount, newsletterCount, setSlideOpen, setAuthMode, btnWhite }) {
  const { t } = useLanguage()

  return (
    <div className="text-center animate-fade-in md:col-start-2">
      {user ? (
        <>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{t('dashboard.welcomeBack')}</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>{user.name}</h2>
        </>
      ) : (
        <>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{t('dashboard.welcomeTo', { site: SITE_NAME })}</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>{t('dashboard.discoverCreate')}</h2>
          <button onClick={() => { setSlideOpen(true); setAuthMode('signup') }}
            style={{ ...btnWhite, width: 'auto', padding: '0.5rem 1.5rem', marginTop: '0.75rem', display: 'inline-block' }}>
            {t('dashboard.signInToSave')}
          </button>
        </>
      )}

      {stats && (
        <div className="mt-5">
          <div className="grid grid-cols-3 gap-2">
            <StatCell value={formatCount(stats.total_users)} label={t('dashboard.users')} />
            <StatCell value={formatCount(stats.active_users)} label={t('dashboard.active')} />
            <StatCell value={formatCount(stats.total_poems)} label={t('dashboard.writings')} />
            <StatCell value={formatCount(stats.independent_poems)} label={t('dashboard.independentWritings')} />
            <StatCell value={formatCount(onlineCount)} label={t('dashboard.onlineNow')} />
            <StatCell value={formatCount(newsletterCount)} label={t('dashboard.newsletterEntries')} />
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>
            <span>{t('dashboard.historicCount', { count: formatCount(stats.historic_poems) })}</span>
          </div>
        </div>
      )}

      <div className="mt-5 mx-auto max-w-md px-4 py-4 rounded-xl animate-fade-in"
        style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 8%, transparent)', border: '1.5px solid var(--tp-border)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {t('dashboard.heroMission')}
        </p>
        <p className="text-[11px] mt-2 font-medium" style={{ color: 'var(--tp-text-secondary)' }}>
          {t('dashboard.heroSafety')}
        </p>
      </div>
    </div>
  )
}
