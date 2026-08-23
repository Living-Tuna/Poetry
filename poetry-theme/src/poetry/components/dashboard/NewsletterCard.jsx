import { useLanguage } from '../../../language/LanguageProvider'

export default function NewsletterCard({ email, setEmail, state, onSubmit }) {
  const { t } = useLanguage()

  return (
    <section className="animate-fade-in md:col-start-2">
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {t('dashboard.joinNewsletter')}
        </h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
          {t('dashboard.newsletterBlurb')}
        </p>
        {state === 'done' ? (
          <p className="text-sm mt-3 font-medium flex items-center gap-1.5" style={{ color: 'var(--tp-secondary)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('dashboard.newsletterSuccess')}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-3 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('dashboard.emailPlaceholder')}
              required
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
            />
            <button type="submit" disabled={state === 'submitting'}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex-shrink-0"
              style={{ backgroundColor: 'var(--tp-secondary)' }}>
              {state === 'submitting' ? t('dashboard.joining') : t('dashboard.join')}
            </button>
          </form>
        )}
        {state === 'error' && (
          <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{t('dashboard.newsletterFailed')}</p>
        )}
      </div>
    </section>
  )
}
