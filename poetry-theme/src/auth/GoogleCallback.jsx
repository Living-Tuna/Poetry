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
        const fnRes = await supabase.functions.invoke('google-auth', {
          body: { code },
        })

        if (fnRes.error) {
          const detail = fnRes.error?.context?.error || fnRes.error.message
          console.log('[GoogleCallback] edge function error:', detail)
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
          console.log('[GoogleCallback] verifyOtp failed:', otpError.message)
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
