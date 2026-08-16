import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

const AUTH_STORAGE_KEY = supabaseUrl
  ? `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`
  : ''

export function readCachedSession() {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined' || !AUTH_STORAGE_KEY) return null
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data?.access_token && data?.user ? data : null
  } catch {
    return null
  }
}

export async function hashAnswer(text) {
  const enc = new TextEncoder().encode(text.toLowerCase().trim())
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
