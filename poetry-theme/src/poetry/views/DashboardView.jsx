import { useEffect, useState } from 'react'
import PoetryCard from '../PoetryCard'
import ShareQuoteModal from '../components/ShareQuoteModal'
import DataIndicator from '../components/DataIndicator'
import LegalLinks from '../components/LegalLinks'
import { ClockIcon, PenIcon, BookIcon, HeartIcon } from '../components/Icons'
import AnnouncementBanner from '../components/AnnouncementBanner'
import { SITE_NAME, isIndependentPoem, HERO_MISSION_TEXT, HERO_SAFETY_NOTICE } from '../../constants'
import { apiFetchStats, apiGetCachedStats, STATS_CACHE_TTL } from '../../api/stats'
import { apiSubscribeOnlineCount } from '../../api/presence'
import { apiFetchNewsletterCount, apiSubscribeNewsletter } from '../../api/newsletter'
import { fetchNearbyGroups } from './nearbyBooks'

function formatCount(n) {
  if (!n) return '0'
  if (n < 1000) return String(n)
  if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k'
  return (n / 1000000).toFixed(n < 10000000 ? 1 : 0).replace(/\.0$/, '') + 'm'
}

function compactDist(km) {
  if (km === null || km === undefined) return '—'
  if (km < 1) return '<1 km'
  if (km < 1000) return `~${Math.round(km)} km`
  return `~${(km / 1000).toFixed(1).replace(/\.0$/, '')}k km`
}

