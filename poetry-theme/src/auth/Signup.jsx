import { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

export default function Signup({ onNavigate }) {
  const { signup, checkUsername } = useAuth()
  const [step, setStep] = useState('username')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [retype, setRetype] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [usernameCheck, setUsernameCheck] = useState({ state: 'idle', suggestions: [] })
  const checkTimer = useRef(null)

  useEffect(() => {
    const u = username.trim().toLowerCase()
    if (!u || u.length < 3) { setUsernameCheck({ state: 'idle', suggestions: [] }); return }
    clearTimeout(checkTimer.current)
    setUsernameCheck((p) => p.state === 'checking' ? p : { ...p, state: 'checking' })
    checkTimer.current = setTimeout(async () => {
      const res = await checkUsername(u)
      if (res.available) {
        setUsernameCheck({ state: 'available', suggestions: [] })
      } else {
        setUsernameCheck({ state: 'taken', suggestions: res.suggestions ?? [] })
      }
    }, 400)
    return () => clearTimeout(checkTimer.current)
  }, [username, checkUsername])

  function goStep1() { setStep('username') }
  function goStep2() { setStep('details') }

  function handleDetails(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Enter your display name'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== retype) { setError('Passwords do not match'); return }
    setStep('security')
  }

  async function handleComplete(e) {
    e.preventDefault()
    setError('')
    if (!question.trim() || !answer.trim()) { setError('Fill both fields'); return }
    setBusy(true)
    const res = await signup(username.trim(), password, name.trim(), question.trim(), answer.trim())
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    onNavigate('login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--tp-bg)' }}>
      <div className="w-full max-w-sm" style={{ backgroundColor: 'var(--tp-surface)', borderRadius: '1rem', boxShadow: 'var(--tp-card-shadow)' }}>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {['username', 'details', 'security'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  backgroundColor: step === s ? 'var(--tp-secondary)' : 'var(--tp-bg)',
                  color: step === s ? '#fff' : 'var(--tp-text-secondary)',
                  border: '1.5px solid var(--tp-border)',
                }}>
                {i + 1}
              </div>
              {i < 2 && <div style={{ width: '2rem', height: '1.5px', backgroundColor: 'var(--tp-border)' }} />}
            </div>
          ))}
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">✍️</div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
              Join Poetry
            </h1>
            <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {step === 'username' && 'Choose a unique username'}
              {step === 'details' && 'Set up your profile'}
              {step === 'security' && 'Set a security question'}
            </p>
          </div>

          {step === 'username' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Username</label>
                <div className="relative">
                  <input value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ''))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                    placeholder="Choose a username (min 3 chars)" autoFocus
                  />
                  {usernameCheck.state === 'checking' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--tp-text-secondary)' }}>checking...</span>
                  )}
                  {usernameCheck.state === 'available' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#22c55e' }}>✓ available</span>
                  )}
                  {usernameCheck.state === 'taken' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#ef4444' }}>✗ taken</span>
                  )}
                </div>
              </div>

              {usernameCheck.state === 'taken' && usernameCheck.suggestions.length > 0 && (
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--tp-text-secondary)' }}>Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {usernameCheck.suggestions.map((s) => (
                      <button key={s} onClick={() => { setUsername(s); setUsernameCheck({ state: 'checking', suggestions: [] }) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
                        style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-secondary)', border: '1px solid var(--tp-border)' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}

              <button onClick={goStep2} disabled={usernameCheck.state !== 'available'}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: usernameCheck.state === 'available' ? 'var(--tp-secondary)' : 'var(--tp-border)' }}>
                Continue
              </button>

              <div className="text-center text-sm">
                <span style={{ color: 'var(--tp-text-secondary)' }}>Already have an account? </span>
                <button onClick={() => onNavigate('login')} className="font-medium transition-colors hover:opacity-70"
                  style={{ color: 'var(--tp-secondary)' }}>Sign In</button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleDetails} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Display Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                  placeholder="How others see you" autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Retype Password</label>
                <input type="password" value={retype} onChange={(e) => setRetype(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                  placeholder="Re-enter password"
                />
              </div>
              {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={goStep1}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text-secondary)', border: '1.5px solid var(--tp-border)' }}>
                  Back
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--tp-secondary)' }}>
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 'security' && (
            <form onSubmit={handleComplete} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Security Question</label>
                <input value={question} onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                  placeholder="e.g. What was your first pet's name?" autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--tp-text)' }}>Your Answer</label>
                <input value={answer} onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--tp-secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--tp-border)'}
                  placeholder="Enter your answer"
                />
              </div>
              {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={goStep2}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text-secondary)', border: '1.5px solid var(--tp-border)' }}>
                  Back
                </button>
                <button type="submit" disabled={busy}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                  style={{ backgroundColor: 'var(--tp-secondary)' }}>
                  {busy ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
