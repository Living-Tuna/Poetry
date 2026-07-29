import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, hashAnswer } from '../supabase/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.username || 'User',
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.username || 'User',
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
    const email = `${username.toLowerCase().trim()}@poetry.app`
    const answerHash = await hashAnswer(answer)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.toLowerCase().trim(), name: name.trim() },
      },
    })
    if (authError) return { ok: false, error: authError.message }
    if (!authData.user) return { ok: false, error: 'Signup failed' }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      username: username.toLowerCase().trim(),
      display_name: name.trim(),
      security_question: question.trim(),
      security_answer_hash: answerHash,
    })
    if (profileError) {
      if (profileError.message?.includes('duplicate key') || profileError.code === '23505') {
        return { ok: false, error: 'Username already taken' }
      }
      if (profileError.message?.includes('relation') || profileError.message?.includes('does not exist')) {
        // Table not deployed yet — auth user was created, report success
        return { ok: true, note: 'profile_pending' }
      }
      return { ok: false, error: 'Failed to create profile' }
    }

    return { ok: true }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const checkUsername = useCallback(async (username) => {
    const { data, error } = await supabase.functions.invoke('check-username', {
      body: { username },
    })
    if (error) {
      return { available: null, suggestions: [], error: error.message }
    }
    return { available: data.available ?? false, suggestions: data.suggestions ?? [] }
  }, [])

  const getUserSecurityQuestion = useCallback(async (username) => {
    const { data, error } = await supabase.functions.invoke('forgot-password', {
      body: { action: 'get_question', username },
    })
    if (error || !data?.question) return null
    return data.question
  }, [])

  const verifySecurityAnswer = useCallback(async (username, answer) => {
    const { data, error } = await supabase.functions.invoke('forgot-password', {
      body: { action: 'verify_answer', username, answer },
    })
    if (error) return { ok: false, error: error.message || 'Verification failed' }
    return { ok: data.ok ?? false }
  }, [])

  const resetPassword = useCallback(async (username, answer, newPassword) => {
    const { data, error } = await supabase.functions.invoke('forgot-password', {
      body: { action: 'verify_and_reset', username, answer, new_password: newPassword },
    })
    if (error) return { ok: false, error: error.message || 'Reset failed' }
    return { ok: data.ok ?? false }
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
