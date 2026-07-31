import { useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { themeList } from '../theme/themes'
import LocationFields from './components/LocationFields'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
]

export default function Settings({ onClose }) {
  const { themeId, setTheme } = useTheme()
  const savedLang = localStorage.getItem('poetry_lang') || 'en'
  const savedCountry = localStorage.getItem('poetry_country') || ''
  const savedState = localStorage.getItem('poetry_state') || ''
  const savedZip = localStorage.getItem('poetry_zip') || ''
  const [lang, setLang] = useState(savedLang)
  const [country, setCountry] = useState(savedCountry)
  const [state, setState] = useState(savedState)
  const [zip, setZip] = useState(savedZip)

  function handleSave() {
    localStorage.setItem('poetry_lang', lang)
    if (country) localStorage.setItem('poetry_country', country)
    if (state) localStorage.setItem('poetry_state', state)
    if (zip) localStorage.setItem('poetry_zip', zip)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[80vh] overflow-y-auto animate-fade-in"
        style={{
          backgroundColor: 'var(--tp-surface)',
          border: '1.5px solid var(--tp-border)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            Settings
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-colors hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Language */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--tp-text)' }}>Language</p>
          <div className="space-y-1">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: lang === l.code ? 'var(--tp-secondary)' : 'var(--tp-bg)',
                  color: lang === l.code ? '#fff' : 'var(--tp-text)',
                  border: `1.5px solid ${lang === l.code ? 'var(--tp-secondary)' : 'var(--tp-border)'}`,
                }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--tp-text)' }}>Location</p>
          <LocationFields
            country={country} setCountry={setCountry}
            state={state} setState={setState}
            zip={zip} setZip={setZip}
          />
        </div>

        {/* Theme */}
        <div className="mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--tp-text)' }}>Theme</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themeList.map((t) => {
              const isActive = themeId === t.id
              const preview = t.css
              return (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`relative rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'ring-2 scale-[1.02]' : 'hover:shadow-md'}`}
                  style={{
                    backgroundColor: preview['--tp-surface'],
                    border: `1.5px solid ${isActive ? preview['--tp-secondary'] : preview['--tp-border']}`,
                  }}>
                  {isActive && <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: preview['--tp-secondary'] }} />}
                  <span className="text-2xl block mb-2">{t.emoji}</span>
                  <p className="text-sm font-semibold truncate" style={{ color: preview['--tp-text'], fontFamily: '"Playfair Display", serif' }}>{t.label}</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preview['--tp-secondary'] }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preview['--tp-tertiary'] }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preview['--tp-accent'] }} />
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: preview['--tp-text-secondary'] }}>{isActive ? 'Active' : t.id}</p>
                </button>
              )
            })}
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full mt-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--tp-secondary)', borderRadius: 'var(--tp-btn-radius, 0.75rem)' }}>
          Save
        </button>
      </div>
    </div>
  )
}
