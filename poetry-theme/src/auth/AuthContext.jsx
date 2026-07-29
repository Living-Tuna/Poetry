import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, hashAnswer } from '../supabase/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {}
        setUser({
          id: session.user.id,
          username: meta.username || '',
          name: meta.name || meta.display_name || meta.username || 'User',
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
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const login = useCallback(async (username, password) => {
    const email = `${username.toLowerCase().trim()}@poetry.app`
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Invalid login')) return { ok: false, error: 'Invalid username or password' }
      return { ok: false, error: error.message }
    }
    return { ok: true }
  }, [])

  const signup = useCallback(async (username, password, name, question, answer) => {
    const u = username.toLowerCase().trim()
    const email = `${u}@poetry.app`
    const answerHash = await hashAnswer(answer)

    try {
      localStorage.setItem(`poetry_security_${u}`, JSON.stringify({
        question: question.trim(),
        answerHash,
      }))
    } catch {}

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: u,
          name: name.trim(),
          display_name: name.trim(),
          security_question: question.trim(),
          security_answer_hash: answerHash,
        },
      },
    })
    if (error) {
      if (error.message.includes('already registered')) return { ok: false, error: 'Username already taken' }
      return { ok: false, error: error.message }
    }
    return { ok: true }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const checkUsername = useCallback(async (_username) => {
    return { available: null, suggestions: [] }
  }, [])

  const getUserSecurityQuestion = useCallback(async (username) => {
    try {
      const stored = localStorage.getItem(`poetry_security_${username.toLowerCase().trim()}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.question || null
      }
    } catch {}
    return null
  }, [])

  const verifySecurityAnswer = useCallback(async (username, answer) => {
    const hash = await hashAnswer(answer)
    try {
      const stored = localStorage.getItem(`poetry_security_${username.toLowerCase().trim()}`)
      if (!stored) return { ok: false, error: 'Security data not found' }
      const parsed = JSON.parse(stored)
      return { ok: parsed.answerHash === hash }
    } catch {
      return { ok: false, error: 'Security data not found' }
    }
  }, [])

  const resetPassword = useCallback(async (_username, _answer, _newPassword) => {
    return { ok: false, error: 'PASSWORD_RESET_NEEDS_BACKEND' }
  }, [])

  const ctx = useMemo(() => ({
    user, loading, login, signup, logout,
    getUserSecurityQuestion, verifySecurityAnswer, resetPassword,
    checkUsername,
  }), [user, loading, login, signup, logout,
      getUserSecurityQuestion, verifySecurityAnswer, resetPassword,
      checkUsername])

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
