import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../language/LanguageProvider'
import { apiFetchAllPoems, apiAddPoem, apiUpdatePoem, apiDeletePoem, apiSetPoemLike } from '../api/poems'
import { apiFetchUserPoems } from '../api/profile'
import { computeStreak, bumpFrequently, pushRecent, apiSaveReadingStats } from '../api/reading'
import { useSyncedState } from './contexts/useSyncedState'
import { isIndependentPoem } from '../constants'
import { getTodaysArticles } from '../constants/seedArticles'

const MY_POEMS_KEY = 'poetry-my-poems'
const RECENT_KEY = 'poetry-recently-viewed'
const LIKED_KEY = 'poetry-liked-poems'
const READING_KEY = 'poetry-reading'
const MAX_RECENT = 8

function prefixedKey(prefix, username) {
  return username ? `${prefix}-${username}` : prefix
}

function loadArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}

function saveArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr))
}

const PoetryContext = createContext(null)

export function PoetryProvider({ children }) {
  const { user } = useAuth()
  const [allPoems, setAllPoems] = useState([])
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useSyncedState(user?.id, 'favorites', prefixedKey('poetry-favorites', user?.username), Boolean(user))
  const [myPoems, setMyPoems] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useSyncedState(user?.id, 'recently_viewed', prefixedKey(RECENT_KEY, user?.username), Boolean(user))
  const [editRequest, setEditRequest] = useState(null)
  const [editOnOpen, setEditOnOpen] = useState(false)
  const [myPoemsCachedOnly, setMyPoemsCachedOnly] = useState(true)
  const [likedPoems, setLikedPoems] = useState(() => loadArray(prefixedKey(LIKED_KEY, user?.username)))
  const likedRef = useRef(new Set(likedPoems))
  const loadedIds = useRef(new Set())
  const allRef = useRef([])
  const { lang, setLang } = useLanguage()
  const langRef = useRef(lang)

  useEffect(() => {
    langRef.current = lang
  }, [lang])
  const [reading, setReading] = useState(null)
  const readingRef = useRef(null)
  const saveReadingRef = useRef(null)

  const readingKey = prefixedKey(READING_KEY, user?.username)

  useEffect(() => {
    if (user) {
      let parsed = null
      try { parsed = JSON.parse(localStorage.getItem(readingKey)) || null } catch { parsed = null }
      readingRef.current = parsed
      setReading(parsed)
    } else {
      readingRef.current = null
      setReading(null)
    }
  }, [readingKey, user])

  const recordRead = useCallback((poem) => {
    if (!user || !poem) return
    const prev = readingRef.current || { streakCurrent: 0, streakBest: 0, lastDay: '', recentlyRead: [], frequentlyRead: [] }
    const streak = computeStreak({ current: prev.streakCurrent, best: prev.streakBest, lastDay: prev.lastDay })
    const item = { title: poem.title || 'Untitled', author: poem.author || '', ts: Date.now() }
    const next = {
      streakCurrent: streak.current,
      streakBest: streak.best,
      lastDay: streak.lastDay,
      recentlyRead: pushRecent(prev.recentlyRead, item),
      frequentlyRead: bumpFrequently(prev.frequentlyRead, item.title),
    }
    readingRef.current = next
    setReading(next)
    try { localStorage.setItem(readingKey, JSON.stringify(next)) } catch {}
    if (saveReadingRef.current) clearTimeout(saveReadingRef.current)
    saveReadingRef.current = setTimeout(() => {
      apiSaveReadingStats(user.id, next).catch(() => {})
    }, 1200)
  }, [user, readingKey])

  useEffect(() => {
    const arr = loadArray(prefixedKey(LIKED_KEY, user?.username))
    likedRef.current = new Set(arr)
    setLikedPoems(arr)
  }, [user])

  const poemsForLang = useCallback((code) => {
    let poems = allRef.current.filter((p) => (p.language || 'en') === code)
    if (poems.length === 0) poems = allRef.current.filter((p) => (p.language || 'en') === 'en')
    return poems
  }, [])

  const seedQueue = useCallback(() => {
    let poems = poemsForLang(langRef.current)
    if (poems.length === 0) poems = getTodaysArticles(langRef.current)
    if (poems.length > 0) {
      const maxStart = Math.max(0, poems.length - 3)
      const start = Math.min(Math.floor(Math.random() * maxStart), maxStart)
      const slice = poems.slice(start, start + 3)
      loadedIds.current = new Set(slice.map((p) => p.id))
      setQueue(slice)
    }
  }, [poemsForLang])

  useEffect(() => {
    let cancelled = false
    async function load() {
      let data = null
      try {
        data = await apiFetchAllPoems()
      } catch (err) {
        console.error('Failed to load poems from Supabase:', err)
      }
      if (cancelled) return
      if (!data || data.length === 0) {
        data = getTodaysArticles(langRef.current)
      }
      setAllPoems(data)
      allRef.current = data
      seedQueue()
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [seedQueue])

  useEffect(() => {
    if (!user) { setMyPoems([]); return }
    setMyPoems(loadArray(prefixedKey(MY_POEMS_KEY, user.username)))
    loadUserPoems()
  }, [user])

  async function loadUserPoems() {
    if (!user) return
    try {
      const data = await apiFetchUserPoems(user.id)
      if (data) {
        setMyPoemsCachedOnly(false)
        setMyPoems((prev) => {
          const sbIds = new Set(data.map((p) => String(p.id)))
          const merged = [...data, ...prev.filter((p) => !sbIds.has(String(p.id)))]
          const seen = new Set()
          return merged.filter((p) => { const k = String(p.id); if (seen.has(k)) return false; seen.add(k); return true })
        })
      }
    } catch { setMyPoemsCachedOnly(true) }
  }

  const addToRecentlyViewed = useCallback((poem) => {
    if (!poem || !user) return
    setRecentlyViewed((prev) => {
      const id = String(poem.id)
      const filtered = prev.filter((p) => String(p.id) !== id)
      return [poem, ...filtered].slice(0, MAX_RECENT)
    })
  }, [user])

  const currentPoem = queue[index] || null
  const canSwipeLeft = index > 0
  const canSwipeRight = index < queue.length - 1 || queue.length < poemsForLang(langRef.current).length

  const isUserPoem = useCallback((poem) => {
    if (!poem) return false
    return myPoems.some((p) => p.id === poem.id)
  }, [myPoems])

  const enqueueNext = useCallback(() => {
    const deck = poemsForLang(langRef.current)
    if (queue.length >= deck.length) return
    const next = deck.find((p) => !loadedIds.current.has(p.id))
    if (next) {
      loadedIds.current.add(next.id)
      setQueue((prev) => [...prev, next])
    }
  }, [queue.length, poemsForLang])

  const swipeRight = useCallback(() => {
    if (index < queue.length - 1) {
      const nextPoem = queue[index + 1]
      if (nextPoem) recordRead(nextPoem)
      setIndex((i) => i + 1)
      setExpanded(false)
      return
    }
    const deck = poemsForLang(langRef.current)
    if (queue.length >= deck.length) return
    const next = deck.find((p) => !loadedIds.current.has(p.id))
    if (next) {
      loadedIds.current.add(next.id)
      setQueue((prev) => [...prev, next])
      setIndex((i) => i + 1)
      setExpanded(false)
      recordRead(next)
    }
  }, [index, queue.length, recordRead, poemsForLang])

  const swipeLeft = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1)
      setExpanded(false)
    }
  }, [index])

  const resetQueue = useCallback(() => {
    seedQueue()
  }, [seedQueue])

  const changeLanguage = useCallback((code) => {
    if (!code || code === langRef.current) return
    langRef.current = code
    setLang(code)
    try { localStorage.setItem('poetry_lang', code) } catch {}
    seedQueue()
  }, [seedQueue])

  const openFullscreen = useCallback(() => setFullscreen(true), [])
  const closeFullscreen = useCallback(() => setFullscreen(false), [])

  const navigateToPoem = useCallback((poem) => {
    console.log('[PoetryContext] navigateToPoem', poem?.id, poem?.title, 'queue', queue.length)
    if (!poem) return
    loadedIds.current = new Set([poem.id, ...queue.map((p) => p.id)])
    setQueue([poem, ...queue.filter((p) => p.id !== poem.id)])
    setIndex(0)
    setExpanded(false)
    setFullscreen(true)
    addToRecentlyViewed(poem)
    recordRead(poem)
  }, [queue, addToRecentlyViewed, recordRead])

  const addMyPoem = useCallback(async (poem) => {
    if (!user) return
    let saved = poem
    try {
      saved = await apiAddPoem(poem, user.id, user.username)
    } catch { }
    setMyPoems((prev) => {
      const updated = [saved, ...prev]
      saveArray(prefixedKey(MY_POEMS_KEY, user.username), updated)
      return updated
    })
  }, [user])

  const updateMyPoem = useCallback(async (id, data) => {
    if (!user) return
    if (typeof id === 'string' && id.length > 20) {
      try {
        await apiUpdatePoem(id, data.title, data.content, data.categories, data.language)
      } catch { }
    }
    const allIdx = allRef.current.findIndex((p) => p.id === id)
    if (allIdx !== -1) {
      allRef.current[allIdx] = { ...allRef.current[allIdx], ...data }
      setAllPoems([...allRef.current])
    }
    setMyPoems((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      saveArray(prefixedKey(MY_POEMS_KEY, user.username), updated)
      return updated
    })
  }, [user])

  const deleteMyPoem = useCallback(async (id) => {
    if (!user) return
    if (typeof id === 'string' && id.length > 20) {
      try {
        await apiDeletePoem(id)
      } catch { }
    }
    setMyPoems((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      saveArray(prefixedKey(MY_POEMS_KEY, user.username), updated)
      return updated
    })
  }, [user])

  const upsertFavorite = useCallback((poemId, favorite) => {
    setFavorites((prev) => {
      const poem = allRef.current.find((p) => p.id === poemId) || myPoems.find((p) => p.id === poemId)
      const existing = prev.find((f) => f.key === favorite.key)
      const next = {
        ...favorite,
        poemId,
        poemTitle: favorite.poemTitle || poem?.title || '',
        author: favorite.author || poem?.author || '',
        date: existing?.date || Date.now(),
      }
      if (existing) return prev.map((f) => (f.key === favorite.key ? next : f))
      return [...prev, next]
    })
  }, [myPoems])

  const removeFavorite = useCallback((key) => {
    setFavorites((prev) => prev.filter((f) => f.key !== key))
  }, [])

  const isFavorite = useCallback((poemId, lineText) => {
    const key = `${poemId}::${lineText}`
    return favorites.some((f) => f.key === key)
  }, [favorites])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const hasLiked = useCallback((poemId) => likedRef.current.has(String(poemId)), [])

  const toggleLikePoem = useCallback(async (poem) => {
    if (!poem || !isIndependentPoem(poem)) return
    const id = String(poem.id)
    const liked = !likedRef.current.has(id)
    const next = liked ? [...likedPoems, id] : likedPoems.filter((x) => x !== id)
    if (liked) likedRef.current.add(id); else likedRef.current.delete(id)
    setLikedPoems(next)
    saveArray(prefixedKey(LIKED_KEY, user?.username), next)

    const idx = allRef.current.findIndex((p) => String(p.id) === id)
    if (idx !== -1) {
      allRef.current[idx] = { ...allRef.current[idx], likes: Math.max(0, (allRef.current[idx].likes ?? 0) + (liked ? 1 : -1)) }
      setAllPoems([...allRef.current])
    }

    try {
      const newLikes = await apiSetPoemLike(id, liked)
      if (typeof newLikes === 'number' && idx !== -1) {
        allRef.current[idx] = { ...allRef.current[idx], likes: newLikes }
        setAllPoems([...allRef.current])
      }
    } catch {
      if (liked) likedRef.current.delete(id); else likedRef.current.add(id)
      setLikedPoems(liked ? likedPoems.filter((x) => x !== id) : [...likedPoems, id])
      if (idx !== -1) {
        allRef.current[idx] = { ...allRef.current[idx], likes: Math.max(0, (allRef.current[idx].likes ?? 0) + (liked ? -1 : 1)) }
        setAllPoems([...allRef.current])
      }
    }
  }, [likedPoems, user])

  const ctx = useMemo(() => ({
    currentPoem, queue, index, expanded, loading: loading || !allPoems.length, fullscreen,
    canSwipeLeft, canSwipeRight,
    swipeRight, swipeLeft, enqueueNext, setExpanded, resetQueue,
    openFullscreen, closeFullscreen, navigateToPoem,
    lang, changeLanguage,
    favorites, upsertFavorite, removeFavorite, isFavorite, clearFavorites,
    likedPoems, hasLiked, toggleLikePoem,
    total: allRef.current.length,
    allPoems: allRef.current,
    myPoems, addMyPoem, updateMyPoem, deleteMyPoem, isUserPoem,
    editRequest, setEditRequest, editOnOpen, setEditOnOpen,
    recentlyViewed, addToRecentlyViewed,
    myPoemsCachedOnly,
    reading, recordRead,
  }), [currentPoem, queue, index, expanded, loading, allPoems, fullscreen,
      canSwipeLeft, canSwipeRight,
      swipeRight, swipeLeft, enqueueNext, setExpanded, resetQueue,
      openFullscreen, closeFullscreen, navigateToPoem,
      lang, changeLanguage,
      favorites, upsertFavorite, removeFavorite, isFavorite, clearFavorites,
      likedPoems, hasLiked, toggleLikePoem,
      myPoems, addMyPoem, updateMyPoem, deleteMyPoem, isUserPoem,
      editRequest, setEditRequest, editOnOpen, setEditOnOpen,
      recentlyViewed, addToRecentlyViewed,
      myPoemsCachedOnly, reading, recordRead])

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
