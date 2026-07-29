import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../theme/ThemeContext'
import { usePoetry } from './PoetryContext'
import PoetryCard from './PoetryCard'
import FullscreenView from './FullscreenView'
import Settings from './Settings'
import { themeList } from '../theme/themes'
import { hookedLines, poets, poems } from '../data/poems'

const trending = [...poems].sort((a, b) => b.likes - a.likes).slice(0, 6)

const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: 'var(--tp-header-text)',
  border: '1.5px solid rgba(255,255,255,0.15)',
  borderRadius: '0.75rem',
  padding: '0.625rem 0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
}
const inputFocus = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.5)' }
const inputBlur = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)' }
const btnWhite = {
  width: '100%', padding: '0.625rem', borderRadius: '0.75rem',
  fontSize: '0.875rem', fontWeight: 600,
  backgroundColor: 'var(--tp-surface)', color: 'var(--tp-secondary)',
  border: 'none', cursor: 'pointer',
  transition: 'opacity 0.2s',
}

export default function PoetryDashboard() {
  const { user, login, logout, signup, checkUsername,
          getUserSecurityQuestion, verifySecurityAnswer, resetPassword } = useAuth()
  const { themeId } = useTheme()
  const {
    resetQueue, total, favorites, clearFavorites, fullscreen,
    navigateToPoem, myPoems, addMyPoem, updateMyPoem, deleteMyPoem,
    editRequest, setEditRequest, recentlyViewed,
  } = usePoetry()
  const [showSettings, setShowSettings] = useState(false)
  const [slideOpen, setSlideOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [writeTitle, setWriteTitle] = useState('')
  const [writeContent, setWriteContent] = useState('')
  const [profileSection, setProfileSection] = useState(null)
  const [editingPoem, setEditingPoem] = useState(null)
  const trendingScroll = useRef(null)

  // ── Auth slide state ──
  const [authMode, setAuthMode] = useState('login') // login | signup | forgot | forgot_reset
  const [aUsername, setAUsername] = useState('')
  const [aPassword, setAPassword] = useState('')
  const [aRetype, setARetype] = useState('')
  const [aName, setAName] = useState('')
  const [aQuestion, setAQuestion] = useState('')
  const [aAnswer, setAAnswer] = useState('')
  const [aNewPass, setANewPass] = useState('')
  const [aError, setAError] = useState('')
  const [aBusy, setABusy] = useState(false)
  const [aSuggestions, setASuggestions] = useState([])
  const [aSecurityQ, setASecurityQ] = useState('')
  const [signupStep, setSignupStep] = useState(0)

  const closeSlide = () => { setSlideOpen(false); setProfileSection(null); setAuthMode('login'); setAError(''); setSignupStep(0) }

  function openSignup() { setAuthMode('signup'); setAError(''); setSignupStep(0); setASuggestions([]); setAUsername(''); setAName(''); setAPassword(''); setARetype(''); setAQuestion(''); setAAnswer('') }
  function openLogin() { setAuthMode('login'); setAError('') }
  function openForgot() { setAuthMode('forgot'); setAError('') }

  // ── Login handler ──
  async function handleLogin(e) {
    e?.preventDefault()
    setAError('')
    if (!aUsername.trim() || !aPassword) { setAError('Fill all fields'); return }
    setABusy(true)
    const res = await login(aUsername.trim(), aPassword)
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else closeSlide()
  }

  // ── Signup: next (step 0 username check) ──
  async function handleSignupNext0() {
    setAError('')
    const u = aUsername.trim().toLowerCase()
    if (!u || u.length < 3) { setAError('Username must be at least 3 characters'); return }
    setABusy(true)
    const res = await checkUsername(u)
    setABusy(false)
    if (res.available === null) {
      // Backend unavailable (Edge Function not deployed) — continue anyway
      setSignupStep(1)
      return
    }
    if (!res.available) { setAError('Username taken — try one below'); setASuggestions(res.suggestions ?? []); return }
    setASuggestions([])
    setSignupStep(1)
  }

  // ── Signup: create account ──
  async function handleSignup() {
    setAError('')
    if (!aQuestion.trim() || !aAnswer.trim()) { setAError('Fill security question and answer'); return }
    const u = aUsername.trim().toLowerCase()
    setABusy(true)
    const res = await signup(u, aPassword, aName.trim(), aQuestion.trim(), aAnswer.trim())
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else { setAuthMode('login'); setAError('Account created! Sign in below.'); setAPassword(''); setAAnswer('') }
  }

  // ── Forgot: lookup ──
  async function handleForgotLookup(e) {
    e?.preventDefault()
    setAError('')
    if (!aUsername.trim()) { setAError('Enter your username'); return }
    setABusy(true)
    const q = await getUserSecurityQuestion(aUsername.trim())
    setABusy(false)
    if (!q) { setAError('Username not found'); return }
    setASecurityQ(q)
    setAuthMode('forgot_reset')
  }

  // ── Forgot: verify + reset ──
  async function handleForgotReset(e) {
    e?.preventDefault()
    setAError('')
    if (!aAnswer.trim()) { setAError('Answer the security question'); return }
    if (!aNewPass || aNewPass.length < 6) { setAError('Password must be at least 6 characters'); return }
    setABusy(true)
    const res = await resetPassword(aUsername.trim(), aAnswer.trim(), aNewPass)
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else { setAuthMode('login'); setAError('Password reset. Sign in with your new password.'); setAPassword('') }
  }

  // ── Watch editRequest ──
  useEffect(() => {
    if (editRequest) {
      setEditingPoem(editRequest)
      setWriteTitle(editRequest.title)
      setWriteContent(editRequest.content)
      setShowWriteModal(true)
      setEditRequest(null)
    }
  }, [editRequest])

  function handleSavePoem() {
    if (!writeTitle.trim() || !writeContent.trim()) return
    if (editingPoem) {
      updateMyPoem(editingPoem.id, { title: writeTitle.trim(), content: writeContent.trim() })
    } else {
      addMyPoem({
        id: Date.now(),
        title: writeTitle.trim(),
        content: writeContent.trim(),
        createdAt: new Date().toLocaleDateString(),
        author: user?.name || 'Unknown',
      })
    }
    setWriteTitle('')
    setWriteContent('')
    setEditingPoem(null)
    setShowWriteModal(false)
  }

  const currentTheme = themeList.find((t) => t.id === themeId)

  if (fullscreen) return <FullscreenView />

  function scrollTrending(dir) {
    if (!trendingScroll.current) return
    const amount = 280
    trendingScroll.current.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--tp-bg)' }}>
      {/* Header */}
      <header
        className="flex-shrink-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--tp-header-bg)',
          color: 'var(--tp-header-text)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-xl transition-opacity hover:opacity-70" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome'}
          </h1>
          <p className="text-[10px] opacity-80 leading-tight">
            {user ? `@${user.username}` : 'please sign in  ·  '}
            {currentTheme?.emoji} {currentTheme?.label}
          </p>
        </div>
        <button onClick={() => setSlideOpen(!slideOpen)} className="p-1.5 rounded-xl transition-opacity hover:opacity-70" aria-label="Profile">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
          </svg>
        </button>
      </header>

      {/* ─── Slide-down panel ─── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: slideOpen ? '70vh' : '0',
          opacity: slideOpen ? 1 : 0,
          pointerEvents: slideOpen ? 'auto' : 'none',
        }}
      >
        <div
          onClick={() => setSlideOpen(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="overflow-y-auto"
            style={{
              backgroundColor: 'var(--tp-header-bg)',
              color: 'var(--tp-header-text)',
              maxHeight: 'none',
              borderRadius: '0 0 1.25rem 1.25rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            {/* ── AUTH MODE ── */}
            {!user && (
              <div className="p-6 space-y-4">
                {/* Close */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                    {authMode === 'login' && 'Sign In'}
                    {authMode === 'signup' && ['Choose Username','Set Your Name','Set Password','Security Question'][signupStep]}
                    {authMode === 'forgot' && 'Forgot Password'}
                    {authMode === 'forgot_reset' && 'Reset Password'}
                  </h2>
                  <button onClick={closeSlide} className="p-1.5 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-header-text)' }} aria-label="Close">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Login */}
                {authMode === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <input value={aUsername} onChange={(e) => setAUsername(e.target.value)}
                      placeholder="Username" style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                    <input type="password" value={aPassword} onChange={(e) => setAPassword(e.target.value)}
                      placeholder="Password" style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} />
                    {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                    <button type="submit" disabled={aBusy} style={btnWhite}
                      onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}>
                      {aBusy ? 'Signing in...' : 'Sign In'}
                    </button>
                    <div className="flex justify-between text-xs pt-1">
                      <button type="button" onClick={openSignup}
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Create account
                      </button>
                      <button type="button" onClick={openForgot}
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Forgot password?
                      </button>
                    </div>
                  </form>
                )}

                {/* Signup (multi-step) */}
                {authMode === 'signup' && (
                  <div className="space-y-3">
                    {/* Step indicator */}
                    <div className="flex gap-1.5 mb-2">
                      {['Username','Name','Password','Security'].map((label, i) => (
                        <div key={i} className="flex-1 h-1 rounded-full" style={{
                          backgroundColor: i <= signupStep ? 'var(--tp-header-text)' : 'rgba(255,255,255,0.2)',
                          transition: 'background-color 0.3s',
                        }} />
                      ))}
                    </div>

                    {/* Step 0: Username */}
                    {signupStep === 0 && (
                      <div className="space-y-3">
                        <input value={aUsername} onChange={(e) => { setAUsername(e.target.value.replace(/[^a-z0-9_]/gi, '')); setAError(''); setASuggestions([]) }}
                          placeholder="Choose a username" style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                        {aSuggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {aSuggestions.map((s) => (
                              <button key={s} type="button" onClick={() => { setAUsername(s); setASuggestions([]); setAError('') }}
                                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                        {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                        <button type="button" disabled={aBusy || !aUsername.trim()} onClick={handleSignupNext0} style={btnWhite}
                          onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}>
                          {aBusy ? 'Checking...' : 'Next'}
                        </button>
                      </div>
                    )}

                    {/* Step 1: Name */}
                    {signupStep === 1 && (
                      <div className="space-y-3">
                        <input value={aName} onChange={(e) => setAName(e.target.value)}
                          placeholder="What should we call you?" style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                        {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setSignupStep(0); setAError('') }}
                            style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>Back</button>
                          <button type="button" disabled={!aName.trim()} onClick={() => { if (aName.trim()) setSignupStep(2) }} style={{ ...btnWhite, flex: 1 }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}>Next</button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Password */}
                    {signupStep === 2 && (
                      <div className="space-y-3">
                        <input type="password" value={aPassword} onChange={(e) => { setAPassword(e.target.value); setAError('') }}
                          placeholder="Password (min 6 chars)" style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                        <input type="password" value={aRetype} onChange={(e) => { setARetype(e.target.value); setAError('') }}
                          placeholder="Retype password" style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur} />
                        {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setSignupStep(1); setAError('') }}
                            style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>Back</button>
                          <button type="button" disabled={!aPassword || !aRetype} onClick={() => {
                            if (aPassword.length < 6) { setAError('Password must be at least 6 characters'); return }
                            if (aPassword !== aRetype) { setAError('Passwords do not match'); return }
                            setSignupStep(3)
                          }} style={{ ...btnWhite, flex: 1 }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}>Next</button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Security question */}
                    {signupStep === 3 && (
                      <div className="space-y-3">
                        <input value={aQuestion} onChange={(e) => { setAQuestion(e.target.value); setAError('') }}
                          placeholder="Security question (for password reset)" style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                        <input value={aAnswer} onChange={(e) => { setAAnswer(e.target.value); setAError('') }}
                          placeholder="Security answer" style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur} />
                        {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                        <button type="button" disabled={aBusy || !aQuestion.trim() || !aAnswer.trim()} onClick={handleSignup} style={btnWhite}
                          onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}>
                          {aBusy ? 'Creating...' : 'Create Account'}
                        </button>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setSignupStep(2); setAError('') }}
                            style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>Back</button>
                          <div style={{ flex: 1 }} />
                        </div>
                      </div>
                    )}

                    <div className="text-center pt-0.5">
                      <button type="button" onClick={openLogin}
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Already have an account? Sign in
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot: enter username */}
                {authMode === 'forgot' && (
                  <form onSubmit={handleForgotLookup} className="space-y-3">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Enter your username to find your security question.
                    </p>
                    <input value={aUsername} onChange={(e) => setAUsername(e.target.value)}
                      placeholder="Username" style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                    {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                    <button type="submit" disabled={aBusy} style={btnWhite}
                      onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}>
                      {aBusy ? 'Looking up...' : 'Find Account'}
                    </button>
                    <div className="text-center">
                      <button type="button" onClick={openLogin}
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Back to sign in
                      </button>
                    </div>
                  </form>
                )}

                {/* Forgot: verify + reset */}
                {authMode === 'forgot_reset' && (
                  <form onSubmit={handleForgotReset} className="space-y-3">
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem' }}>
                      <p className="text-xs font-medium mb-1">Security Question:</p>
                      <p className="text-sm">{aSecurityQ}</p>
                    </div>
                    <input value={aAnswer} onChange={(e) => setAAnswer(e.target.value)}
                      placeholder="Your answer" style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} autoFocus />
                    <input type="password" value={aNewPass} onChange={(e) => setANewPass(e.target.value)}
                      placeholder="New password (min 6 chars)" style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} />
                    {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
                    <button type="submit" disabled={aBusy} style={btnWhite}
                      onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}>
                      {aBusy ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <div className="text-center">
                      <button type="button" onClick={openLogin}
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ── PROFILE MODE ── */}
            {user && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Profile</h2>
                  <button onClick={closeSlide} className="text-white/60 hover:text-white text-lg leading-none">&times;</button>
                </div>

                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    {user.name.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'U'}
                  </div>
                  <h2 className="text-lg font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>{user.name}</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>@{user.username}</p>
                </div>

                <div className="flex justify-center gap-8 mb-5">
                  <div className="text-center">
                    <p className="text-lg font-bold">{total}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Poems</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${favorites.length > 0 ? '' : 'opacity-50'}`}>{favorites.length}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Favorites</p>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <Accordion title={
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                      My Writings ({myPoems.length})
                    </span>
                  } open={profileSection === 'writings'}
                    onToggle={() => setProfileSection(profileSection === 'writings' ? null : 'writings')}>
                    {myPoems.length === 0 ? (
                      <p className="text-xs py-2" style={{ color: 'rgba(255,255,255,0.5)' }}>No writings yet.</p>
                    ) : (
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {myPoems.map((p) => (
                          <div key={p.id} className="flex items-center justify-between gap-2 py-1.5 rounded-lg px-2 transition-colors hover:opacity-80">
                            <div className="min-w-0 flex-1" onClick={() => { navigateToPoem(p); closeSlide() }} style={{ cursor: 'pointer' }}>
                              <p className="text-xs font-medium truncate">{p.title}</p>
                              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.createdAt}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => { setEditingPoem(p); setWriteTitle(p.title); setWriteContent(p.content); setShowWriteModal(true) }}
                                className="p-1 rounded-lg transition-colors hover:opacity-70" style={{ color: 'rgba(255,255,255,0.5)' }} aria-label="Edit">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                              </button>
                              <button onClick={() => deleteMyPoem(p.id)}
                                className="p-1 rounded-lg transition-colors hover:opacity-70" style={{ color: '#ef4444' }} aria-label="Delete">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Accordion>

                  <Accordion title={
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      Favorite Lines ({favorites.length})
                    </span>
                  } open={profileSection === 'favs'}
                    onToggle={() => setProfileSection(profileSection === 'favs' ? null : 'favs')}>
                    {favorites.length === 0 ? (
                      <p className="text-xs py-2" style={{ color: 'rgba(255,255,255,0.5)' }}>No favorites yet.</p>
                    ) : (
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {favorites.map((f) => (
                          <div key={f.key} className="py-1.5">
                            <p className="text-xs font-medium" style={{ color: '#fff' }}>{f.lineText}</p>
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>— {f.poemTitle} by {f.author}</p>
                          </div>
                        ))}
                        <button onClick={clearFavorites} className="text-xs px-2 py-1 rounded-lg mt-1" style={{ color: '#fca5a5' }}>Clear all</button>
                      </div>
                    )}
                  </Accordion>

                  <Accordion title={
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="14" y2="13" /></svg>
                      Terms & Conditions
                    </span>
                  } open={profileSection === 'terms'}
                    onToggle={() => setProfileSection(profileSection === 'terms' ? null : 'terms')}>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <p>By using Poetry, you agree to these terms. All poems shared remain the intellectual property of their respective authors.</p>
                      <p className="mt-2">This service is provided "as is" without warranties. We reserve the right to update these terms.</p>
                    </div>
                  </Accordion>

                  <Accordion title={
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Privacy Policy
                    </span>
                  } open={profileSection === 'privacy'}
                    onToggle={() => setProfileSection(profileSection === 'privacy' ? null : 'privacy')}>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <p>Your data is stored locally. We do not collect, transmit, or share your personal information with any third party.</p>
                      <p className="mt-2">You can clear all stored data at any time by clearing your browser's local storage.</p>
                    </div>
                  </Accordion>
                </div>

                <button onClick={logout} style={{
                  width: '100%', padding: '0.625rem', borderRadius: '0.75rem',
                  fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
                }}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-start pt-16 px-4"
          onClick={() => setMenuOpen(false)} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl p-5 animate-slide-in"
            style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--tp-text)' }}>Quick Actions</h3>
            <div className="space-y-1">
              <button onClick={() => { setShowSettings(true); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors"
                style={{ color: 'var(--tp-text)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--tp-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    Settings
                  </span>
                </button>
              <button onClick={() => { resetQueue(); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors"
                style={{ color: 'var(--tp-text)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--tp-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
                    Shuffle Poems
                  </span>
                </button>
              {favorites.length > 0 && (
                <button onClick={() => { setMenuOpen(false); setSlideOpen(true); setProfileSection('favs') }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors"
                  style={{ color: 'var(--tp-text)' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--tp-bg)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    Favorites ({favorites.length})
                  </span>
                </button>
              )}
              <button onClick={() => setMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm"
                style={{ color: 'var(--tp-text-secondary)' }}>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    Close
                  </span>
                </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      {/* Write Poem Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setShowWriteModal(false)} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl p-6 animate-fade-in"
            style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{editingPoem ? 'Edit Poem' : 'Write a Poem'}</h2>
            <input value={writeTitle} onChange={(e) => setWriteTitle(e.target.value)}
              placeholder="Poem title..."
              className="w-full px-3 py-2 rounded-xl mb-3 text-sm outline-none"
              style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
            />
            <textarea value={writeContent} onChange={(e) => setWriteContent(e.target.value)}
              placeholder="Write your poem here..." rows={10}
              className="w-full px-3 py-2 rounded-xl mb-4 text-sm outline-none resize-none"
              style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)', fontFamily: '"Playfair Display", Georgia, serif', lineHeight: '1.7' }}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowWriteModal(false); setWriteTitle(''); setWriteContent(''); setEditingPoem(null) }}
                className="px-4 py-2 rounded-xl text-sm transition-colors"
                style={{ color: 'var(--tp-text-secondary)', backgroundColor: 'var(--tp-bg)' }}>Cancel</button>
              <button onClick={handleSavePoem}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
                style={{ backgroundColor: 'var(--tp-secondary)' }}>{editingPoem ? 'Update' : 'Save Poem'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable feed */}
      <main className="flex-1 overflow-y-auto px-4 py-5 max-w-2xl mx-auto w-full space-y-8">
        {/* Hero greeting */}
        <div className="text-center animate-fade-in">
          {user ? (
            <>
              <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>Welcome back,</p>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>{user.name}</h2>
            </>
          ) : (
            <>
              <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>Welcome to Poetry</p>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>Discover & Create</h2>
              <button onClick={() => { setSlideOpen(true); setAuthMode('login') }}
                style={{ ...btnWhite, width: 'auto', padding: '0.5rem 1.5rem', marginTop: '0.75rem', display: 'inline-block' }}>
                Sign In to Save
              </button>
            </>
          )}
        </div>

        {/* Recently Viewed */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>🕐 Recently Viewed</h3>
          </div>
          {recentlyViewed.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>No poems viewed yet. Start exploring!</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {recentlyViewed.slice(0, 6).map((p) => (
                <button key={p.id} onClick={() => navigateToPoem(p)}
                  className="flex-shrink-0 w-40 snap-start rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--tp-secondary)' }}>{p.author}</p>
                  <p className="text-sm font-bold leading-tight mt-1 line-clamp-2" style={{ color: 'var(--tp-text)' }}>{p.title}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--tp-text-secondary)' }}>{p.date || p.createdAt || ''}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Trending Poems */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 1 1.133 1 2.867 1 4a5.5 5.5 0 0 1-11 0z" /></svg>
              Trending Poems
            </h3>
            <div className="flex gap-1">
              <button onClick={() => scrollTrending(-1)}
                className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scrollTrending(1)}
                className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
          <div ref={trendingScroll} className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {trending.map((p) => (
              <button key={p.id} onClick={() => navigateToPoem(p)}
                className="flex-shrink-0 w-48 snap-start rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-xs font-bold truncate" style={{ color: 'var(--tp-secondary)' }}>{p.author}</p>
                <p className="text-sm font-bold leading-tight mt-1" style={{ color: 'var(--tp-text)' }}>{p.title}</p>
                <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--tp-text-secondary)' }}>
                  {p.content.split('\n')[0]}...
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{p.likes?.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Most Hooked Lines */}
        <section className="animate-fade-in">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Most Hooked Lines
          </h3>
          <div className="space-y-2">
            {hookedLines.slice(0, 4).map((h, i) => {
              const targetPoem = poems.find((p) => p.title === h.poem || p.title.startsWith(h.poem.split('—')[0].trim()))
              return (
                <button key={i} onClick={() => { if (targetPoem) navigateToPoem(targetPoem) }}
                  className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                  style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>{h.line}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs" style={{ color: 'var(--tp-secondary)' }}>— {h.author}</p>
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{h.likes}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* My Writings */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>✍️ My Writings</h3>
            <button onClick={() => setShowWriteModal(true)}
              className="text-xs px-3 py-1 rounded-lg font-medium transition-all hover:opacity-70"
              style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)' }}>
              + New
            </button>
          </div>
          {myPoems.length === 0 ? (
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
              <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>No writings yet. Tap + to write your first poem.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myPoems.slice(0, 4).map((p) => (
                <button key={p.id} onClick={() => navigateToPoem(p)}
                  className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
                  style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{p.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.createdAt}</p>
                    <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>by {p.author}</span>
                  </div>
                </button>
              ))}
              {myPoems.length > 4 && (
                <button onClick={() => { setSlideOpen(true); setProfileSection('writings') }}
                  className="w-full text-center text-xs py-2 rounded-xl transition-colors"
                  style={{ color: 'var(--tp-secondary)' }}>
                  View all {myPoems.length} writings →
                </button>
              )}
            </div>
          )}
        </section>

        {/* Featured Poets */}
        <section className="animate-fade-in">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--tp-text)' }}>🏛️ Featured Poets</h3>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {poets.slice(0, 6).map((p) => (
              <div key={p.name}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--tp-secondary)' }}>
                  {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <p className="text-xs font-medium truncate max-w-[80px] text-center" style={{ color: 'var(--tp-text)' }}>{p.name}</p>
                <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.followers?.toLocaleString()} followers</p>
              </div>
            ))}
          </div>
        </section>

        {/* Start Reading */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>📖 Start Reading</h3>
            <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>Swipe to explore</span>
          </div>
          <PoetryCard />
        </section>

        <div className="h-4" />
      </main>

      {/* Floating write button */}
      <button onClick={() => setShowWriteModal(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'var(--tp-secondary)', color: 'white' }}
        aria-label="Write a poem">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}

/* ── Accordion helper ── */
function Accordion({ title, open, onToggle, children }) {
  return (
    <div>
      <button onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors"
        style={{ color: '#fff', backgroundColor: open ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
        <span>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && <div className="px-3 pb-2">{children}</div>}
    </div>
  )
}
