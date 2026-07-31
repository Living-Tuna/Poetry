import { supabase } from '../supabase/client'
import { apiResolveUser } from './messages'
import { apiFetchReadingStats } from './reading'

export async function apiGetProfile(userId) {
  console.log('[API] getProfile:', userId)
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) { console.log('[API] getProfile error:', error); throw error }
  console.log('[API] getProfile result:', data)
  return data
}

export async function apiFetchUserPoems(userId) {
  console.log('[API] fetchUserPoems:', userId)
  const { data } = await supabase
    .from('poems')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  console.log('[API] fetchUserPoems result count:', data?.length ?? 0)
  return data || []
}

export async function apiFetchPersonProfile(username) {
  const profile = await apiResolveUser(username)
  if (!profile) return null
  const [stats, shelfRes, favRes] = await Promise.all([
    apiFetchReadingStats(profile.id).catch(() => null),
    supabase
      .from('shelf_books')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.rpc('get_public_favorites', { target_user_id: profile.id }).catch(() => null),
  ])
  return {
    profile,
    stats,
    shelf: (shelfRes?.data || []).map((b) => ({
      title: b.title,
      author: b.author,
      subtitle: b.subtitle,
      availability: b.availability,
      country: b.country,
      state: b.state,
    })),
    favorites: Array.isArray(favRes?.data) ? favRes.data : [],
  }
}
