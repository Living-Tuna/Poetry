import { supabase } from '../supabase/client'

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function computeStreak({ current = 0, best = 0, lastDay = '' } = {}) {
  const today = todayKey()
  if (!lastDay) return { current: 1, best: Math.max(1, best), lastDay: today }
  if (lastDay === today) return { current: Math.max(1, current), best, lastDay: today }
  const prev = new Date(`${lastDay}T00:00:00Z`)
  const t = new Date(`${today}T00:00:00Z`)
  const diff = Math.round((t - prev) / 86400000)
  if (diff === 1) {
    const cur = current + 1
    return { current: cur, best: Math.max(cur, best), lastDay: today }
  }
  return { current: 1, best, lastDay: today }
}

export function bumpFrequently(list = [], title) {
  const map = new Map((list || []).map((f) => [f.title, f.count]))
  map.set(title, (map.get(title) || 0) + 1)
  return [...map.entries()]
    .map(([t, count]) => ({ title: t, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function pushRecent(list = [], item, max = 8) {
  const out = (list || []).filter((r) => r.title !== item.title)
  return [item, ...out].slice(0, max)
}

export async function apiFetchReadingStats(userId) {
  const { data, error } = await supabase
    .from('reading_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function apiSaveReadingStats(userId, payload) {
  const { error } = await supabase
    .from('reading_stats')
    .upsert(
      { user_id: userId, ...payload, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  if (error) throw error
}
