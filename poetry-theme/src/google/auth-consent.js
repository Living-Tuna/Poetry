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

function callbackUrl() {
  if (typeof window === 'undefined') return null
  try {
    return new URL(INITIAL_URL || window.location.href)
  } catch {
    return null
  }
}

function hashParams() {
  const raw = callbackUrl()?.hash || window.location.hash || ''
  return new URLSearchParams(raw.startsWith('#') ? raw.slice(1) : raw)
}

// --- PKCE flow: Google returns ?code=<single-use> in the query string ---

function pkceVerifierPending() {
  try {
    if (typeof localStorage === 'undefined' || !supabaseUrlRef) return false
    return !!localStorage.getItem(`sb-${supabaseUrlRef}-auth-token-code-verifier`)
  } catch {
    return false
  }
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
  const code = callbackUrl()?.searchParams.get('code') ?? null
  // Only attempt an exchange when we actually started a PKCE flow,
  // so random ?code= links never trigger failed logins.
  if (!code || !pkceVerifierPending()) return null

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
  console.log('[GOOGLE] starting PKCE OAuth — client id:', GOOGLE_CLIENT_ID.slice(0, 12) + '...')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined),
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
  console.log('[GOOGLE] signed in via Google — new account:', identity && data.user?.created_at === data.user?.last_sign_in_at)
  return { ok: true, user: data.user ?? null }
}
