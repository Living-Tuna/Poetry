import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import PoetryDashboard from './poetry/PoetryDashboard'
import GoogleCallback from './auth/GoogleCallback'

const DEFAULT_LANG = 'en'

// Keep the query string (e.g. the single-use OAuth ?code=) when bouncing
// "/" to /{lang} — stripping it here would break Google sign-in callbacks.
function LangRedirect({ keepQuery = false }) {
  const location = useLocation()
  const lang = localStorage.getItem('poetry_lang') || DEFAULT_LANG
  return <Navigate to={`/${lang}${keepQuery ? location.search : ''}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LangRedirect keepQuery />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/poem/:id/:slug" element={<PoetryDashboard />} />
      <Route path="/poem/:id" element={<PoetryDashboard />} />
      <Route path="/:view" element={<PoetryDashboard />} />
      <Route path="*" element={<LangRedirect />} />
    </Routes>
  )
}
