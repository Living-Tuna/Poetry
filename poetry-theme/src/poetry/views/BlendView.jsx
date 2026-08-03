import { useState, useEffect, useMemo } from 'react'
import { useBook } from '../contexts/BookContext'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../language/LanguageProvider'
import { apiSearchShelfBooks } from '../../api/shelfBooks'
import LegalLinks from '../components/LegalLinks'
import PeerRequestCard, { isOngoingBlend } from '../components/PeerRequestCard'
import {
  groupBooks, addDistances, nearestDist, fetchNearbyGroups,
} from './nearbyBooks'

export default function BlendView({ onNavigate, focusQuery, onOpenAuth, onOpenChat }) {
  const { sendRequest, addNotif, inbox } = useBook()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [requestedKey, setRequestedKey] = useState(null)
  const me = user?.username || ''
  const focusBook = focusQuery?.book || null

  const ongoingBooks = useMemo(() => {
    const groups = results || []
    return groups.filter((b) => isOngoingBlend(inbox, me, b.title))
  }, [results, inbox, me])

  async function loadNearby() {
    setBusy(true)
    setError('')
    setResults(null)
    try {
      const groups = await fetchNearbyGroups(user)
      setResults(groups)
    } catch {
      setError(t('blend.couldNotLoad'))
      setResults([])
    } finally {
      setBusy(false)
    }
  }

  async function runSearch(term) {
    const q = (term || '').trim()
    if (!q || busy) return
    setBusy(true)
    setError('')
    setResults(null)
    try {
      const rows = await apiSearchShelfBooks(q)
      const groups = groupBooks(rows, user)
      await addDistances(groups, user)
      groups.sort((a, b) => nearestDist(a) - nearestDist(b))
      setResults(groups)
    } catch {
      setError(t('blend.searchFailed'))
      setResults([])
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { loadNearby() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (focusQuery && focusQuery.q && !focusQuery.book) {
      setQuery(focusQuery.q)
      runSearch(focusQuery.q)
    }
  }, [focusQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleRequest(book, holder) {
    const holderName = holder.h.holder_username || t('common.reader')
    if (!user) {
      if (onOpenAuth) { onOpenAuth(); return }
      addNotif(t('blend.signInToRequest'))
      return
    }
    const key = `${book.title}|${holderName}`
    if (requestedKey === key) return
    sendRequest(holderName, {
      bookTitle: book.title,
      author: book.author || '',
      message: t('blend.requestMessage', { title: book.title }),
    })
    addNotif(t('blend.requestSent', { title: book.title }))
    setRequestedKey(key)
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
          {t('nav.blend')}
        </h2>
      </div>

      <div className="relative mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); runSearch(query) } }}
          placeholder={t('blend.searchPlaceholder')}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ backgroundColor: 'var(--tp-surface)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
        <button onClick={() => runSearch(query)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{ color: 'var(--tp-secondary)' }} aria-label={t('common.search')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      {focusBook && (
        <div className="space-y-3 mb-4">
          <div className="rounded-2xl p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 8%, transparent)', border: '1.5px solid var(--tp-border)' }}>
            <p className="text-[10px] font-bold mb-2 tracking-wide" style={{ color: 'var(--tp-secondary)' }}>
              {isOngoingBlend(inbox, me, focusBook.title) ? t('blend.yourBlend') : t('blend.requestThisBook')}
            </p>
            <PeerRequestCard
              book={focusBook}
              user={user}
              inbox={inbox}
              onRequest={handleRequest}
              onOpenChat={(contact) => { if (onOpenChat) onOpenChat(contact) }}
            />
          </div>
        </div>
      )}

      {!focusBook && !results && !busy && (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('blend.emptyState')}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
            {t('blend.emptySubtext')}
          </p>
        </div>
      )}

      {busy && (
        <div className="flex items-center justify-center gap-2 py-8">
          <span className="w-5 h-5 rounded-full border-2 border-transparent animate-spin inline-block"
            style={{ borderTopColor: 'var(--tp-secondary)' }} />
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{t('blend.findingBooks')}</span>
        </div>
      )}

      {error && !busy && (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{error}</p>
        </div>
      )}

      {results && results.length === 0 && !busy && !error && !focusBook && (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('blend.noBooks')}
          </p>
        </div>
      )}

      {query && results && results.length > 0 && !busy && (
        <div className="space-y-3">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--tp-text-secondary)' }}>
            {results.length === 1
              ? t('blend.resultFound', { count: results.length, query })
              : t('blend.resultsFound', { count: results.length, query })}
          </p>
          {results.map((book, i) => (
            <PeerRequestCard
              key={i}
              book={book}
              user={user}
              inbox={inbox}
              onRequest={handleRequest}
              onOpenChat={(contact) => { if (onOpenChat) onOpenChat(contact) }}
            />
          ))}
        </div>
      )}

      {!query && results && results.length > 0 && !busy && (
        <div className="space-y-3">
          {ongoingBooks.length > 0 ? (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--tp-text-secondary)' }}>
                {ongoingBooks.length === 1
                  ? t('blend.ongoingBlend', { count: ongoingBooks.length })
                  : t('blend.ongoingBlends', { count: ongoingBooks.length })}
              </p>
              {ongoingBooks
                .filter((b) => !focusBook || b.title !== focusBook.title)
                .map((book, i) => (
                  <PeerRequestCard
                    key={i}
                    book={book}
                    user={user}
                    inbox={inbox}
                    onRequest={handleRequest}
                    onOpenChat={(contact) => { if (onOpenChat) onOpenChat(contact) }}
                  />
                ))}
            </>
          ) : (
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
              <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>
                {t('blend.noOngoing')}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="pt-4 pb-2 mt-6" style={{ borderTop: '1px solid var(--tp-border)' }}>
        <p className="text-[10px] text-center mb-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
          {t('blend.readerHidden')}
        </p>
        <LegalLinks onNavigate={onNavigate} />
      </div>
    </div>
  )
}
