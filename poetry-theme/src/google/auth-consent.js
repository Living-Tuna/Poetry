import { GOOGLE_CLIENT_ID } from './clientId'

const GOOGLE_REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/auth/google-callback`
  : ''

export async function signInWithGoogle() {
  if (!GOOGLE_CLIENT_ID) {
    console.log('[GOOGLE] missing client id')
    return { ok: false, error: 'Google sign-in is not configured' }
  }
  if (!GOOGLE_REDIRECT_URI) return { ok: false, error: 'Not in browser' }

  console.log('[GOOGLE] redirecting to Google — redirect_uri:', GOOGLE_REDIRECT_URI)

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    access_type: 'offline',
  })

  // Browser navigates directly to Google — no Supabase URL shown.
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  return { ok: true, redirected: true }
}

// Unused after the manual flow rewrite — kept for any stale imports.
export async function completeGoogleSignIn() {
  return { ok: false, ignored: true }
}

export function isGoogleRedirectPending() {
  return false
}
