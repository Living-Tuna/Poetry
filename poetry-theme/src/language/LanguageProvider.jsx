import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translate, setCurrentLang } from './translator'

const LanguageContext = createContext(null)

const RTL_CODES = new Set(['ar', 'fa', 'prs', 'ur', 'he', 'dv', 'ps'])

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    let code = ''
    try { code = localStorage.getItem('poetry_lang') } catch {}
    const c = code || 'en'
    setCurrentLang(c)
    return c
  })

  const setLang = useCallback((code) => {
    if (!code) return
    setLangState(code)
    try { localStorage.setItem('poetry_lang', code) } catch {}
  }, [])

  useEffect(() => {
    setCurrentLang(lang)
    try {
      document.documentElement.setAttribute('lang', lang)
      document.documentElement.setAttribute('dir', RTL_CODES.has(lang) ? 'rtl' : 'ltr')
    } catch {}
  }, [lang])

  const t = useCallback((key, vars) => translate(key, vars), [])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
