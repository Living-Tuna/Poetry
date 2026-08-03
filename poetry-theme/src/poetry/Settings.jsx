import { useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { themeList } from '../theme/themes'
import LocationFields from './components/LocationFields'
import { usePoetry } from './PoetryContext'
import { supabase } from '../supabase/client'
import { useAuth } from '../auth/AuthContext'
import { LANGUAGE_CODES } from '../constants/languagecode'
import { getLanguageName } from '../constants/languages'
import { useLanguage } from '../language/LanguageProvider'

function GlobeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function PaletteIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a10 10 0 1 1 10-10c0 1.66-1.34 3-3 3h-2.5a2 2 0 0 0-1.5 3.33A2 2 0 0 1 12 22z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="15" cy="7.5" r="1" fill="currentColor" />
      <circle cx="17.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  )
}

function PinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0 transition-transform duration-300"
      style={{ color: 'var(--tp-text-secondary)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SettingCard({ icon, title, value, open, onClick, children }) {
  return (
    <div className="rounded-2xl transition-shadow" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: open ? 'var(--tp-card-shadow)' : 'none' }}>
      <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-opacity hover:opacity-90">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)', color: 'var(--tp-secondary)' }}>
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold" style={{ color: 'var(--tp-text)' }}>{title}</span>
          <span className="block text-xs truncate" style={{ color: 'var(--tp-text-secondary)' }}>{value}</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Settings({ onNavigate }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { themeId, setTheme } = useTheme()
  const { changeLanguage } = usePoetry()
  const savedLang = localStorage.getItem('poetry_lang') || 'en'
  const savedCountry = localStorage.getItem('poetry_country') || ''
  const savedState = localStorage.getItem('poetry_state') || ''
  const savedZip = localStorage.getItem('poetry_zip') || ''
  const [lang, setLang] = useState(savedLang)
  const [country, setCountry] = useState(savedCountry)
  const [state, setState] = useState(savedState)
  const [zip, setZip] = useState(savedZip)
  const [openCard, setOpenCard] = useState(null)
  const currentTheme = themeList.find((t) => t.id === themeId)

  function toggleCard(name) {
    setOpenCard((prev) => (prev === name ? null : name))
  }

  function handleSave() {
    localStorage.setItem('poetry_lang', lang)
    changeLanguage(lang)
    if (country) localStorage.setItem('poetry_country', country)
    if (state) localStorage.setItem('poetry_state', state)
    if (zip) localStorage.setItem('poetry_zip', zip)
    if (country && state && zip && user) {
      supabase.auth.updateUser({
        data: {
          country,
          state,
          zip,
          lat: localStorage.getItem('poetry_lat') || '',
          lng: localStorage.getItem('poetry_lng') || '',
        },
      }).catch(() => {})
    }
    onNavigate('dashboard')
  }

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
          {t('settings.title')}
        </h2>
      </div>

      <div className="space-y-3">
        {/* Language */}
        <SettingCard
          icon={<GlobeIcon />}
          title={t('settings.language')}
          value={getLanguageName(lang) || lang}
          open={openCard === 'lang'}
          onClick={() => toggleCard('lang')}>
          <div className="space-y-1">
            {LANGUAGE_CODES.map((code) => (
              <button key={code} onClick={() => { setLang(code); setOpenCard(null) }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: lang === code ? 'var(--tp-secondary)' : 'var(--tp-bg)',
                  color: lang === code ? '#fff' : 'var(--tp-text)',
                  border: `1.5px solid ${lang === code ? 'var(--tp-secondary)' : 'var(--tp-border)'}`,
                }}>
                {getLanguageName(code)}
              </button>
            ))}
          </div>
        </SettingCard>

        {/* Theme */}
        <SettingCard
          icon={<PaletteIcon />}
          title={t('settings.theme')}
          value={currentTheme ? `${currentTheme.emoji}  ${currentTheme.label}` : t('common.default')}
          open={openCard === 'theme'}
          onClick={() => toggleCard('theme')}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {themeList.map((t) => {
              const isActive = themeId === t.id
              const preview = t.css
              return (
                <button key={t.id} onClick={() => { setTheme(t.id); setOpenCard(null) }}
                  className={`relative rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'ring-2 scale-[1.02]' : 'hover:shadow-md'}`}
                  style={{
                    backgroundColor: preview['--tp-surface'],
                    border: `1.5px solid ${isActive ? preview['--tp-secondary'] : preview['--tp-border']}`,
                  }}>
                  {isActive && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: preview['--tp-secondary'] }} />}
                  <span className="text-xl block mb-1">{t.emoji}</span>
                  <p className="text-xs font-semibold truncate" style={{ color: preview['--tp-text'], fontFamily: '"Playfair Display", serif' }}>{t.label}</p>
                  <div className="flex gap-1 mt-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preview['--tp-secondary'] }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preview['--tp-tertiary'] }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preview['--tp-accent'] }} />
                  </div>
                </button>
              )
            })}
          </div>
        </SettingCard>
        {/* Location */}
        <SettingCard
          icon={<PinIcon />}
          title={t('settings.location')}
          value={[country, state].filter(Boolean).join(' · ') || t('settings.notSet')}
          open={openCard === 'location'}
          onClick={() => toggleCard('location')}>
          <LocationFields
            country={country} setCountry={setCountry}
            state={state} setState={setState}
            zip={zip} setZip={setZip}
            autoDetect={false}
          />
        </SettingCard>
      </div>

      <button onClick={handleSave}
        className="w-full mt-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
        style={{ backgroundColor: 'var(--tp-secondary)', borderRadius: 'var(--tp-btn-radius, 0.75rem)' }}>
        {t('settings.save')}
      </button>
    </div>
  )
}
