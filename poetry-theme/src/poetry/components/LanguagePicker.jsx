import { COUNTRIES, getLanguagesForCountry } from '../../constants/languages'
import { useLanguage } from '../../language/LanguageProvider'

export default function LanguagePicker({ open, lang, onSelect, onClose }) {
  const { t } = useLanguage()
  if (!open) return null
  const savedCountry = localStorage.getItem('poetry_country') || ''
  const countryEntry = Object.entries(COUNTRIES).find(([, v]) => v.name === savedCountry)
  const countryCode = countryEntry?.[0] || (savedCountry === 'India' ? 'IN' : 'US')
  const languages = getLanguagesForCountry(countryCode)

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div onClick={(e) => e.stopPropagation()}
        className="absolute top-14 right-4 w-64 rounded-2xl p-3 shadow-xl animate-fade-in"
        style={{
          backgroundColor: 'var(--tp-surface)',
          border: '1.5px solid var(--tp-border)',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}>
        <p className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--tp-text-secondary)' }}>
          {COUNTRIES[countryCode]?.name || t('language.title')}
        </p>
        <div className="space-y-0.5">
          {languages.map((l) => (
            <button key={l.code} onClick={() => onSelect(l.code)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3"
              style={{
                backgroundColor: lang === l.code ? 'var(--tp-secondary)' : 'transparent',
                color: lang === l.code ? '#fff' : 'var(--tp-text)',
              }}>
              <span className="flex-1">{l.name}</span>
              <span className="text-[11px]" style={{ color: lang === l.code ? 'rgba(255,255,255,0.7)' : 'var(--tp-text-secondary)' }}>
                {l.nativeName}
              </span>
              {lang === l.code && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
          {languages.length === 0 && (
            <p className="text-xs px-3 py-2" style={{ color: 'var(--tp-text-secondary)' }}>
              {t('language.empty')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
