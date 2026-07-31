import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import PoetryDashboard from './poetry/PoetryDashboard'
import LanguageOnboarding from './poetry/components/LanguageOnboarding'

export default function App() {
  const { loading } = useAuth()
  const location = useLocation()
  const savedLang = localStorage.getItem('poetry_lang')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--tp-bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-transparent border-t-white animate-spin"
            style={{ borderTopColor: 'var(--tp-secondary)' }}
          />
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!savedLang) {
    return <LanguageOnboarding />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${savedLang}`} replace />} />
      <Route path="/:view" element={<PoetryDashboard />} />
      <Route path="*" element={<Navigate to={`/${savedLang}`} replace />} />
    </Routes>
  )
}
