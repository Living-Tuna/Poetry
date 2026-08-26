import { supabase, supabaseUrlRef } from '../supabase/client'
import { GOOGLE_CLIENT_ID } from './clientId'

// Manages the Google consent flow end-to-end:
//   1. signInWithGoogle()  -> redirects the user to Google's consent screen
//      via Supabase Auth. Supabase signs the user in if the account exists,
//      or silently creates a new one on first Google sign-in.
//   2. completeGoogleSignIn() -> called once on app load after returning
//      from Google; exchanges the single-use ?code= (PKCE) or promotes
//      legacy #access_token= hashes into a real Supabase session, then
//      scrubs the credentials out of the address bar
//      (detectSessionInUrl is disabled in our client).

const OAUTH_ERROR_MESSAGES = {
  access_denied: 'Google sign-in was cancelled',
  unauthorized_client: 'Google sign-in is not configured for this app',
  redirect_uri_mismatch: 'This address is not allowed for Google sign-in',
}

// Snapshot of the address bar at module import time — i.e. before React
// Router mounts. The "/" route rewrites the URL to /{lang} during the very
// first render, which would strip the single-use ?code= before the
// exchange effect runs, so every later read must use this snapshot.
const INITIAL_URL = typeof window !== 'undefined' ? window.location.href : ''

function resolveCode() {
  if (typeof window === 'undefined') return null
  // Read from the snapshot first (captured before React Router mount).
  try {
    const fromSnapshot = new URL(INITIAL_URL).searchParams.get('code')
    if (fromSnapshot) return fromSnapshot
  } catch {}
  // Fallback: read the live URL (works when INITIAL_URL is empty or stale).
  try {
    return new URL(window.location.href).searchParams.get('code')
  } catch { return null }
}

function hashParams() {
  const raw = INITIAL_URL ? (new URL(INITIAL_URL).hash || '') : (window.location.hash || '')
  return new URLSearchParams(raw.startsWith('#') ? raw.slice(1) : raw)
}

function hasPkceVerifier() {
  if (typeof localStorage === 'undefined' || !supabaseUrlRef) return false
  const key = `sb-${supabaseUrlRef}-auth-token-code-verifier`
  try { return !!localStorage.getItem(key) } catch { return false }
}

function stripQueryParam(name) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.delete(name)
  const query = url.searchParams.toString()
  window.history.replaceState(null, '', url.pathname + (query ? `?${query}` : '') + url.hash)
}

async function completePkceSignIn() {
  if (typeof window === 'undefined') return null
  const code = resolveCode()
  const hasVerifier = hasPkceVerifier()
  console.log('[GOOGLE] PKCE check:', { code: code ? code.slice(0, 8) + '…' : null, hasVerifier })
  if (!code) return null
  // When a ?code= is present but no verifier is stored, the code is
  // either stale (page reload) or from a different flow — skip it.
  if (!hasVerifier) {
    console.log('[GOOGLE] code present but no PKCE verifier in localStorage — skipping')
    return null
  }

  console.log('[GOOGLE] exchanging PKCE code for a session')
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  stripQueryParam('code')
  if (error) {
    console.log('[GOOGLE] PKCE exchange failed:', error.message)
    return { ok: false, error: error.message }
  }
  console.log('[GOOGLE] signed in via Google (PKCE)')
  return { ok: true, user: data?.user ?? null }
}

// --- Implicit flow fallback: tokens arrive in the URL hash ---------------

export function isGoogleRedirectPending() {
  if (typeof window === 'undefined') return false
  const params = hashParams()
  if (!params.get('access_token')) return false
  // Leave password-recovery links to their own flow.
  return params.get('type') !== 'recovery'
}

function clearUrlTokens() {
  if (typeof window === 'undefined') return
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

export async function signInWithGoogle({ redirectTo } = {}) {
  if (!GOOGLE_CLIENT_ID) {
    console.log('[GOOGLE] missing client id')
    return { ok: false, error: 'Google sign-in is not configured' }
  }
  // Use the current path so the redirect lands in the SPA (not a bare
  // "/" that React Router immediately rewrites).
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const target = redirectTo || `${origin}/`
  console.log('[GOOGLE] starting PKCE OAuth — client id:', GOOGLE_CLIENT_ID.slice(0, 12) + '…  redirectTo:', target)
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: target,
      queryParams: { prompt: 'select_account' },
    },
  })
  if (error) {
    console.log('[GOOGLE] OAuth start failed:', error.message)
    return { ok: false, error: error.message }
  }
  // Browser navigates away to Google's consent screen.
  return { ok: true, redirected: true }
}

export async function completeGoogleSignIn() {
  console.log('[GOOGLE] completeGoogleSignIn — INITIAL_URL:', INITIAL_URL?.slice(0, 120))
  console.log('[GOOGLE] live URL:', window.location.href?.slice(0, 120))
  const pkce = await completePkceSignIn()
  if (pkce) return pkce
  if (!isGoogleRedirectPending()) return { ok: false, ignored: true }

  const params = hashParams()
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token') || ''
  const oauthError = params.get('error')
  const oauthErrorDescription = params.get('error_description')

  clearUrlTokens()

  if (oauthError) {
    const friendly = OAUTH_ERROR_MESSAGES[oauthError]
    const detail = oauthErrorDescription?.replace(/\+/g, ' ') || ''
    console.log('[GOOGLE] OAuth returned error:', oauthError, detail)
    return { ok: false, error: friendly || detail || 'Google sign-in failed' }
  }
  if (!accessToken) {
    console.log('[GOOGLE] OAuth callback without access token')
    return { ok: false, error: 'Google sign-in failed' }
  }

  console.log('[GOOGLE] exchanging OAuth tokens for a session')
  const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
  if (error) {
    console.log('[GOOGLE] setSession failed:', error.message)
    return { ok: false, error: error.message }
  }

  const identity = data.user?.app_metadata?.provider === 'google'
  console.log('[GOOGLE] signed in via Google (implicit) — new account:', identity && data.user?.created_at === data.user?.last_sign_in_at)
  return { ok: true, user: data.user ?? null }
}
