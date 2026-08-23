import { useState } from 'react'
import { useAuth } from './AuthContext'
import { signInWithGoogle } from '../google/auth-consent'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function Login({ onNavigate }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)

  async function handleGoogle() {
    setError('')
    setGoogleBusy(true)
    const res = await signInWithGoogle()
    if (!res.ok) {
      setGoogleBusy(false)
      setError(res.error)
    }
    // On success the browser redirects to Google's consent screen.
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) { setError('Fill all fields'); return }
    setBusy(true)
    const res = await login(username.trim(), password)
    setBusy(false)
    if (!res.ok) setError(res.error)
    else onNavigate?.('poetry')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--tp-bg)' }}>
      <div className="w-full max-w-sm" style={{ backgroundColor: 'var(--tp-surface)', borderRadius: '1rem', boxShadow: 'var(--tp-card-shadow)' }}>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">📖</div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
              Poetry
            </h1>
            <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Welcome back, poet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Username</label>
              <input
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)',
                  border: '1.5px solid var(--tp-border)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                placeholder="Enter username" autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)',
                  border: '1.5px solid var(--tp-border)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>
            )}

            <button
              type="submit" disabled={busy || googleBusy}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: 'var(--tp-secondary)' }}
            >
              {busy ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--tp-border)' }} />
            <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--tp-text-secondary)' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--tp-border)' }} />
          </div>

          <button
            type="button" onClick={handleGoogle} disabled={busy || googleBusy}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2.5"
            style={{
              backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)',
              border: '1.5px solid var(--tp-border)',
            }}
          >
            <GoogleIcon />
            {googleBusy ? 'Redirecting to Google...' : 'Sign in with Google'}
          </button>

          <div className="mt-6 space-y-3 text-center text-sm">
            <button onClick={() => onNavigate('signup')} className="font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--tp-secondary)' }}>
              Create an account
            </button>
            <br />
            <button onClick={() => onNavigate('forgot')} style={{ color: 'var(--tp-text-secondary)' }}
              className="transition-colors hover:opacity-70">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
