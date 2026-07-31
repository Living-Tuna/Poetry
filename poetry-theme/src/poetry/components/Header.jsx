import { useState, useRef, useEffect, useMemo } from 'react'
import { apiSearchShelfBooks } from '../../api/shelfBooks'

const SCOPES = {
  favorites: 'favourites',
  blend: 'books',
}

const PLACEHOLDERS = {
  poems: 'Search poems or poets...',
  favourites: 'Search your favourite lines...',
  books: 'Search books to borrow...',
}

export default function Header({
  onMenuToggle, onProfileToggle, lang, onLangClick,
  allPoems, onSearchSelect, favorites, view,
  onOpenBooks, onOpenFavorites,
  chatContact, chatName, onChatBack, onChatProfile,
  notice, onNoticeClick,
}) {
  const scope = SCOPES[view] || 'poems'
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [panelTop, setPanelTop] = useState(0)
  const [bookResults, setBookResults] = useState([])
  const [bookBusy, setBookBusy] = useState(false)
  const clusterRef = useRef(null)
  const headerRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus()
    console.log('[Header] searchOpen', searchOpen)
  }, [searchOpen])

  useEffect(() => {
    function measure() {
      if (headerRef.current) setPanelTop(headerRef.current.getBoundingClientRect().bottom)
    }
    if (searchOpen) {
      measure()
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
  }, [searchOpen])

  useEffect(() => {
    function onDocClick(e) {
      const inCluster = clusterRef.current && clusterRef.current.contains(e.target)
      const inPanel = panelRef.current && panelRef.current.contains(e.target)
      console.log('[Header] doc-click', { inCluster, inPanel, target: e.target?.tagName })
      if (!inCluster && !inPanel) {
        setSearchOpen(false)
        setQuery('')
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') { setSearchOpen(false); setQuery('') }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (scope !== 'books') { setBookResults([]); return }
    const q = query.trim()
    console.log('[Header] book search effect', { q, scope })
    if (!q) { setBookResults([]); return }
    let alive = true
    setBookBusy(true)
    const t = setTimeout(async () => {
      try {
        const rows = await apiSearchShelfBooks(q)
        if (!alive) return
        console.log('[Header] book search rows', q, rows.length)
        const seen = new Set()
        const books = []
        for (const r of rows) {
          const key = `${r.title.trim().toLowerCase()}||${(r.author || '').trim().toLowerCase()}`
          if (!seen.has(key)) {
            seen.add(key)
            books.push({ title: r.title, author: r.author })
          }
        }
        setBookResults(books.slice(0, 8))
      } catch {
        if (alive) setBookResults([])
      } finally {
        if (alive) setBookBusy(false)
      }
    }, 250)
    return () => { alive = false; clearTimeout(t) }
  }, [query, scope])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out = (() => {
      if (scope === 'books') {
        return bookResults.map((b) => ({ type: 'book', key: b.title, label: b.title, sub: b.author, data: b }))
      }
      if (scope === 'favourites') {
        return (favorites || [])
          .filter((f) => (f.poemTitle || '').toLowerCase().includes(q) || (f.lineText || '').toLowerCase().includes(q) || (f.author || '').toLowerCase().includes(q))
          .slice(0, 8)
          .map((f) => ({ type: 'favorite', key: f.key, label: f.lineText, sub: `${f.poemTitle} · ${f.author}`, data: f }))
      }
      return (allPoems || [])
        .filter((p) => (p.title || '').toLowerCase().includes(q) || (p.author || '').toLowerCase().includes(q))
        .slice(0, 8)
        .map((p) => ({ type: 'poem', key: String(p.id), label: p.title, sub: p.author, data: p }))
    })()
    console.log('[Header] results', { scope, q, count: out.length, first: out[0]?.label })
    return out
  }, [query, scope, bookResults, favorites, allPoems])

  function handleSelect(r) {
    console.log('[Header] handleSelect', { type: r.type, key: r.key, label: r.label, sub: r.sub })
    if (r.type === 'favorite') { if (onOpenFavorites) { console.log('[Header] → onOpenFavorites', r.data?.key); onOpenFavorites(r.data) } return }
    closeSearch()
    if (r.type === 'book') { if (onOpenBooks) { console.log('[Header] → onOpenBooks', r.data?.title); onOpenBooks(r.data.title) } return }
    if (onSearchSelect) { console.log('[Header] → onSearchSelect', r.data?.id, r.data?.title); onSearchSelect(r.data) }
  }

  function handleEnter() {
    const q = query.trim()
    console.log('[Header] handleEnter', { scope, q })
    if (!q) return
    if (scope === 'books') {
      if (onOpenBooks) { closeSearch(); console.log('[Header] Enter → onOpenBooks', q); onOpenBooks(q); }
      return
    }
    if (scope === 'favourites') {
      const first = (favorites || []).find((f) =>
        (f.poemTitle || '').toLowerCase().includes(q.toLowerCase()) ||
        (f.lineText || '').toLowerCase().includes(q.toLowerCase()) ||
        (f.author || '').toLowerCase().includes(q.toLowerCase()))
      if (first && onOpenFavorites) { console.log('[Header] Enter → onOpenFavorites', first.key); onOpenFavorites(first) }
      return
    }
    const first = (allPoems || []).find((p) =>
      (p.title || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.author || '').toLowerCase().includes(q.toLowerCase()))
    if (first && onSearchSelect) { console.log('[Header] Enter → onSearchSelect', first.id, first.title); closeSearch(); onSearchSelect(first) }
  }

  const closeSearch = () => { console.log('[Header] closeSearch'); setSearchOpen(false); setQuery('') }

  const isChat = !!chatContact

  return (
    <>
      <header
        ref={headerRef}
        className="flex-shrink-0 z-30 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--tp-header-bg)',
          color: 'var(--tp-header-text)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div className="px-4 py-3 flex items-center gap-2">
        {isChat ? (
          <>
            <button onClick={onChatBack} className="p-1.5 rounded-xl transition-opacity hover:opacity-70 flex-shrink-0" aria-label="Back to inbox">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-tight truncate" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                {chatName || chatContact}
              </p>
              <p className="text-[10px] opacity-60 truncate">{chatName ? `@${chatContact}` : 'Conversation'}</p>
            </div>
            <button onClick={onChatProfile} className="p-1.5 rounded-xl transition-opacity hover:opacity-70 flex-shrink-0" aria-label="View profile">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
              </svg>
            </button>
          </>
        ) : (
        <>
        <button onClick={onMenuToggle} className="p-1.5 rounded-xl transition-opacity hover:opacity-70 flex-shrink-0" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {searchOpen ? (
          <div ref={clusterRef} className="relative flex-1 min-w-0 flex justify-center">
            <div className="w-full max-w-xl flex items-center gap-2">
              <div
                className="flex-1 min-w-0 flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 opacity-70">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                  placeholder={PLACEHOLDERS[scope]}
                  className="w-full min-w-0 bg-transparent outline-none text-sm placeholder:opacity-50"
                  style={{ color: 'var(--tp-header-text)' }}
                />
                {query && (
                  <button onClick={() => setQuery('')} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" aria-label="Clear search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                )}
              </div>

              <button onClick={closeSearch} className="flex-shrink-0 p-1.5 rounded-xl opacity-70 hover:opacity-100 transition-opacity" aria-label="Close search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div ref={clusterRef} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
              aria-label="Search"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        )}

        {!searchOpen && (
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <button onClick={onLangClick}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-opacity hover:opacity-70"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} aria-label="Language">
              {lang.toUpperCase()}
            </button>
            <button onClick={onProfileToggle} className="p-1.5 rounded-xl transition-opacity hover:opacity-70" aria-label="Profile">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
              </svg>
            </button>
          </div>
        )}
        </>
        )}
        </div>

        {notice && (
          <button
            onClick={onNoticeClick}
            className="w-full flex items-center gap-2 px-4 pb-3 animate-fade-in"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              cursor: 'pointer',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
            aria-label="View notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-80">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="text-sm font-medium truncate">{notice.text}</span>
          </button>
        )}
      </header>

      {searchOpen && query.trim() && (
        <div ref={panelRef} className="fixed left-0 right-0 z-50 pointer-events-none" style={{ top: panelTop }}>
          <div className="pointer-events-auto px-3">
            <div className="max-w-xl mx-auto">
              <div
                className="animate-pop-in rounded-2xl p-2 mb-2"
                style={{
                  backgroundColor: 'var(--tp-header-bg)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                }}
              >
                {bookBusy ? (
                  <p className="text-xs text-center py-3 opacity-60">Searching books...</p>
                ) : results.length === 0 ? (
                  <p className="text-xs text-center py-3 opacity-60">No results for "{query.trim()}"</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {results.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => handleSelect(r)}
                        style={{
                          background: 'rgba(255,255,255,0.15)', color: '#fff',
                          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem',
                          padding: '0.3rem 0.7rem', fontSize: '0.75rem', cursor: 'pointer',
                        }}
                      >
                        {r.label}
                        {r.sub && <span className="opacity-60"> · {r.sub}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
