import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function ForgotPassword({ onNavigate }) {
  const { getUserSecurityQuestion, verifySecurityAnswer, resetPassword } = useAuth()
  const [step, setStep] = useState('username')
  const [username, setUsername] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleLookup(e) {
    e.preventDefault()
    setError('')
    if (!username.trim()) { setError('Enter your username'); return }
    setBusy(true)
    const q = await getUserSecurityQuestion(username.trim())
    setBusy(false)
    if (!q) { setError('No security question found for this user'); return }
    setQuestion(q)
    setStep('verify')
  }

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    if (!answer.trim()) { setError('Enter your answer'); return }
    setBusy(true)
    const res = await verifySecurityAnswer(username.trim(), answer.trim())
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    setStep('reset')
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setBusy(true)
    const res = await resetPassword(username.trim(), answer.trim(), newPassword)
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    onNavigate('login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--tp-bg)' }}>
      <div className="w-full max-w-sm" style={{ backgroundColor: 'var(--tp-surface)', borderRadius: '1rem', boxShadow: 'var(--tp-card-shadow)' }}>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
              {step === 'reset' ? 'Reset Password' : 'Forgot Password'}
            </h1>
            <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {step === 'username' && 'Enter your username to find your account'}
              {step === 'verify' && 'Answer your security question'}
              {step === 'reset' && 'Choose a new password'}
            </p>
          </div>

          {step === 'username' && (
            <form onSubmit={handleLookup} className="space-y-4">
              <input value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                placeholder="Your username" autoFocus
              />
              {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
              <button type="submit" disabled={busy}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: 'var(--tp-secondary)' }}>
                {busy ? 'Looking up...' : 'Find Account'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}>
                <p className="font-medium mb-1">Security Question:</p>
                <p>{question}</p>
              </div>
              <input value={answer} onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                placeholder="Your answer" autoFocus
              />
              {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
              <button type="submit" disabled={busy}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: 'var(--tp-secondary)' }}>
                {busy ? 'Checking...' : 'Verify Answer'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                placeholder="New password (min 6 chars)" autoFocus
              />
              {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
              <button type="submit" disabled={busy}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: 'var(--tp-secondary)' }}>
                {busy ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <button onClick={() => onNavigate('login')} style={{ color: 'var(--tp-secondary)' }}
              className="font-medium transition-colors hover:opacity-70">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
