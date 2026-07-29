import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { themes, themeList, applyThemeVars } from './themes'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'poetry-theme-preference'

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState('spring')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && themes[saved]) setThemeId(saved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyThemeVars(document.documentElement, themeId)
    localStorage.setItem(STORAGE_KEY, themeId)
  }, [themeId, mounted])

  const setTheme = useCallback((id) => {
    if (themes[id]) setThemeId(id)
  }, [])

  const ctx = useMemo(() => ({
    theme: themes[themeId],
    themeId,
    setTheme,
    themeList,
  }), [themeId, setTheme])

  return (
    <ThemeContext.Provider value={ctx}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
