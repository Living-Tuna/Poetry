import { supabase } from '../supabase/client'

export async function apiFetchNewsletterCount() {
  const { data, error } = await supabase.rpc('newsletter_count')
  if (error) throw error
  return data || 0
}

export async function apiSubscribeNewsletter(email) {
  const { data, error } = await supabase.rpc('subscribe_newsletter', {
    p_email: email.trim().toLowerCase(),
  })
  if (error) throw error
  return data !== false
}
