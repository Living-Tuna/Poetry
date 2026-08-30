import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useLanguage } from '../language/LanguageProvider'

export default function GoogleCallback() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  // Single-use Google auth codes must be exchanged exactly once — a second
  // attempt gets `invalid_grant` from Google and breaks sign-in.
  const exchangedRef = useRef(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(searchParams.get('error_description') || t('auth.googleFailed'))
      return
    }

    if (!code) {
      setError(t('auth.googleFailed'))
      return
    }

    if (exchangedRef.current) return
    exchangedRef.current = true

    // Remove the single-use code from the address bar so a refresh or
    // re-render can't try to redeem it a second time.
    try {
      window.history.replaceState({}, '', window.location.pathname)
    } catch {
      // ignore — stripping the query is best-effort
    }

    let cancelled = false

    async function exchange() {
      try {
        // Send code to our Edge Function (keeps GOOGLE_CLIENT_SECRET off the client)
        console.log('[GoogleCallback] invoking google-auth edge function')
        const fnRes = await supabase.functions.invoke('google-auth', {
          body: { code },
        })
        console.log('[GoogleCallback] google-auth response:', {
          hasData: !!fnRes.data,
          hasError: !!fnRes.error,
          data: fnRes.data ? { email: fnRes.data.email, hasToken: !!fnRes.data.token, isNew: fnRes.data.is_new } : null,
        })

        const fnError = fnRes.error
        if (fnError) {
          // FunctionsHttpError.context is a Response; parse its JSON body for the
          // real server message (e.g. "Google token exchange failed").
          let serverMsg = ''
          try {
            if (fnError.context && typeof fnError.context.json === 'function') {
              const ctx = await fnError.context.json()
              serverMsg = ctx?.detail || ctx?.error || ctx?.message || ctx?.msg || ''
            } else if (fnError.context && typeof fnError.context.error === 'string') {
              serverMsg = fnError.context.error
            }
          } catch {
            serverMsg = ''
          }
          // Log the full error object (type, message, status, context) for debugging.
          console.error('[GoogleCallback] edge function invoke FAILED', {
            name: fnError.name,
            message: fnError.message,
            status: fnError.status,
            context: fnError.context,
            serverMsg,
          })
          const detail = serverMsg || fnError.message || t('auth.googleFailed')
          if (!cancelled) setError(detail || t('auth.googleFailed'))
          return
        }

        const { token_hash, email } = fnRes.data

        // Exchange the verification token for a real Supabase session.
        // Magic-link hashed tokens use verifyOtp({ type: 'magiclink', token_hash }).
        const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
          type: 'magiclink',
          token_hash,
        })

        if (otpError) {
          console.error('[GoogleCallback] verifyOtp failed:', {
            name: otpError.name,
            message: otpError.message,
            status: otpError.status,
            code: otpError.code,
          })
          if (!cancelled) setError(otpError.message || t('auth.googleFailed'))
          return
        }

        console.log('[GoogleCallback] signed in — user:', otpData?.user?.id)
        // Session is now stored. Navigate to home.
        if (!cancelled) navigate('/', { replace: true })
      } catch (err) {
        console.log('[GoogleCallback] unexpected error:', err)
        if (!cancelled) setError(err?.message || t('auth.googleFailed'))
      }
    }

    exchange()
    return () => { cancelled = true }
  }, [searchParams, navigate, t])

  const lang = localStorage.getItem('poetry_lang') || 'en'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)',
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {error ? (
          <>
            <p style={{ color: '#fbbf24', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => navigate(`/${lang}`, { replace: true })}
              style={{
                padding: '0.5rem 1.5rem', borderRadius: '0.75rem', border: 'none',
                backgroundColor: 'var(--tp-primary)', color: 'var(--tp-secondary)',
                cursor: 'pointer', fontWeight: 600,
              }}
            >
              {t('common.back')}
            </button>
          </>
        ) : (
          <p>{t('auth.signingIn')}</p>
        )}
      </div>
    </div>
  )
}
