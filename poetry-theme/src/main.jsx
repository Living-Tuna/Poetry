import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from './theme/ThemeContext'
import { AuthProvider } from './auth/AuthContext'
import { PoetryProvider } from './poetry/PoetryContext'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PoetryProvider>
          <App />
        </PoetryProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
