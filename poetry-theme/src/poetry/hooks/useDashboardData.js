import { useEffect, useState } from 'react'
import { apiFetchStats, apiGetCachedStats, STATS_CACHE_TTL } from '../../api/stats'
import { apiSubscribeOnlineCount } from '../../api/presence'
import { apiFetchNewsletterCount, apiSubscribeNewsletter } from '../../api/newsletter'

export function useDashboardData() {
  const [stats, setStats] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [newsletterCount, setNewsletterCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    const cached = apiGetCachedStats()
    if (cached) setStats(cached.stats)
    if (!cached || Date.now() - cached.ts > STATS_CACHE_TTL) {
      apiFetchStats()
        .then((data) => { if (!cancelled) setStats(data) })
        .catch(() => {})
    }
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const stop = apiSubscribeOnlineCount(setOnlineCount)
    return stop
  }, [])

  useEffect(() => {
    let cancelled = false
    apiFetchNewsletterCount()
      .then((n) => { if (!cancelled) setNewsletterCount(n) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return { stats, onlineCount, newsletterCount }
}

export function useNewsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')

  async function submit(e) {
    e.preventDefault()
    if (state === 'submitting') return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setState('submitting')
    try {
      await apiSubscribeNewsletter(email)
      setState('done')
      setEmail('')
    } catch {
      setState('error')
    }
  }

  return { email, setEmail, state, submit }
}
