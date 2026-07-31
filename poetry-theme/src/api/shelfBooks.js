import { supabase } from '../supabase/client'

export async function apiSyncShelfBooks(userId, items) {
  await supabase.from('shelf_books').delete().eq('user_id', userId)
  if (!items.length) return
  const rows = items.map((b) => ({
    user_id: userId,
    title: String(b.title || '').trim(),
    author: String(b.author || '').trim(),
    subtitle: String(b.subtitle || '').trim(),
    page_count: String(b.page_count || ''),
    summary: String(b.summary || '').trim(),
    availability: b.sent && !b.received ? 'in_transit' : 'available',
    country: b.country || '',
    state: b.state || '',
    zip: b.zip || '',
  }))
  const { error } = await supabase.from('shelf_books').insert(rows)
  if (error) throw error
}

export async function apiSearchShelfBooks(query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return []
  const { data, error } = await supabase
    .from('shelf_books_with_users')
    .select('*')
    .or(`title.ilike.%${q}%,author.ilike.%${q}%`)
    .limit(200)
  if (error) throw error
  return data || []
}
