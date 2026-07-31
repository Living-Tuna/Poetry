import { supabase } from '../supabase/client'

const CACHE_KEY = 'poetry_stats_cache'
export const STATS_CACHE_TTL = 60 * 60 * 1000

export function apiGetCachedStats() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.stats ? parsed : null
  } catch {
    return null
  }
}

export async function apiFetchStats() {
  const { data, error } = await supabase
    .from('app_stats')
    .select('*')
    .single()
  if (error) throw error
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ stats: data, ts: Date.now() }))
  } catch {}
  return data
}
