import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useSyncedState } from './useSyncedState'
import { apiSyncShelfBooks } from '../../api/shelfBooks'

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

  const sendMessage = useCallback((to, bookTitle, message) => {
    const msg = {
      id: Date.now(),
      from: user?.username || 'Anonymous',
      to,
      bookTitle,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    }
    if (inbox.some((m) =>
      m.from === msg.from && m.to === msg.to &&
      m.bookTitle === msg.bookTitle && m.message === msg.message)) {
      return
    }
    setInbox((prev) => [msg, ...prev])
    addNotif(`New message from ${msg.from} about "${bookTitle}"`)
  }, [user, inbox])

  const markRead = useCallback((id) => {
    setInbox((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
  }, [])

  const addNotif = useCallback((text) => {
    setNotifs((prev) => [{ id: Date.now(), text, timestamp: new Date().toISOString(), read: false }, ...prev])
  }, [])

  const markNotifRead = useCallback((id) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }, [])

  const clearNotifs = useCallback(() => { setNotifs([]) }, [])

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
