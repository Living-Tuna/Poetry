import { supabase } from '../supabase/client'

export async function apiFetchAllPoems() {
  console.log('[API] fetchAllPoems')
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .order('likes', { ascending: false })
  if (error) { console.log('[API] fetchAllPoems error:', error); throw error }
  console.log('[API] fetchAllPoems result count:', data?.length ?? 0)
  return data || []
}

export async function apiAddPoem(poem, userId, username) {
  console.log('[API] addPoem — title:', poem.title, 'userId:', userId, 'author:', username)
  const { data, error } = await supabase
    .from('poems')
    .insert({
      user_id: userId,
      title: poem.title,
      content: poem.content,
      author: username,
      categories: poem.categories || [],
      language: poem.language || 'en',
    })
    .select()
    .single()
  if (error) { console.log('[API] addPoem error:', error); throw error }
  console.log('[API] addPoem result id:', data.id)
  return data
}

export async function apiUpdatePoem(id, title, content, categories, language) {
  console.log('[API] updatePoem — id:', id, 'title:', title)
  const { error } = await supabase
    .from('poems')
    .update({ title, content, categories: categories || [], language: language || 'en' })
    .eq('id', id)
  if (error) { console.log('[API] updatePoem error:', error); throw error }
  console.log('[API] updatePoem ok')
}

export async function apiDeletePoem(id) {
  console.log('[API] deletePoem — id:', id)
  const { error } = await supabase
    .from('poems')
    .delete()
    .eq('id', id)
  if (error) { console.log('[API] deletePoem error:', error); throw error }
  console.log('[API] deletePoem ok')
}

export async function apiSetPoemLike(poemId, liked) {
  const { data, error } = await supabase.rpc('bump_poem_likes', {
    poem_id: String(poemId),
    delta: liked ? 1 : -1,
  })
  if (error) { console.log('[API] setPoemLike error:', error); throw error }
  console.log('[API] setPoemLike — liked:', liked, 'newLikes:', data)
  return data
}
