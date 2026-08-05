import { Routes, Route, Navigate } from 'react-router-dom'
import PoetryDashboard from './poetry/PoetryDashboard'

const DEFAULT_LANG = 'en'

export default function App() {
  const savedLang = localStorage.getItem('poetry_lang') || DEFAULT_LANG

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${savedLang}`} replace />} />
      <Route path="/:view" element={<PoetryDashboard />} />
      <Route path="*" element={<Navigate to={`/${savedLang}`} replace />} />
    </Routes>
  )
}
