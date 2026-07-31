import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useSyncedState } from './useSyncedState'
import { apiSyncShelfBooks } from '../../api/shelfBooks'
import { supabase } from '../../supabase/client'
import {
  apiResolveUser, apiSendMessage, apiFetchMessages, apiMarkMessageRead, toClientMessage,
} from '../../api/messages'

const BookContext = createContext(null)

const STORAGE_KEY = 'poetry_bookshelf'
const INBOX_KEY = 'poetry_inbox'
const NOTIF_KEY = 'poetry_notifs'

export function BookProvider({ children }) {
  const { user } = useAuth()
  const [shelf, setShelf] = useSyncedState(user?.id, 'shelf', STORAGE_KEY)
  const [inbox, setInbox] = useSyncedState(user?.id, 'inbox', INBOX_KEY)
  const [notifs, setNotifs] = useSyncedState(user?.id, 'notifications', NOTIF_KEY)

  useEffect(() => {
    if (!user?.id) return
    const t = setTimeout(() => {
      apiSyncShelfBooks(user.id, shelf).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [shelf, user?.id])

  const addIncoming = useCallback((msg) => {
    setInbox((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev
      return [msg, ...prev]
    })
  }, [setInbox])

  useEffect(() => {
    if (!user?.id) return
    const channel = supabase
      .channel(`messages:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=eq.${user.id}`,
      }, (payload) => addIncoming(toClientMessage(payload.new)))
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${user.id}`,
      }, (payload) => addIncoming(toClientMessage(payload.new)))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user?.id, addIncoming])

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    const poll = async () => {
      try {
        const rows = await apiFetchMessages(user.id)
        if (cancelled) return
        const msgs = rows.map(toClientMessage)
        setInbox((prev) => {
          const existing = new Set(prev.map((m) => m.id))
          const fresh = msgs.filter((m) => !existing.has(m.id))
          return fresh.length ? [...fresh, ...prev] : prev
        })
      } catch {}
    }
    const first = setTimeout(poll, 1500)
    const iv = setInterval(poll, 12000)
    const onVis = () => { if (document.visibilityState === 'visible') poll() }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      clearTimeout(first)
      clearInterval(iv)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [user?.id, setInbox])

  const addBook = useCallback((book) => {
    const loc = {
      country: localStorage.getItem('poetry_country') || user?.country || '',
      state: localStorage.getItem('poetry_state') || user?.state || '',
      zip: localStorage.getItem('poetry_zip') || user?.zip || '',
    }
    setShelf((prev) => [{ ...book, ...loc, id: Date.now(), addedAt: new Date().toISOString(), sent: false, received: false, userId: user?.id }, ...prev])
  }, [user])

  const removeBook = useCallback((id) => {
    setShelf((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const markSent = useCallback((id) => {
    setShelf((prev) => prev.map((b) => b.id === id ? { ...b, sent: true } : b))
  }, [])

  const markReceived = useCallback((id) => {
    setShelf((prev) => prev.map((b) => b.id === id ? { ...b, received: true } : b))
  }, [])

  const sendMessage = useCallback(async (to, bookTitle, message) => {
    const from = user?.username || 'Anonymous'
    const msg = {
      id: Date.now(),
      from,
      to,
      bookTitle,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      pending: true,
    }
    if (inbox.some((m) =>
      m.from === msg.from && m.to === msg.to &&
      m.bookTitle === msg.bookTitle && m.message === msg.message && !m.pending)) {
      return
    }
    setInbox((prev) => [msg, ...prev])
    try {
      const recipient = await apiResolveUser(to)
      if (!recipient) throw new Error('Recipient not found')
      const row = await apiSendMessage({
        senderId: user?.id,
        recipientId: recipient.id,
        senderUsername: from,
        recipientUsername: to,
        bookTitle,
        message,
      })
      setInbox((prev) => {
        const mapped = prev.map((m) => (m.id === msg.id ? { ...m, id: row.id, pending: false, failed: false } : m))
        const seen = new Set()
        return mapped.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)))
      })
    } catch {
      setInbox((prev) => prev.map((m) => m.id === msg.id ? { ...m, failed: true } : m))
    }
  }, [user, inbox, setInbox])

  const markRead = useCallback((id) => {
    setInbox((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
    if (typeof id === 'string') apiMarkMessageRead(id).catch(() => {})
  }, [setInbox])

  const addNotif = useCallback((text) => {
    setNotifs((prev) => [{ id: Date.now(), text, timestamp: new Date().toISOString(), read: false }, ...prev])
  }, [setNotifs])

  const markNotifRead = useCallback((id) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }, [setNotifs])

  const clearNotifs = useCallback(() => { setNotifs([]) }, [setNotifs])

  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs])
  const inboxUnread = useMemo(() => inbox.filter((m) => !m.read).length, [inbox])

  const ctx = useMemo(() => ({
    shelf, addBook, removeBook, markSent, markReceived,
    inbox, sendMessage, markRead, inboxUnread,
    notifs, addNotif, markNotifRead, clearNotifs, unreadCount,
  }), [shelf, inbox, notifs, addBook, removeBook, markSent, markReceived, sendMessage, markRead, addNotif, markNotifRead, clearNotifs, unreadCount, inboxUnread])

  return <BookContext.Provider value={ctx}>{children}</BookContext.Provider>
}

export function useBook() {
  const ctx = useContext(BookContext)
  if (!ctx) throw new Error('useBook must be used within BookProvider')
  return ctx
}
