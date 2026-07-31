import { useEffect, useState } from 'react'
import PoetryCard from '../PoetryCard'
import ShareQuoteModal from '../components/ShareQuoteModal'
import DataIndicator from '../components/DataIndicator'
import { ClockIcon, PenIcon, BookIcon, HeartIcon } from '../components/Icons'
import { SITE_NAME, isIndependentPoem } from '../../constants'
import { apiFetchStats } from '../../api/stats'

function formatCount(n) {
  if (!n) return '0'
  if (n < 1000) return String(n)
  if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k'
  return (n / 1000000).toFixed(n < 10000000 ? 1 : 0).replace(/\.0$/, '') + 'm'
}

export default function DashboardView({
  user, slideOpen, setSlideOpen, setAuthMode, btnWhite,
  recentlyViewed, navigateToPoem,
  trending, trendingScroll, scrollTrending,
  latest, favoriteQuote, favorites,
  myPoems, myPoemsCachedOnly, onNavigate,
  onNewPoem,
}) {
  const [shareTarget, setShareTarget] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiFetchStats()
      .then((data) => { if (!cancelled) setStats(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto w-full space-y-8">
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
            <button onClick={() => { setSlideOpen(true); setAuthMode('login') }}
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
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>Poems</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>
              <span>{formatCount(stats.independent_poems)} independent</span>
              <span>·</span>
              <span>{formatCount(stats.historic_poems)} historic</span>
            </div>
          </div>
        )}
      </div>

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

      {favoriteQuote && (
        <section className="animate-fade-in">
          <div onClick={() => setShareTarget(favoriteQuote)} className="rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
                <HeartIcon size={14} /> Favorite Line
              </p>
              <div className="flex gap-1">
                <button onClick={() => setShareTarget(favoriteQuote)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110 active:scale-90"
                  style={{ color: 'var(--tp-secondary)' }}
                  aria-label="Share">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic' }}>
              &ldquo;{favoriteQuote.lineText}&rdquo;
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)' }}>
              &mdash; {favoriteQuote.poemTitle} by {favoriteQuote.author}
            </p>
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

      <div className="h-4" />

      {shareTarget && (
        <ShareQuoteModal
          favorite={shareTarget}
          favorites={favorites}
          initialIndex={favorites.indexOf(shareTarget)}
          onClose={() => setShareTarget(null)}
        />
      )}
    </div>
  )
}
