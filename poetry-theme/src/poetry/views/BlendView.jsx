import { useState, useEffect, useRef } from 'react'
import { useBook } from '../contexts/BookContext'
import { useAuth } from '../../auth/AuthContext'
import { COUNTRIES } from '../../constants/languages'
import { apiSearchShelfBooks } from '../../api/shelfBooks'
import LegalLinks from '../components/LegalLinks'

const geoCache = new Map()

function countryCodeFor(name) {
  return Object.entries(COUNTRIES).find(([, v]) => v.name === name)?.[0] || ''
}

async function geoFor(code, zip) {
  if (!code || !zip) return null
  const key = `${code}:${zip}`
  if (geoCache.has(key)) return geoCache.get(key)
  try {
    const res = await fetch(`https://api.zippopotam.us/${code}/${zip}`)
    if (!res.ok) throw new Error('not found')
    const data = await res.json()
    const p = data?.places?.[0]
    const g = p ? { lat: Number(p.latitude), lng: Number(p.longitude) } : null
    geoCache.set(key, g)
    return g
  } catch {
    geoCache.set(key, null)
    return null
  }
}

function haversine(a, b) {
  const R = 6371
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

function formatDist(km) {
  if (km < 1) return 'less than a km away'
  if (km < 1000) return `~${Math.round(km)} km away`
  return `~${(km / 1000).toFixed(1).replace(/\.0$/, '')}k km away`
}

function userLocation(user) {
  return {
    country: localStorage.getItem('poetry_country') || user?.country || '',
    state: localStorage.getItem('poetry_state') || user?.state || '',
    zip: localStorage.getItem('poetry_zip') || user?.zip || '',
  }
}

function holderLocationLabel(h) {
  const parts = []
  if (h.state) parts.push(h.state)
  if (h.country) parts.push(h.country)
  return parts.join(', ') || 'Location unknown'
}

function holderSort(a, b) {
  if (a.isSelf !== b.isSelf) return a.isSelf ? 1 : -1
  const avail = (x) => (x.h.availability === 'available' ? 0 : 1)
  if (avail(a) !== avail(b)) return avail(a) - avail(b)
  if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm
  if (a.distanceKm !== null) return -1
  if (b.distanceKm !== null) return 1
  return 0
}

export default function BlendView({ onNavigate, focusQuery, onOpenAuth }) {
  const { sendMessage, addNotif } = useBook()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [requestedKey, setRequestedKey] = useState(null)
  const runRef = useRef(null)

  async function runSearch(term) {
    const t = (term || '').trim()
    console.log('[BlendView] runSearch', t, 'busy', busy)
    if (!t || busy) return
    setBusy(true)
    setError('')
    setResults(null)
    try {
      const rows = await apiSearchShelfBooks(t)
      console.log('[BlendView] rows', t, rows.length)

      const groups = new Map()
      for (const r of rows) {
        const key = `${r.title.trim().toLowerCase()}||${(r.author || '').trim().toLowerCase()}`
        if (!groups.has(key)) {
          groups.set(key, { title: r.title, author: r.author, subtitle: r.subtitle, summary: r.summary, holders: [] })
        }
        groups.get(key).holders.push(r)
      }

      const req = userLocation(user)
      const reqGeo = req.country && req.zip
        ? await geoFor(countryCodeFor(req.country), req.zip)
        : null

      const out = []
      for (const g of groups.values()) {
        const holders = []
        for (const h of g.holders) {
          const isSelf = h.user_id === user?.id
          let distanceKm = null
          if (!isSelf && reqGeo && h.country && h.zip) {
            const g2 = await geoFor(countryCodeFor(h.country), h.zip)
            if (g2) distanceKm = haversine(reqGeo, g2)
          }
          holders.push({ h, distanceKm, isSelf })
        }
        holders.sort(holderSort)
        out.push({ ...g, holders })
      }
      setResults(out)
      console.log('[BlendView] done → groups', out.length, out.map((g) => `${g.title} (${g.holders.length} holders)`))
    } catch {
      setError('Search failed — try again.')
      setResults([])
    } finally {
      setBusy(false)
    }
  }
  runRef.current = runSearch

  useEffect(() => {
    console.log('[BlendView] focusQuery effect', focusQuery)
    if (focusQuery && focusQuery.q) {
      setQuery(focusQuery.q)
      runRef.current(focusQuery.q)
    }
  }, [focusQuery])

  function handleRequest(book, holder) {
    const holderName = holder.h.holder_username || holder.h.holder_name || 'Reader'
    if (!user) {
      if (onOpenAuth) { onOpenAuth(); return }
      addNotif('Sign in to request a book')
      return
    }
    const key = `${book.title}|${holder.h.holder_username || holderName}`
    if (requestedKey === key) return
    sendMessage(holder.h.holder_username || holderName, book.title,
      `Hai, I'm interested in reading "${book.title}" can you please share.`)
    addNotif(`Request sent to ${holderName} for "${book.title}"`)
    setRequestedKey(key)
    setTimeout(() => { if (onNavigate) onNavigate('inbox') }, 700)
  }

  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          Blend
        </h2>
      </div>

      {!results && (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>
            Use the search bar above to find a book — discover nearby readers who have it.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
            Your books travel the world, one reader at a time.
          </p>
        </div>
      )}

      {busy && (
        <div className="flex items-center justify-center gap-2 py-8">
          <span className="w-5 h-5 rounded-full border-2 border-transparent animate-spin inline-block"
            style={{ borderTopColor: 'var(--tp-secondary)' }} />
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>Searching the world for "{query}"...</span>
        </div>
      )}

      {error && !busy && (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{error}</p>
        </div>
      )}

      {results && results.length === 0 && !busy && !error && (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>
            No one has listed this book yet. Try a different name, or add it to your shelf to make it findable.
          </p>
        </div>
      )}

      {results && results.length > 0 && !busy && (
        <div className="space-y-3">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--tp-text-secondary)' }}>
            {results.length} book{results.length > 1 ? 's' : ''} found for "{query}"
          </p>
          {results.map((book, i) => (
            <div key={i} className="rounded-xl p-4 transition-all duration-200"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{book.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--tp-secondary)' }}>{book.author}</p>
              {book.subtitle && <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>{book.subtitle}</p>}

              <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--tp-border)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--tp-text-secondary)' }}>
                  {book.holders.length} holder{book.holders.length > 1 ? 's' : ''}
                </p>
                {book.holders.map((item, j) => (
                  <div key={j} className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--tp-text)' }}>
                        {item.h.holder_name || item.h.holder_username || 'Reader'}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>
                        {item.distanceKm !== null ? (
                          <span style={{ color: 'var(--tp-secondary)' }}>{formatDist(item.distanceKm)}</span>
                        ) : (
                          holderLocationLabel(item.h)
                        )}
                      </p>
                    </div>
                    {item.isSelf ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: 'color-mix(in srgb, #22c55e 18%, transparent)', color: '#22c55e' }}>
                        You hold this
                      </span>
                    ) : item.h.availability === 'available' ? (
                      (() => {
                        const reqKey = `${book.title}|${item.h.holder_username || item.h.holder_name || 'Reader'}`
                        const sent = requestedKey === reqKey
                        return (
                          <button onClick={() => handleRequest(book, item)} disabled={sent}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-90 whitespace-nowrap"
                            style={{ backgroundColor: sent ? '#22c55e' : 'var(--tp-secondary)' }}>
                            {sent ? (
                              <span className="inline-flex items-center gap-1 animate-pop-in">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Sent
                              </span>
                            ) : 'Request'}
                          </button>
                        )
                      })()
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: 'color-mix(in srgb, #fbbf24 18%, transparent)', color: '#fbbf24' }}>
                        In transit
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 pb-2 mt-6" style={{ borderTop: '1px solid var(--tp-border)' }}>
        <LegalLinks onNavigate={onNavigate} />
      </div>
    </div>
  )
}
