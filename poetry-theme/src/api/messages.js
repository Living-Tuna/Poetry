import { supabase } from '../supabase/client'

export async function apiResolveUser(username) {
  const uname = String(username || '').trim()
  if (!uname) return null
  const { data, error } = await supabase
    .from('public_profiles')
    .select('id, username, name')
    .ilike('username', uname)
    .limit(1)
  if (error || !data || !data.length) {
    const res = await supabase
      .from('public_profiles')
      .select('id, username, name')
      .ilike('name', uname)
      .limit(1)
    if (res.error || !res.data || !res.data.length) return null
    return res.data[0]
  }
  return data[0]
}

export async function apiSendMessage({ senderId, recipientId, senderUsername, recipientUsername, bookTitle, message, kind = 'chat', requestId = null, author = '' }) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      sender_username: senderUsername,
      recipient_username: recipientUsername,
      book_title: bookTitle || '',
      message,
      kind,
      request_id: requestId,
      author,
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function apiFetchMessages(userId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return data || []
}

export async function apiMarkMessageRead(id) {
  await supabase.from('messages').update({ read: true }).eq('id', id)
}

export function toClientMessage(row) {
  return {
    id: row.id,
    from: row.sender_username,
    to: row.recipient_username,
    bookTitle: row.book_title,
    message: row.message,
    kind: row.kind || 'chat',
    requestId: row.request_id || null,
    author: row.author || '',
    timestamp: row.created_at,
    read: row.read,
    pending: false,
  }
}
