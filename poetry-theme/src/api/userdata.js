import { supabase } from '../supabase/client'

export async function apiFetchUserData(userId) {
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function apiSaveUserData(userId, fields) {
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: userId, ...fields }, { onConflict: 'user_id' })
  if (error) throw error
}
