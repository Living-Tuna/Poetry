import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { useLanguage } from './language/LanguageProvider'
import PoetryDashboard from './poetry/PoetryDashboard'
import LoadingScreen from './components/LoadingScreen'

const DEFAULT_LANG = 'en'

export default function App() {
  const { loading } = useAuth()
  const { t } = useLanguage()

  if (loading) {
    return <LoadingScreen text={t('common.loading')} />
  }

  const savedLang = localStorage.getItem('poetry_lang') || DEFAULT_LANG

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${savedLang}`} replace />} />
      <Route path="/:view" element={<PoetryDashboard />} />
      <Route path="*" element={<Navigate to={`/${savedLang}`} replace />} />
    </Routes>
  )
}
