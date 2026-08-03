import { usePoetry } from './PoetryContext'
import { useLanguage } from '../language/LanguageProvider'

export default function PoetryView({ onBack }) {
  const { currentPoem, expanded, setExpanded } = usePoetry()
  const { t } = useLanguage()

  if (!currentPoem) return null

  if (!expanded) {
    return (
      <div className="text-center py-6">
        <button
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--tp-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('poetry.readFullPoem')}
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-6 animate-fade-in"
      style={{
        backgroundColor: 'var(--tp-surface)',
        border: '1.5px solid var(--tp-border)',
        boxShadow: 'var(--tp-card-shadow)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {currentPoem.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(false)}
            className="p-1.5 rounded-lg transition-colors hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
            aria-label={t('poetry.collapse')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: 'var(--tp-text)', fontFamily: '"Inter", system-ui, sans-serif' }}
      >
        {currentPoem.content}
      </p>
    </div>
  )
}
