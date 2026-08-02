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
export const btnWhite = {
  width: '100%', padding: '0.625rem', borderRadius: 'var(--tp-btn-radius, 0.75rem)',
  fontSize: '0.875rem', fontWeight: 600,
  backgroundColor: 'var(--tp-surface)', color: 'var(--tp-secondary)',
  border: 'none', cursor: 'pointer',
  transition: 'opacity 0.2s',
}

import LocationFields from './LocationFields'

export default function AuthForms({
  authMode, signupStep,
  aUsername, aPassword, aRetype, aName, aQuestion, aAnswer, aNewPass,
  aError, aBusy, aSuggestions, aSecurityQ,
  aCountry, aState, aZip,
  setAUsername, setAPassword, setARetype, setAName,
  setAQuestion, setAAnswer, setANewPass, setAError,
  setABusy, setASuggestions, setSignupStep, setAuthMode,
  setACountry, setAState, setAZip,
  handleLogin, handleSignupNext0, handleSignup,
  handleForgotLookup, handleForgotReset,
  openSignup, openLogin, openForgot, closeSlide,
}) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          {authMode === 'login' && 'Sign In'}
          {authMode === 'signup' && ['Choose Username','Set Your Name','Set Location','Set Password','Security Question'][signupStep]}
          {authMode === 'forgot' && 'Forgot Password'}
          {authMode === 'forgot_reset' && 'Reset Password'}
        </h2>
        <button onClick={closeSlide} className="p-1.5 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-header-text)' }} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

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
              style={{ color: 'rgba(255,255,255,0.9)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
              Create account
            </button>
            <button type="button" onClick={openForgot}
              style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Forgot password?
            </button>
          </div>
        </form>
      )}

      {authMode === 'signup' && (
        <div className="space-y-3">
          <div className="flex gap-1.5 mb-2">
            {['Username','Name','Location','Password','Security'].map((label, i) => (
              <div key={i} className="flex-1 h-1 rounded-full" style={{
                backgroundColor: i <= signupStep ? 'var(--tp-header-text)' : 'rgba(255,255,255,0.2)',
                transition: 'background-color 0.3s',
              }} />
            ))}
          </div>

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

          {signupStep === 1 && (
            <div className="space-y-3">
              <input value={aName} onChange={(e) => setAName(e.target.value)}
                placeholder="What should we call you?" style={inputStyle}
                onFocus={inputFocus} onBlur={inputBlur} autoFocus />
              {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setSignupStep(0); setAError('') }}
                  style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>Back</button>
                <button type="button" disabled={!aName.trim()} onClick={() => {
                  if (!aName.trim()) return
                  setSignupStep((aCountry.trim() && aState.trim() && aZip.trim()) ? 3 : 2)
                }} style={{ ...btnWhite, flex: 1 }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}>Next</button>
              </div>
            </div>
          )}

          {signupStep === 2 && (
            <div className="space-y-3">
              <LocationFields
                country={aCountry} setCountry={setACountry}
                state={aState} setState={setAState}
                zip={aZip} setZip={setAZip}
                inputStyle={inputStyle} onInputFocus={inputFocus} onInputBlur={inputBlur}
              />
              {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
              {(!aCountry.trim() || !aState.trim() || !aZip.trim()) && (
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Your location is required — it auto-detects, or pick your country and enter your ZIP / PIN code.
                </p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setSignupStep(1); setAError('') }}
                  style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>Back</button>
                <button type="button" disabled={!aCountry.trim() || !aState.trim() || !aZip.trim()}
                  onClick={() => { if (aCountry.trim() && aState.trim() && aZip.trim()) setSignupStep(3) }} style={{ ...btnWhite, flex: 1 }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}>Next</button>
              </div>
            </div>
          )}

          {signupStep === 3 && (
            <div className="space-y-3">
              <input type="password" value={aPassword} onChange={(e) => { setAPassword(e.target.value); setAError('') }}
                placeholder="Password (min 6 chars)" style={inputStyle}
                onFocus={inputFocus} onBlur={inputBlur} autoFocus />
              <input type="password" value={aRetype} onChange={(e) => { setARetype(e.target.value); setAError('') }}
                placeholder="Retype password" style={inputStyle}
                onFocus={inputFocus} onBlur={inputBlur} />
              {aError && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{aError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setSignupStep(2); setAError('') }}
                  style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>Back</button>
                <button type="button" disabled={!aPassword || !aRetype} onClick={() => {
                  if (aPassword.length < 6) { setAError('Password must be at least 6 characters'); return }
                  if (aPassword !== aRetype) { setAError('Passwords do not match'); return }
                  setSignupStep(4)
                }} style={{ ...btnWhite, flex: 1 }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}>Next</button>
              </div>
            </div>
          )}

          {signupStep === 4 && (
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
                <button type="button" onClick={() => { setSignupStep(3); setAError('') }}
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
  )
}
