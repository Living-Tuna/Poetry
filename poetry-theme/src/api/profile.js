import { supabase } from '../supabase/client'

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
