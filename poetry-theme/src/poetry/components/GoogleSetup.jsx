import { useState } from 'react'
import { supabase, hashAnswer } from '../../supabase/client'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../language/LanguageProvider'
import { btnWhite } from './AuthForms'
import LocationFields from './LocationFields'

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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

// Post-Google sign-in wizard: a fresh Google account has no username,
// display name, location or security question yet, so ask for them here
// and write everything into the Supabase user metadata.
export default function GoogleSetup({ user, onClose }) {
  const { t } = useLanguage()
  const { checkUsername } = useAuth()
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const [name, setName] = useState(user?.name && user.name !== 'User' ? user.name : '')
  const [country, setCountry] = useState(localStorage.getItem('poetry_country') || '')
  const [state, setState] = useState(localStorage.getItem('poetry_state') || '')
  const [zip, setZip] = useState(localStorage.getItem('poetry_zip') || '')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const stepHeadings = [
    t('auth.stepChooseUsername'),
    t('auth.stepSetYourName'),
    t('auth.stepSetLocation'),
    t('auth.stepSecurityQuestion'),
  ]
  const progressLabels = [
    t('auth.progressUsername'),
    t('auth.progressName'),
    t('auth.progressLocation'),
    t('auth.progressSecurity'),
  ]

  async function handleCheckUsername() {
    setError('')
    const u = username.trim().toLowerCase()
    if (!u || u.length < 3) { setError(t('auth.usernameMin3')); return }
    setBusy(true)
    const res = await checkUsername(u)
    setBusy(false)
    if (res.available === null) { setError(t('auth.usernameCheckFail')); return }
    if (!res.available) { setError(t('auth.usernameTaken')); setSuggestions(res.suggestions ?? []); return }
    setSuggestions([])
    setStep(1)
  }

  async function handleFinish() {
    setError('')
    if (!question.trim() || !answer.trim()) { setError(t('auth.fillSecurityQA')); return }
    setBusy(true)
    try {
      const answerHash = await hashAnswer(answer)
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: username.trim().toLowerCase(),
          name: name.trim(),
          display_name: name.trim(),
          security_question: question.trim(),
          security_answer_hash: answerHash,
          country, state, zip,
        },
      })
      if (updateError) throw updateError
      try {
        if (country) localStorage.setItem('poetry_country', country)
        if (state) localStorage.setItem('poetry_state', state)
        if (zip) localStorage.setItem('poetry_zip', zip)
      } catch {}
      setDone(true)
      setTimeout(onClose, 900)
    } catch (err) {
      setError(err?.message || 'Could not save your profile')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="p-6 text-center space-y-2">
        <div className="text-3xl">✅</div>
        <p className="text-sm font-semibold">{t('auth.profileReady')}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          {stepHeadings[step]}
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-header-text)' }} aria-label={t('common.close')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <GoogleIcon />
        <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {t('auth.signedInAs', { email: user?.email || '' })}
        </span>
      </div>

      <div className="flex gap-1.5">
        {progressLabels.map((label, i) => (
          <div key={label} className="flex-1 h-1 rounded-full" style={{
            backgroundColor: i <= step ? 'var(--tp-header-text)' : 'rgba(255,255,255,0.2)',
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <input value={username}
            onChange={(e) => { setUsername(e.target.value.replace(/[^a-z0-9_]/gi, '')); setError(''); setSuggestions([]) }}
            placeholder={t('auth.usernamePlaceholder')} style={inputStyle}
            onFocus={inputFocus} onBlur={inputBlur} autoFocus />
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => { setUsername(s); setSuggestions([]); setError('') }}
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {error && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{error}</p>}
          <button type="button" disabled={busy || !username.trim()} onClick={handleCheckUsername} style={btnWhite}
            onMouseEnter={(e) => e.target.style.opacity = '0.85'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}>
            {busy ? t('auth.checkingEllipsis') : t('common.next')}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.whatShouldWeCallYou')} style={inputStyle}
            onFocus={inputFocus} onBlur={inputBlur} autoFocus />
          {error && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => { setStep(0); setError('') }}
              style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>{t('common.back')}</button>
            <button type="button" disabled={!name.trim()} onClick={() => { if (name.trim()) setStep(2) }}
              style={{ ...btnWhite, flex: 1 }}
              onMouseEnter={(e) => e.target.style.opacity = '0.85'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}>{t('common.next')}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <LocationFields
            country={country} setCountry={setCountry}
            state={state} setState={setState}
            zip={zip} setZip={setZip}
            inputStyle={inputStyle} onInputFocus={inputFocus} onInputBlur={inputBlur}
          />
          {(!country.trim() || !state.trim() || !zip.trim()) && (
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('auth.locationRequiredShort')}</p>
          )}
          {error && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => { setStep(1); setError('') }}
              style={{ ...btnWhite, flex: 1, opacity: 0.7 }}>{t('common.back')}</button>
            <button type="button" disabled={!country.trim() || !state.trim() || !zip.trim()}
              onClick={() => { if (country.trim() && state.trim() && zip.trim()) setStep(3) }}
              style={{ ...btnWhite, flex: 1 }}
              onMouseEnter={(e) => e.target.style.opacity = '0.85'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}>{t('common.next')}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <input value={question} onChange={(e) => { setQuestion(e.target.value); setError('') }}
            placeholder={t('auth.securityQuestionExample')} style={inputStyle}
            onFocus={inputFocus} onBlur={inputBlur} autoFocus />
          <input value={answer} onChange={(e) => { setAnswer(e.target.value); setError('') }}
            placeholder={t('auth.yourAnswer')} style={inputStyle}
            onFocus={inputFocus} onBlur={inputBlur} />
          {error && <p className="text-xs text-center" style={{ color: '#fbbf24' }}>{error}</p>}
          <button type="button" disabled={busy || !question.trim() || !answer.trim()} onClick={handleFinish} style={btnWhite}
            onMouseEnter={(e) => e.target.style.opacity = '0.85'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}>
            {busy ? t('auth.finishing') : t('auth.finishSetup')}
          </button>
          <button type="button" disabled={busy} onClick={() => { setStep(2); setError('') }}
            style={{ ...btnWhite, opacity: 0.7 }}>{t('common.back')}</button>
        </div>
      )}
    </div>
  )
}
