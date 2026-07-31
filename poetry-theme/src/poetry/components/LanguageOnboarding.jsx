import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COUNTRIES } from '../../constants/languages'

export default function LanguageOnboarding() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [step, setStep] = useState('country')

  const countries = Object.entries(COUNTRIES)
    .map(([code, c]) => ({ code, name: c.name, languages: c.languages }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const filtered = search.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countries

  function handleSelectCountry(c) {
    setSelectedCountry(c)
    setStep('language')
  }

  function handleSelectLanguage(langCode) {
    localStorage.setItem('poetry_lang', langCode)
    localStorage.setItem('poetry_country', selectedCountry.name)
    navigate(`/${langCode}`, { replace: true })
  }

  function handleBack() {
    setSelectedCountry(null)
    setStep('country')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)' }}>
      {step === 'country' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  Welcome to Poetry
                </h1>
                <p className="text-sm opacity-70">Select your country to choose a language</p>
              </div>

              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your country..."
                className="w-full max-w-xs px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
                style={{
                  backgroundColor: 'var(--tp-surface)',
                  color: 'var(--tp-text)',
                  border: '1.5px solid var(--tp-border)',
                }}
                autoFocus
              />
              <div className="w-full max-w-xs space-y-1 overflow-y-auto" style={{ maxHeight: '55vh' }}>
                {filtered.map((c) => (
                  <button key={c.code} onClick={() => handleSelectCountry(c)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{ backgroundColor: 'var(--tp-surface)', color: 'var(--tp-text)' }}>
                    {c.name}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--tp-text-secondary)' }}>
                    No countries match your search
                  </p>
                )}
              </div>
            </>
          )}

          {step === 'language' && selectedCountry && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {selectedCountry.name}
                </h1>
                <p className="text-sm opacity-70">Choose your language</p>
              </div>

              <div className="w-full max-w-xs space-y-1 overflow-y-auto" style={{ maxHeight: '55vh' }}>
                {selectedCountry.languages.map((l) => (
                  <button key={l.code} onClick={() => handleSelectLanguage(l.code)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80 flex items-center gap-3"
                    style={{ backgroundColor: 'var(--tp-surface)', color: 'var(--tp-text)' }}>
                    <span className="flex-1">{l.name}</span>
                    <span className="text-[11px]" style={{ color: 'var(--tp-text-secondary)' }}>
                      {l.nativeName !== l.name ? l.nativeName : ''}
                    </span>
                  </button>
                ))}
              </div>

              <button onClick={handleBack}
                className="mt-4 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--tp-text-secondary)' }}>
                ← Back to countries
              </button>
            </>
          )}
    </div>
  )
}
