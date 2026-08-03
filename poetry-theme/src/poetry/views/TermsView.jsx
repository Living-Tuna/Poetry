import { useLanguage } from '../../language/LanguageProvider'

export default function TermsView({ onNavigate }) {
  const { t } = useLanguage()
  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }} aria-label={t('common.back')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {t('terms.title')}
        </h2>
      </div>

      <div className="space-y-6 pb-4">
        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>{t('terms.acceptanceHeading')}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('terms.acceptanceBody')}
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>{t('terms.disclaimerHeading')}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('terms.disclaimerBody')}
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>{t('terms.responsibilitiesHeading')}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('terms.responsibilitiesBody')}
          </p>
        </section>

        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--tp-text)' }}>{t('terms.terminationHeading')}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('terms.terminationBody')}
          </p>
        </section>
      </div>
    </div>
  )
}