export default function DashboardView({
  user, slideOpen, setSlideOpen, setAuthMode, btnWhite,
  recentlyViewed, navigateToPoem,
  trending, trendingScroll, scrollTrending,
  latest, favoriteQuote, favorites,
  myPoems, myPoemsCachedOnly, onNavigate,
  onNewPoem, onOpenBlendBook,
}) {
  const [stats, setStats] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [newsletterCount, setNewsletterCount] = useState(0)
  const [nlEmail, setNlEmail] = useState('')
  const [nlState, setNlState] = useState('idle')
  const [nearby, setNearby] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchNearbyGroups(user)
      .then((g) => { if (!cancelled) setNearby(g) })
      .catch(() => { if (!cancelled) setNearby([]) })
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    const stop = apiSubscribeOnlineCount(setOnlineCount)
    return stop
  }, [])

  useEffect(() => {
    let cancelled = false
    apiFetchNewsletterCount()
      .then((n) => { if (!cancelled) setNewsletterCount(n) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  async function handleNewsletterSubmit(e) {
    e.preventDefault()
    if (nlState === 'submitting') return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlEmail)) return
    setNlState('submitting')
    try {
      await apiSubscribeNewsletter(nlEmail)
      setNlState('done')
      setNlEmail('')
    } catch {
      setNlState('error')
    }
  }

  useEffect(() => {
    let cancelled = false
    const cached = apiGetCachedStats()
    if (cached) setStats(cached.stats)
    if (!cached || Date.now() - cached.ts > STATS_CACHE_TTL) {
      apiFetchStats()
        .then((data) => { if (!cancelled) setStats(data) })
        .catch(() => {})
    }
    return () => { cancelled = true }
  }, [])

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto w-full space-y-8">
      <AnnouncementBanner />

      <button onClick={() => onNavigate('blend')}
        className="w-full text-left rounded-xl p-4 animate-fade-in transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)', color: 'var(--tp-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>Need a book?</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
              Click here and discover who might have a copy of what you are looking for.
            </p>
          </div>
          <svg width="16" height="16" className="mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--tp-text-secondary)' }}><path d="M9 18l6-6-6-6" /></svg>
        </div>
      </button>

      {nearby && nearby.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <BookIcon size={16} /> Books Near You
            </h3>
            <button onClick={() => onNavigate('blend')}
              className="text-xs font-medium transition-all hover:opacity-70"
              style={{ color: 'var(--tp-secondary)' }}>
              Open Blend →
            </button>
          </div>
          <p className="text-[10px] mb-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>
            Identities stay private until a reader accepts your request.
          </p>
          <div className="space-y-2">
            {nearby.slice(0, 4).map((book, i) => {
              const near = book.holders.filter((x) => !x.isSelf && x.distanceKm !== null)[0]
              const km = near ? near.distanceKm : null
              const pages = book.holders[0]?.h?.page_count || ''
              return (
                <button key={i}
                  onClick={() => onOpenBlendBook ? onOpenBlendBook(book) : onNavigate('blend')}
                  className="w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>
                      {book.title}
                    </p>
                    {book.author && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--tp-text-secondary)' }}>{book.author}</p>
                    )}
                    {pages && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>
                        {pages} pages
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[10px] font-semibold" style={{ color: 'var(--tp-secondary)' }}>{compactDist(km)}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'var(--tp-text-secondary)', opacity: 0.6 }}>Status →</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {favoriteQuote && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <HeartIcon size={16} /> Favorite Line
            </p>
            {favorites.length > 1 && (
              <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>Swipe card to browse</span>
            )}
          </div>
          <ShareQuoteModal
            inline
            favorite={favoriteQuote}
            favorites={favorites}
            initialIndex={favorites.indexOf(favoriteQuote)}
          />
        </section>
      )}

      <div className="text-center animate-fade-in">
        {user ? (
          <>
            <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>Welcome back,</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>{user.name}</h2>
          </>
        ) : (
          <>
            <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{`Welcome to ${SITE_NAME}`}</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>Discover & Create</h2>
            <button onClick={() => { setSlideOpen(true); setAuthMode('signup') }}
              style={{ ...btnWhite, width: 'auto', padding: '0.5rem 1.5rem', marginTop: '0.75rem', display: 'inline-block' }}>
              Sign In to Save
            </button>
          </>
        )}

        {stats && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>{formatCount(stats.total_users)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Users</p>
              </div>
              <div className="rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>{formatCount(stats.active_users)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Active</p>
              </div>
              <div className="rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>{formatCount(stats.total_poems)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Writings</p>
              </div>
              <div className="rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>{formatCount(stats.independent_poems)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Independent writings</p>
              </div>
              <div className="rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>{formatCount(onlineCount)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Online now</p>
              </div>
              <div className="rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>{formatCount(newsletterCount)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Newsletter entries</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>
              <span>{formatCount(stats.historic_poems)} historic</span>
            </div>
          </div>
        )}

        <div className="mt-5 mx-auto max-w-md px-4 py-4 rounded-xl animate-fade-in"
          style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 8%, transparent)', border: '1.5px solid var(--tp-border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            {HERO_MISSION_TEXT}
          </p>
          <p className="text-[11px] mt-2 font-medium" style={{ color: 'var(--tp-text-secondary)' }}>
            {HERO_SAFETY_NOTICE}
          </p>
        </div>
      </div>

      <section className="animate-fade-in">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
          <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            Join the Newsletter
          </h3>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>
            Selective daily wisdom through your mail — a single thoughtful verse and note, every day.
          </p>
          {nlState === 'done' ? (
            <p className="text-sm mt-3 font-medium flex items-center gap-1.5" style={{ color: 'var(--tp-secondary)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              You're in! Watch your inbox tomorrow.
            </p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-3 flex gap-2">
              <input
                type="email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
              />
              <button type="submit" disabled={nlState === 'submitting'}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex-shrink-0"
                style={{ backgroundColor: 'var(--tp-secondary)' }}>
                {nlState === 'submitting' ? 'Joining…' : 'Join'}
              </button>
            </form>
          )}
          {nlState === 'error' && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Couldn't subscribe right now. Please try again.</p>
          )}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <ClockIcon size={16} /> Recently Viewed</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {recentlyViewed.slice(0, 6).map((p) => (
              <button key={`rec-${p.id}`} onClick={() => navigateToPoem(p)}
                className="flex-shrink-0 w-40 snap-start rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-xs font-bold truncate" style={{ color: 'var(--tp-secondary)' }}>{p.author}</p>
                <p className="text-sm font-bold leading-tight mt-1 line-clamp-2" style={{ color: 'var(--tp-text)' }}>{p.title}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--tp-text-secondary)' }}>{p.date || p.createdAt || ''}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 1 1.133 1 2.867 1 4a5.5 5.5 0 0 1-11 0z" /></svg>
            Trending Poems
          </h3>
          <div className="flex gap-1">
            <button onClick={() => scrollTrending(-1)}
              className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={() => scrollTrending(1)}
              className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <div ref={trendingScroll} className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {trending.map((p) => (
            <button key={p.id} onClick={() => navigateToPoem(p)}
              className="flex-shrink-0 w-48 snap-start rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
              <p className="text-xs font-bold truncate" style={{ color: 'var(--tp-secondary)' }}>{p.author}</p>
              <p className="text-sm font-bold leading-tight mt-1" style={{ color: 'var(--tp-text)' }}>{p.title}</p>
              <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--tp-text-secondary)' }}>
                {p.content.split('\n')[0]}...
              </p>
              <div className="flex items-center gap-1 mt-2">
                {isIndependentPoem(p) ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{p.likes?.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-text-secondary) 12%, transparent)', color: 'var(--tp-text-secondary)' }}>
                    Historic
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
      )}

      {latest.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <ClockIcon size={16} /> Latest Poems</h3>
          </div>
          <div className="space-y-2">
            {latest.map((p) => (
              <button key={p.id} onClick={() => navigateToPoem(p)}
                className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{p.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</p>
                  <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>by {p.author}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <PenIcon size={16} /> My Writings</h3>
            {user && <DataIndicator cachedOnly={myPoemsCachedOnly} size={10} />}
          </div>
          <button onClick={onNewPoem}
            className="text-xs px-3 py-1 rounded-lg font-medium transition-all hover:opacity-70"
            style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 15%, transparent)' }}>
            + New
          </button>
        </div>
        {myPoems.length === 0 ? (
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
            <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>No writings yet. Tap + to write your first poem.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myPoems.slice(0, 4).map((p) => (
              <button key={p.id} onClick={() => navigateToPoem(p)}
                className="w-full text-left rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
                <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>{p.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{p.createdAt}</p>
                  <span className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>by {p.author}</span>
                </div>
              </button>
            ))}
            {myPoems.length > 4 && (
              <button onClick={() => onNavigate('my-writings')}
                className="w-full text-center text-xs py-2 rounded-xl transition-colors"
                style={{ color: 'var(--tp-secondary)' }}>
                View all {myPoems.length} writings →
              </button>
            )}
          </div>
        )}
      </section>

      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
              <BookIcon size={16} /> Start Reading</h3>
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>Swipe to explore</span>
        </div>
        <PoetryCard />
      </section>

      <div className="pt-4 pb-2" style={{ borderTop: '1px solid var(--tp-border)' }}>
        <LegalLinks onNavigate={onNavigate} />
      </div>

      <div className="h-4" />
    </div>
  )
}
