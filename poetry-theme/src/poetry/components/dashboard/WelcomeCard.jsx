import { useLanguage } from '../../../language/LanguageProvider'

export default function WelcomeCard({ onSignUp }) {
  const { t } = useLanguage()

  const features = [
    { icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ), key: 'dashboard.welcomeFeatureRead' },
    { icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ), key: 'dashboard.welcomeFeatureShare' },
    { icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ), key: 'dashboard.welcomeFeatureDiscover' },
  ]

  return (
    <section className="animate-fade-in md:col-start-1">
      <div className="rounded-2xl p-8 text-center md:text-left"
        style={{
          backgroundColor: 'var(--tp-surface)',
          border: '1.5px solid var(--tp-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}>
        <div className="flex justify-center md:justify-start mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)', color: 'var(--tp-secondary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold leading-tight"
          style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {t('dashboard.welcomeHeading')}
        </h2>
        <p className="text-sm mt-2 leading-relaxed"
          style={{ color: 'var(--tp-text-secondary)' }}>
          {t('dashboard.welcomeSubtitle')}
        </p>

        <div className="my-6 mx-auto md:mx-0 w-16 h-px" style={{ backgroundColor: 'var(--tp-border)' }} />

        <p className="text-base md:text-lg font-medium leading-relaxed"
          style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {t('dashboard.welcomeTagline')}
        </p>

        <div className="mt-6 space-y-3">
          {features.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 10%, transparent)', color: 'var(--tp-secondary)' }}>
                {f.icon}
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--tp-text-secondary)' }}>
                {t(f.key)}
              </p>
            </div>
          ))}
        </div>

        <button onClick={onSignUp}
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
          style={{ backgroundColor: 'var(--tp-secondary)' }}>
          {t('dashboard.signInToSave')}
        </button>
      </div>
    </section>
  )
}
