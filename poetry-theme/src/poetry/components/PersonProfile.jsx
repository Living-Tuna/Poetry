import { useState, useEffect } from 'react'
import { apiFetchPersonProfile } from '../../api/profile'
import { COUNTRIES } from '../../constants/languages'
import { useLanguage } from '../../language/LanguageProvider'

function countryName(code) {
  return COUNTRIES[code]?.name || code || ''
}

function FlameIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function Section({ title, children, empty }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--tp-text-secondary)' }}>{title}</h3>
      {children}
      {empty && (
        <p className="text-xs py-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.6 }}>{empty}</p>
      )}
    </div>
  )
}

export default function PersonProfile({ username, onClose }) {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    apiFetchPersonProfile(username)
      .then((res) => { if (alive) setData(res) })
      .catch(() => { if (alive) setError(t('profile.couldNotLoad')) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [username, reloadKey, t])

  const p = data?.profile
  const stats = data?.stats
  const streakCurrent = stats?.streak_current || 0
  const streakBest = stats?.streak_best || 0
  const favorites = data?.favorites || []
  const shelf = data?.shelf || []
  const recentlyRead = stats?.recently_read || []
  const frequentlyRead = stats?.frequently_read || []

  const locationParts = [p?.state, countryName(p?.country)].filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto animate-slide-in"
        style={{
          backgroundColor: 'var(--tp-bg)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
          color: 'var(--tp-text)',
        }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: 'var(--tp-bg)', borderBottom: '1px solid var(--tp-border)' }}>
          <h2 className="text-lg font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{t('profile.title')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-opacity hover:opacity-70" aria-label={t('common.close')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-4 py-6">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10">
              <span className="w-5 h-5 rounded-full border-2 border-transparent animate-spin inline-block" style={{ borderTopColor: 'var(--tp-secondary)' }} />
              <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{t('profile.loading')}</span>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
              <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{error}</p>
              <button onClick={() => setReloadKey((k) => k + 1)}
                className="mt-4 px-4 py-1.5 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: 'var(--tp-secondary)', color: '#fff' }}>{t('common.retry')}</button>
            </div>
          )}

          {!error && !loading && data === null && (
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
              <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{t('profile.noReader', { username })}</p>
              <button onClick={() => setReloadKey((k) => k + 1)}
                className="mt-4 px-4 py-1.5 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: 'var(--tp-secondary)', color: '#fff' }}>{t('common.retry')}</button>
            </div>
          )}

          {data && p && (
            <>
              <div className="text-center mb-5">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 20%, transparent)', color: 'var(--tp-secondary)' }}>
                  {p.name?.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'U'}
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{p.name}</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>@{p.username}</p>
                {locationParts.length > 0 && (
                  <p className="text-[11px] mt-1" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
                    {locationParts.join(', ')}
                  </p>
                )}
              </div>

              <div className="rounded-xl p-4 mb-5 flex items-center justify-between animate-pop-in"
                style={{ backgroundColor: 'color-mix(in srgb, #f97316 12%, transparent)', border: '1px solid color-mix(in srgb, #f97316 35%, transparent)' }}>
                <div className="flex items-center gap-2" style={{ color: '#f97316' }}>
                  <FlameIcon size={22} />
                  <div>
                    <p className="text-lg font-bold leading-tight">{t(streakCurrent === 1 ? 'profile.streakDay' : 'profile.streakDays', { count: streakCurrent })}</p>
                    <p className="text-[10px] opacity-70">{t('profile.readingStreak')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{streakBest}</p>
                  <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{t('profile.bestStreak')}</p>
                </div>
              </div>

              <Section title={t('profile.favoriteLines')} empty={favorites.length === 0 ? t('profile.noFavoritesShared') : ''}>
                <div className="space-y-2">
                  {favorites.slice(0, 5).map((f) => (
                    <div key={f.key} className="rounded-xl p-3" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>
                        "{f.sentenceText || f.lineText}"
                      </p>
                      {f.poemTitle && (
                        <p className="text-[10px] mt-1.5" style={{ color: 'var(--tp-text-secondary)' }}>— {f.poemTitle}{f.author ? ` ${t('common.byAuthor', { author: f.author })}` : ''}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title={t('profile.bookshelfCount', { count: shelf.length })} empty={shelf.length === 0 ? t('profile.noBooks') : ''}>
                <div className="space-y-2">
                  {shelf.map((b, i) => (
                    <div key={i} className="rounded-xl p-3 flex items-start justify-between gap-3" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)' }}>{b.title}</p>
                        {b.subtitle && <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--tp-text-secondary)' }}>{b.subtitle}</p>}
                        {b.author && <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-secondary)' }}>{b.author}</p>}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          color: b.availability === 'available' ? '#22c55e' : '#fbbf24',
                          backgroundColor: b.availability === 'available' ? 'color-mix(in srgb, #22c55e 15%, transparent)' : 'color-mix(in srgb, #fbbf24 15%, transparent)',
                        }}>
                        {b.availability === 'available' ? t('shelf.available') : t('shelf.inTransit')}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title={t('profile.recentlyRead')} empty={recentlyRead.length === 0 ? t('profile.noRecent') : ''}>
                <div className="space-y-1.5">
                  {recentlyRead.slice(0, 6).map((r, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
                      <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: 'var(--tp-secondary)' }}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--tp-text)' }}>{r.title}</p>
                        {r.author && <p className="text-[10px] truncate" style={{ color: 'var(--tp-text-secondary)' }}>{r.author}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title={t('profile.frequentlyRead')} empty={frequentlyRead.length === 0 ? t('profile.noPatterns') : ''}>
                <div className="space-y-1.5">
                  {frequentlyRead.slice(0, 6).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
                      <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: 'var(--tp-secondary)' }}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--tp-text)' }}>{f.title}</p>
                      </div>
                      <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--tp-text-secondary)' }}>{t('profile.readCount', { count: f.count })}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
