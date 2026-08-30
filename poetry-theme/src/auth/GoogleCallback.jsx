import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useLanguage } from '../language/LanguageProvider'

export default function GoogleCallback() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

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
          // Log the full error object (type, message, status, context) for debugging.
          console.error('[GoogleCallback] edge function invoke FAILED', {
            name: fnError.name,
            message: fnError.message,
            status: fnError.status,
            context: fnError.context,
          })
          let detail = fnError.message || t('auth.googleFailed')
          // If the function returned a 2xx HTTP error body, prefer its message.
          if (fnError.context && typeof fnError.context.error === 'string') {
            detail = fnError.context.error
          }
          if (!cancelled) setError(detail || t('auth.googleFailed'))
          return
        }

        const { token, email } = fnRes.data

        // Exchange the verification token for a real Supabase session
        const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
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
