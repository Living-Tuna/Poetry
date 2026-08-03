import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { supabase } from '../supabase/client'
import { translate } from '../language/translator'
import {
  apiLogin, apiSignup, apiCheckUsername,
  apiGetSecurityQuestion, apiVerifyAnswer, apiResetPassword,
} from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const lastSignup = useRef(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {}
        setUser({
          id: session.user.id,
          username: meta.username || '',
          name: meta.name || meta.display_name || meta.username || 'User',
          country: meta.country || '',
          state: meta.state || '',
          zip: meta.zip || '',
          lat: meta.lat ? String(meta.lat) : '',
          lng: meta.lng ? String(meta.lng) : '',
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {}
        setUser({
          id: session.user.id,
          username: meta.username || '',
          name: meta.name || meta.display_name || meta.username || 'User',
          country: meta.country || '',
          state: meta.state || '',
          zip: meta.zip || '',
          lat: meta.lat ? String(meta.lat) : '',
          lng: meta.lng ? String(meta.lng) : '',
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const login = useCallback(async (username, password) => {
    return apiLogin(username, password)
  }, [])

  const signup = useCallback(async (username, password, name, question, answer, country, state, zip) => {
    const now = Date.now()
    if (now - lastSignup.current < 10000) return { ok: false, error: translate('auth.throttle') }
    lastSignup.current = now
    return apiSignup(username, password, name, question, answer, country, state, zip)
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const ctx = useMemo(() => ({
    user, loading, login, signup, logout,
    getUserSecurityQuestion: apiGetSecurityQuestion,
    verifySecurityAnswer: apiVerifyAnswer,
    resetPassword: apiResetPassword,
    checkUsername: apiCheckUsername,
  }), [user, loading, login, signup, logout])

  return (
    <AuthContext.Provider value={ctx}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
