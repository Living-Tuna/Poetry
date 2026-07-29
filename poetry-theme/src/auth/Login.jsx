import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function Login({ onNavigate }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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
              type="submit" disabled={busy}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: 'var(--tp-secondary)' }}
            >
              {busy ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

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
