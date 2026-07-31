import { supabase } from '../supabase/client'

export async function apiFetchStats() {
  const { data, error } = await supabase
    .from('app_stats')
    .select('*')
    .single()
  if (error) throw error
  return data
}
