import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { poems as allPoems } from '../data/poems'
import { useAuth } from '../auth/AuthContext'

const FAV_KEY = 'poetry-favorites'
const MY_POEMS_KEY = 'poetry-my-poems'
const RECENT_KEY = 'poetry-recently-viewed'
const MAX_RECENT = 8

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || [] } catch { return [] }
}

function loadMyPoems(username) {
  try { return JSON.parse(localStorage.getItem(`${MY_POEMS_KEY}-${username}`)) || [] } catch { return [] }
}

function saveMyPoems(username, list) {
  localStorage.setItem(`${MY_POEMS_KEY}-${username}`, JSON.stringify(list))
}

function loadRecentlyViewed(username) {
  try { return JSON.parse(localStorage.getItem(`${RECENT_KEY}-${username}`)) || [] } catch { return [] }
}

function saveRecentlyViewed(username, list) {
  localStorage.setItem(`${RECENT_KEY}-${username}`, JSON.stringify(list))
}

const PoetryContext = createContext(null)

export function PoetryProvider({ children }) {
  const { user } = useAuth()
  const [queue, setQueue] = useState(() => {
    const start = Math.floor(Math.random() * Math.max(0, allPoems.length - 3))
    return allPoems.slice(start, start + 3)
  })
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [myPoems, setMyPoems] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [editRequest, setEditRequest] = useState(null)
  const loadedIds = useRef(new Set(queue.map((p) => p.id)))
  const allRef = useRef(allPoems)

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (user) {
      setMyPoems(loadMyPoems(user.username))
      setRecentlyViewed(loadRecentlyViewed(user.username))
    }
  }, [user])

  const addToRecentlyViewed = useCallback((poem) => {
    if (!poem || !user) return
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== poem.id)
      const updated = [poem, ...filtered].slice(0, MAX_RECENT)
      saveRecentlyViewed(user.username, updated)
      return updated
    })
  }, [user])

  const currentPoem = queue[index] || null
  const canSwipeLeft = index > 0
  const canSwipeRight = index < queue.length - 1 || queue.length < allRef.current.length

  const isUserPoem = useCallback((poem) => {
    if (!poem) return false
    return myPoems.some((p) => p.id === poem.id)
  }, [myPoems])

  const swipeRight = useCallback(() => {
    if (index < queue.length - 1) {
      setIndex((i) => i + 1)
      setExpanded(false)
      return
    }
    if (queue.length >= allRef.current.length) return
    setLoading(true)
    const next = allRef.current.find((p) => !loadedIds.current.has(p.id))
    if (next) {
      loadedIds.current.add(next.id)
      setQueue((prev) => [...prev, next])
      setTimeout(() => {
        setIndex((i) => i + 1)
        setExpanded(false)
        setLoading(false)
      }, 100)
    } else {
      setLoading(false)
    }
  }, [index, queue.length])

  const swipeLeft = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1)
      setExpanded(false)
    }
  }, [index])

  const resetQueue = useCallback(() => {
    const start = Math.floor(Math.random() * Math.max(0, allRef.current.length - 3))
    const fresh = allRef.current.slice(start, start + 3)
    loadedIds.current = new Set(fresh.map((p) => p.id))
    setQueue(fresh)
    setIndex(0)
    setExpanded(false)
  }, [])

  const openFullscreen = useCallback(() => setFullscreen(true), [])
  const closeFullscreen = useCallback(() => setFullscreen(false), [])

  const navigateToPoem = useCallback((poem) => {
    if (!poem) return
    loadedIds.current = new Set([poem.id, ...queue.map((p) => p.id)])
    setQueue([poem, ...queue.filter((p) => p.id !== poem.id)])
    setIndex(0)
    setExpanded(false)
    setFullscreen(true)
    addToRecentlyViewed(poem)
  }, [queue, addToRecentlyViewed])

  const addMyPoem = useCallback((poem) => {
    if (!user) return
    setMyPoems((prev) => {
      const updated = [poem, ...prev]
      saveMyPoems(user.username, updated)
      return updated
    })
  }, [user])

  const updateMyPoem = useCallback((id, data) => {
    if (!user) return
    setMyPoems((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      saveMyPoems(user.username, updated)
      return updated
    })
  }, [user])

  const deleteMyPoem = useCallback((id) => {
    if (!user) return
    setMyPoems((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      saveMyPoems(user.username, updated)
      return updated
    })
  }, [user])

  const toggleFavorite = useCallback((poemId, lineText) => {
    const key = `${poemId}::${lineText}`
    setFavorites((prev) => {
      const exists = prev.find((f) => f.key === key)
      if (exists) return prev.filter((f) => f.key !== key)
      const poem = allRef.current.find((p) => p.id === poemId) || myPoems.find((p) => p.id === poemId)
      return [...prev, {
        key,
        poemId,
        poemTitle: poem?.title || '',
        author: poem?.author || '',
        lineText,
        date: Date.now(),
      }]
    })
  }, [myPoems])

  const isFavorite = useCallback((poemId, lineText) => {
    const key = `${poemId}::${lineText}`
    return favorites.some((f) => f.key === key)
  }, [favorites])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const ctx = useMemo(() => ({
    currentPoem, queue, index, expanded, loading, fullscreen,
    canSwipeLeft, canSwipeRight,
    swipeRight, swipeLeft, setExpanded, resetQueue,
    openFullscreen, closeFullscreen, navigateToPoem,
    favorites, toggleFavorite, isFavorite, clearFavorites,
    total: allRef.current.length,
    myPoems, addMyPoem, updateMyPoem, deleteMyPoem, isUserPoem,
    editRequest, setEditRequest,
    recentlyViewed, addToRecentlyViewed,
  }), [currentPoem, queue, index, expanded, loading, fullscreen,
      canSwipeLeft, canSwipeRight,
      swipeRight, swipeLeft, setExpanded, resetQueue,
      openFullscreen, closeFullscreen, navigateToPoem,
      favorites, toggleFavorite, isFavorite, clearFavorites,
      myPoems, addMyPoem, updateMyPoem, deleteMyPoem, isUserPoem,
      editRequest, setEditRequest,
      recentlyViewed, addToRecentlyViewed])

  return (
    <PoetryContext.Provider value={ctx}>
      {children}
    </PoetryContext.Provider>
  )
}

export function usePoetry() {
  const ctx = useContext(PoetryContext)
  if (!ctx) throw new Error('usePoetry must be used within PoetryProvider')
  return ctx
}
