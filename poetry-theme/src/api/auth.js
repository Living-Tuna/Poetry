import { supabase, hashAnswer } from '../supabase/client'

async function callFunction(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    let detail = error.message
    try {
      if (error.context && typeof error.context.json === 'function') {
        const res = await error.context.json()
        if (res?.error) detail = res.error
      }
    } catch {}
    const e = new Error(detail)
    e.context = error
    throw e
  }
  return data
}

export async function apiLogin(username, password) {
  const email = `${username.toLowerCase().trim()}@poetry.app`
  console.log('[API] login — email:', email)
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.log('[API] login failed:', error.message)
    if (error.message.includes('Invalid login')) return { ok: false, error: 'Invalid username or password' }
    return { ok: false, error: error.message }
  }
  console.log('[API] login ok')
  return { ok: true }
}

export async function apiSignup(username, password, name, question, answer, country = '', state = '', zip = '') {
  const u = username.toLowerCase().trim()
  const email = `${u}@poetry.app`
  const answerHash = await hashAnswer(answer)

  try {
    localStorage.setItem(`poetry_security_${u}`, JSON.stringify({
      question: question.trim(),
      answerHash,
    }))
  } catch {}

  console.log('[API] signup — email:', email, 'name:', name.trim())
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
        country,
        state,
        zip,
      },
    },
  })
  if (error) {
    const isRateLimit = error.message?.includes('429') || error.message?.includes('Too Many Requests') || error.message?.includes('rate limit')
    if (isRateLimit) return { ok: false, error: 'Too many signups. Please wait 1 minute and try again.' }
    if (error.message.includes('already registered')) return { ok: false, error: 'Username already taken' }
    if (data?.user) { console.log('[API] signup partial (user created despite error)'); return { ok: true } }
    console.log('[API] signup error:', error.message)
    return { ok: false, error: error.message }
  }
  console.log('[API] signup ok — user:', data?.user?.id)
  return { ok: true }
}

export async function apiCheckUsername(username) {
  try {
    console.log('[API] checkUsername:', username)
    const data = await callFunction('check-username', { username })
    console.log('[API] checkUsername result:', data)
    return { available: data.available ?? null, suggestions: data.suggestions ?? [] }
  } catch {
    console.log('[API] checkUsername failed (fallback)')
    return { available: null, suggestions: [] }
  }
}

export async function apiGetSecurityQuestion(username) {
  try {
    console.log('[API] getSecurityQuestion:', username)
    const data = await callFunction('forgot-password', {
      action: 'get_question', username,
    })
    console.log('[API] getSecurityQuestion result:', data)
    if (data.error) return { error: data.error }
    return { question: data.question || null }
  } catch (err) {
    console.log('[API] getSecurityQuestion error:', err?.message)
    try {
      const stored = localStorage.getItem(`poetry_security_${username.toLowerCase().trim()}`)
      if (stored) { console.log('[API] getSecurityQuestion (localStorage fallback)'); return { question: JSON.parse(stored).question || null } }
    } catch {}
    console.log('[API] getSecurityQuestion — not found')
    return { question: null }
  }
}

export async function apiVerifyAnswer(username, answer) {
  try {
    console.log('[API] verifyAnswer:', username)
    const data = await callFunction('forgot-password', {
      action: 'verify_answer', username, answer,
    })
    console.log('[API] verifyAnswer result:', data)
    return { ok: data.ok ?? false }
  } catch {
    console.log('[API] verifyAnswer failed, trying localStorage')
    const hash = await hashAnswer(answer)
    try {
      const stored = localStorage.getItem(`poetry_security_${username.toLowerCase().trim()}`)
      if (!stored) return { ok: false, error: 'Security data not found' }
      return { ok: JSON.parse(stored).answerHash === hash }
    } catch {
      return { ok: false, error: 'Security data not found' }
    }
  }
}

export async function apiResetPassword(username, answer, newPassword) {
  try {
    console.log('[API] resetPassword:', username)
    const data = await callFunction('forgot-password', {
      action: 'verify_and_reset', username, answer, new_password: newPassword,
    })
    console.log('[API] resetPassword result:', data)
    return { ok: data.ok ?? false }
  } catch (err) {
    console.log('[API] resetPassword error:', err.message)
    return { ok: false, error: err.message || 'PASSWORD_RESET_NEEDS_BACKEND' }
  }
}
