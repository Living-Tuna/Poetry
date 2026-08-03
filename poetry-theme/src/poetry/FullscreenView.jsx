import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { usePoetry } from './PoetryContext'
import { useLanguage } from '../language/LanguageProvider'
import { CloseIcon, StarIcon } from './components/Icons'
import { isIndependentPoem } from '../constants'

const CATEGORIES = ['Love', 'Nature', 'Philosophy', 'Tragedy', 'Hope', 'Spirituality', 'Freedom', 'War', 'Death', 'Joy', 'Reflection', 'Fantasy']
const SWIPE_THRESHOLD = 40
const TAP_THRESHOLD = 10
const LOCK_THRESHOLD = 8
const ANIM_DURATION = 380

function abbrev(n) {
  if (!n) return '0'
  if (n < 1000) return String(n)
  if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k'
  return (n / 1000000).toFixed(n < 10000000 ? 1 : 0).replace(/\.0$/, '') + 'm'
}

function endsSentence(text) {
  return /[.!?…]["'”’)\]]*$/.test((text || '').trim())
}

export default function FullscreenView() {
  const {
    currentPoem, closeFullscreen,
    swipeRight, swipeLeft, enqueueNext,
    canSwipeLeft, canSwipeRight,
    upsertFavorite, removeFavorite,
    isUserPoem,
    deleteMyPoem, updateMyPoem, editOnOpen, setEditOnOpen,
    queue, index, favorites,
    hasLiked, toggleLikePoem,
  } = usePoetry()
  const { t } = useLanguage()

  function isLineFav(poemId, i) {
    return favorites.some((f) =>
      String(f.poemId) === String(poemId) &&
      (typeof f.startLine === 'number' && typeof f.endLine === 'number'
        ? i >= f.startLine && i <= f.endLine
        : ((f.sentenceText || '').includes(lines[i]) || f.lineText === lines[i]))
    )
  }

  const userPoem = isUserPoem(currentPoem)
  const lines = currentPoem?.content?.split('\n')?.filter(Boolean) || []
  const markedCount = currentPoem
    ? favorites.filter((f) => String(f.poemId) === String(currentPoem.id)).length
    : 0
  const [editing, setEditing] = useState(editOnOpen && userPoem)
  const [editTitle, setEditTitle] = useState(editOnOpen && userPoem ? currentPoem.title : '')
  const [editContent, setEditContent] = useState(editOnOpen && userPoem ? currentPoem.content : '')
  const [editCategories, setEditCategories] = useState(editOnOpen && userPoem ? (currentPoem.categories || []) : [])
  const [savedPoemId, setSavedPoemId] = useState(editing ? currentPoem?.id : null)

  const [trackX, setTrackX] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const axisLock = useRef(null)
  const dragTargetScroll = useRef(null)
  const scrollRef = useRef(null)
  const scrollPositions = useRef({})

  const leftPoem = index > 0 ? queue[index - 1] : null
  const rightPoem = index < queue.length - 1 ? queue[index + 1] : null

  useEffect(() => { if (editOnOpen) setEditOnOpen(false) }, [])

  useEffect(() => {
    if (!editing) return
    if (currentPoem?.id && currentPoem.id !== savedPoemId) {
      setEditing(false)
    }
  }, [currentPoem?.id])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') closeFullscreen()
      if (e.key === 'ArrowRight' && canSwipeRight) swipeRight()
      if (e.key === 'ArrowLeft' && canSwipeLeft) swipeLeft()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [closeFullscreen, swipeRight, swipeLeft, canSwipeRight, canSwipeLeft])

  function goNext() {
    if (animating || !canSwipeRight) return
    enqueueNext()
    setAnimating(true)
    requestAnimationFrame(() => setTrackX(-100))
    setTimeout(() => {
      swipeRight()
      setAnimating(false)
      setTrackX(0)
    }, ANIM_DURATION)
  }

  function goPrev() {
    if (animating || !canSwipeLeft) return
    setAnimating(true)
    requestAnimationFrame(() => setTrackX(100))
    setTimeout(() => {
      swipeLeft()
      setAnimating(false)
      setTrackX(0)
    }, ANIM_DURATION)
  }

  function resetTrack() {
    setAnimating(true)
    setTrackX(0)
    setTimeout(() => setAnimating(false), ANIM_DURATION)
  }

  function restoreScroll() {
    if (dragTargetScroll.current) {
      dragTargetScroll.current.style.overflow = ''
      dragTargetScroll.current = null
    }
  }

  function handlePointerDown(e) {
    if (editing) return
    if (e.target.closest('button, [role="button"], a')) return
    if (animating) return
    const lineEl = e.target.closest('[data-line]')
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      line: lineEl ? Number(lineEl.dataset.line) : null,
    }
    axisLock.current = null
    dragTargetScroll.current = e.target.closest('.poem-scroll') || null
    setDragging(true)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }

  function handlePointerMove(e) {
    if (!dragStart.current || !dragging) return
    if (animating) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (axisLock.current === null) {
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      if (absDx > LOCK_THRESHOLD && absDx > absDy) {
        axisLock.current = 'h'
      } else if (absDy > LOCK_THRESHOLD && absDy > absDx) {
        axisLock.current = 'v'
        setDragging(false)
        try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
        return
      } else {
        return
      }
    }

    if (axisLock.current === 'v') return

    if (dragTargetScroll.current) {
      dragTargetScroll.current.style.overflow = 'hidden'
    }
    if (e.cancelable) e.preventDefault()

    const vw = window.innerWidth
    const pct = (dx / vw) * 100
    const minTrack = canSwipeRight ? -100 : 0
    const maxTrack = canSwipeLeft ? 100 : 0
    setTrackX(Math.max(minTrack, Math.min(maxTrack, pct)))
  }

  function handlePointerUp(e) {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const tappedLine = dragStart.current.line
    const wasHorizontal = axisLock.current === 'h'
    restoreScroll()
    setDragging(false)
    dragStart.current = null
    axisLock.current = null

    if (!wasHorizontal) {
      if (Math.abs(dx) <= TAP_THRESHOLD && Math.abs(dy) <= TAP_THRESHOLD) {
        if (tappedLine !== null) toggleLineFavorite(tappedLine)
        return
      }
      if (dy > 60 && Math.abs(dy) > Math.abs(dx) * 1.5) {
        closeFullscreen()
        return
      }
      if (trackX !== 0) resetTrack()
      return
    }

    if (dx < -SWIPE_THRESHOLD && canSwipeRight) {
      goNext()
    } else if (dx > SWIPE_THRESHOLD && canSwipeLeft) {
      goPrev()
    } else {
      resetTrack()
    }
  }

  function handlePointerCancel() {
    restoreScroll()
    setDragging(false)
    dragStart.current = null
    axisLock.current = null
    if (trackX !== 0) resetTrack()
  }

  function handlePoemScroll() {
    if (!currentPoem || !scrollRef.current) return
    scrollPositions.current[currentPoem.id] = scrollRef.current.scrollTop
  }

  useLayoutEffect(() => {
    if (!currentPoem || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollPositions.current[currentPoem.id] || 0
  }, [currentPoem?.id, editing])

  function toggleLineFavorite(i) {
    if (!currentPoem) return
    const poemId = currentPoem.id

    const poemFavs = favorites
      .filter((f) => String(f.poemId) === String(poemId))
      .map((f) => {
        if (typeof f.startLine === 'number' && typeof f.endLine === 'number') {
          return { f, range: [f.startLine, f.endLine] }
        }
        const idx = lines.indexOf(f.lineText)
        return idx === -1 ? null : { f, range: [idx, idx] }
      })
      .filter(Boolean)

    const covering = poemFavs.find(({ range }) => i >= range[0] && i <= range[1])
    if (covering) {
      removeFavorite(covering.f.key)
      return
    }

    let lo = i
    while (lo > 0 && !endsSentence(lines[lo - 1])) lo--
    let hi = i
    while (hi < lines.length - 1 && !endsSentence(lines[hi])) hi++

    poemFavs.forEach(({ f, range }) => {
      if (range[0] > hi || range[1] < lo) return
      removeFavorite(f.key)
    })

    const key = `${poemId}::${lines[lo]}`
    const sentenceText = lines.slice(lo, hi + 1).join(' ').trim()
    upsertFavorite(poemId, {
      key,
      lineText: lines[lo],
      sentenceText,
      startLine: lo,
      endLine: hi,
    })
  }

  if (!currentPoem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'var(--tp-bg)' }}>
        <p style={{ color: 'var(--tp-text-secondary)' }}>{t('poetry.noPoemSelected')}</p>
        <button onClick={closeFullscreen} className="absolute top-6 right-6 p-2 rounded-xl" style={{ color: 'var(--tp-text)' }}><CloseIcon size={20} /></button>
      </div>
    )
  }

  const transition = animating
    ? `transform ${ANIM_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : 'none'

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--tp-bg)' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 select-none"
        style={{ borderBottom: '1px solid var(--tp-border)', backgroundColor: 'var(--tp-bg)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={closeFullscreen}
            className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
            aria-label={t('common.close')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{t('poetry.swipeSideways')}</span>
        </div>
        <div className="flex items-center gap-2">
          {userPoem && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); if (!editing) { setEditTitle(currentPoem.title); setEditContent(currentPoem.content); setEditCategories(currentPoem.categories || []); setEditing(true); setSavedPoemId(currentPoem.id) } else setEditing(false) }}
                className="p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90 flex items-center gap-1 text-xs font-medium"
                style={{ color: editing ? '#ef4444' : 'var(--tp-secondary)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                {editing ? t('common.cancel') : t('common.edit')}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); deleteMyPoem(currentPoem.id) }}
                className="p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90"
                style={{ color: '#ef4444' }}
                aria-label={t('common.delete')}
              ><CloseIcon size={14} /></button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            disabled={!canSwipeLeft}
            className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-xs tabular-nums flex items-center gap-2" style={{ color: 'var(--tp-text-secondary)' }}>
            <span className="flex items-center gap-0.5"><StarIcon size={12} /> {markedCount}</span>
            <span>{t('poetry.lines', { count: lines.length })}</span>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            disabled={!canSwipeRight}
            className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swipe indicator */}
      {dragging && Math.abs(trackX) > 5 && (
        <div className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30"
          style={{ left: trackX > 0 ? '1rem' : 'auto', right: trackX < 0 ? '1rem' : 'auto' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--tp-text-secondary)" strokeWidth="1.5" strokeLinecap="round">
            {trackX > 0
              ? <path d="M19 12H5M12 19l-7-7 7-7" />
              : <path d="M5 12h14M12 5l7 7-7 7" />
            }
          </svg>
        </div>
      )}

      {/* Track */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex h-full"
          style={{
            width: '300%',
            marginLeft: '-100%',
            transform: `translateX(${trackX / 3}%)`,
            transition,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handlePointerCancel}
        >
          {/* Left card */}
          <div className="flex-shrink-0 w-1/3 h-full overflow-y-auto poem-scroll px-5 py-8"
            style={{ touchAction: 'pan-y' }}>
            <PoemView poem={leftPoem} liked={hasLiked(leftPoem?.id)} onToggleLike={toggleLikePoem} t={t} />
          </div>

          {/* Center card */}
          <div className="flex-shrink-0 w-1/3 h-full overflow-hidden">
            {editing ? (
              <div className="h-full overflow-y-auto poem-scroll px-5 py-8">
                <div className="mb-8 text-center">
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    placeholder={t('writings.titlePlaceholder')}
                    className="w-full text-center text-2xl sm:text-3xl font-bold px-3 py-2 rounded-xl outline-none transition-colors"
                    style={{ color: 'var(--tp-text)', backgroundColor: 'transparent', border: '1.5px solid var(--tp-border)', fontFamily: '"Playfair Display", Georgia, serif' }}
                    onFocus={(e) => e.target.style.backgroundColor = 'var(--tp-bg)'}
                    onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                  />
                  <p style={{ color: 'var(--tp-secondary)', fontSize: '0.9rem', fontFamily: '"Playfair Display", Georgia, serif', marginTop: '0.5rem' }}>
                    {currentPoem.author}
                  </p>
                </div>
                <div className="space-y-4">
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                    placeholder={t('writings.contentPlaceholder')} rows={14}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none transition-colors"
                    style={{ color: 'var(--tp-text)', backgroundColor: 'transparent', border: '1.5px solid var(--tp-border)', fontFamily: '"Playfair Display", Georgia, serif', lineHeight: '1.7' }}
                    onFocus={(e) => e.target.style.backgroundColor = 'var(--tp-bg)'}
                    onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                  />
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--tp-text-secondary)' }}>{t('writings.categoriesHint', { count: 3 })}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => {
                        const selected = editCategories.includes(cat)
                        return (
                          <button key={cat} type="button"
                            onClick={() => {
                              if (selected) setEditCategories(editCategories.filter((c) => c !== cat))
                              else if (editCategories.length < 3) setEditCategories([...editCategories, cat])
                            }}
                            className="text-xs px-2.5 py-1 rounded-full transition-all"
                            style={{
                              backgroundColor: selected ? 'var(--tp-secondary)' : 'var(--tp-bg)',
                              color: selected ? '#fff' : 'var(--tp-text-secondary)',
                              border: '1px solid var(--tp-border)',
                              opacity: !selected && editCategories.length >= 3 ? 0.4 : 1,
                            }}
                          >{t('category.' + cat.toLowerCase())}</button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-xl text-sm transition-colors"
                      style={{ color: 'var(--tp-text-secondary)', backgroundColor: 'var(--tp-bg)' }}>{t('common.cancel')}</button>
                    <button onClick={async () => {
                      if (!editTitle.trim() || !editContent.trim()) return
                      await updateMyPoem(currentPoem.id, { title: editTitle.trim(), content: editContent.trim(), categories: editCategories })
                      setEditing(false)
                    }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
                      style={{ backgroundColor: 'var(--tp-secondary)' }}>{t('common.save')}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={scrollRef}
                onScroll={handlePoemScroll}
                className="h-full overflow-y-auto poem-scroll px-5 py-8 select-none"
                style={{ touchAction: 'pan-y', WebkitUserSelect: 'none', userSelect: 'none' }}
              >
                {/* Poem header */}
                <div className="mb-8 text-center">
                  <h2
                    className="text-2xl sm:text-3xl font-bold leading-tight mb-2"
                    style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    {currentPoem.title}
                  </h2>
                  <p style={{ color: 'var(--tp-secondary)', fontSize: '0.9rem', fontFamily: '"Playfair Display", Georgia, serif' }}>
                    {currentPoem.author}
                  </p>
                  <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {currentPoem.date || currentPoem.createdAt || ''}
                  </p>
                  {(currentPoem.categories && currentPoem.categories.length > 0) && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                      {currentPoem.categories.map((cat) => (
                        <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 20%, transparent)', color: 'var(--tp-secondary)' }}>
                          {t('category.' + cat.toLowerCase())}
                        </span>
                      ))}
                    </div>
                  )}
                  {isIndependentPoem(currentPoem) ? (
                    <button onClick={(e) => { e.stopPropagation(); toggleLikePoem(currentPoem) }}
                      className="flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full transition-all active:scale-90"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)', color: 'var(--tp-secondary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24"
                        fill={hasLiked(currentPoem.id) ? '#f59e0b' : 'none'}
                        stroke={hasLiked(currentPoem.id) ? 'none' : 'currentColor'} strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-xs font-medium">{abbrev(currentPoem.likes ?? 0)}</span>
                    </button>
                  ) : (
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-3" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-text-secondary) 12%, transparent)', color: 'var(--tp-text-secondary)' }}>
                      {t('poetry.historicNotRatable')}
                    </span>
                  )}
                </div>

                {/* Poem lines */}
                <div className="space-y-0.5 select-none" style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}>
                  {lines.map((line, i) => {
                    const fav = isLineFav(currentPoem.id, i)
                    const bg = fav
                      ? 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)'
                      : 'transparent'
                    return (
                      <p
                        key={i}
                        data-line={i}
                        className="leading-relaxed py-1.5 rounded-sm transition-all duration-200 cursor-pointer"
                        style={{
                          color: fav ? 'var(--tp-secondary)' : 'var(--tp-text)',
                          fontSize: '1.05rem',
                          fontFamily: '"Playfair Display", Georgia, serif',
                          backgroundColor: bg,
                          paddingLeft: '0.75rem',
                          paddingRight: '0.75rem',
                          borderLeft: fav ? '3px solid var(--tp-secondary)' : '3px solid transparent',
                          transform: fav ? 'scale(1.01)' : 'scale(1)',
                        }}
                      >
                        {line}
                      </p>
                    )
                  })}
                </div>

                {/* Hint */}
                <p className="text-center text-xs mt-10 mb-6" style={{ color: 'var(--tp-text-secondary)', opacity: 0.4 }}>
                  {t('poetry.tapToSaveFavorite')} · {t('poetry.tapToRemoveFavorite')} <StarIcon size={12} />
                </p>
              </div>
            )}
          </div>

          {/* Right card */}
          <div className="flex-shrink-0 w-1/3 h-full overflow-y-auto poem-scroll px-5 py-8"
            style={{ touchAction: 'pan-y' }}>
            <PoemView poem={rightPoem} liked={hasLiked(rightPoem?.id)} onToggleLike={toggleLikePoem} t={t} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex-shrink-0 px-5 py-2.5 flex items-center justify-between text-xs"
        style={{ color: 'var(--tp-text-secondary)', borderTop: '1px solid var(--tp-border)', backgroundColor: 'var(--tp-bg)' }}
      >
        <button onClick={goPrev} disabled={!canSwipeLeft} className="disabled:opacity-30">
          ← {canSwipeLeft ? t('poetry.prev') : '—'}
        </button>
        <span>{t('poetry.swipeOr')} <kbd className="px-1 rounded" style={{ backgroundColor: 'var(--tp-border)', padding: '1px 6px' }}>←</kbd> <kbd className="px-1 rounded" style={{ backgroundColor: 'var(--tp-border)', padding: '1px 6px' }}>→</kbd></span>
        <button onClick={goNext} disabled={!canSwipeRight} className="disabled:opacity-30">
          {canSwipeRight ? t('poetry.next') : '—'} →
        </button>
      </div>
    </div>
  )
}

function PoemView({ poem, liked, onToggleLike, t }) {
  if (!poem) return null
  const poemLines = poem.content.split('\n').filter(Boolean)
  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2"
          style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {poem.title}
        </h2>
        <p style={{ color: 'var(--tp-secondary)', fontSize: '0.9rem', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {poem.author}
        </p>
        <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {poem.date || ''}
        </p>
        {(poem.categories && poem.categories.length > 0) && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {poem.categories.map((cat) => (
              <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 20%, transparent)', color: 'var(--tp-secondary)' }}>
                {t('category.' + cat.toLowerCase())}
              </span>
            ))}
          </div>
        )}
        {isIndependentPoem(poem) ? (
          <button onClick={() => onToggleLike(poem)}
            className="flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full transition-all active:scale-90"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)', color: 'var(--tp-secondary)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={liked ? '#f59e0b' : 'none'}
              stroke={liked ? 'none' : 'currentColor'} strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-medium">{abbrev(poem.likes ?? 0)}</span>
          </button>
        ) : (
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-3" style={{ backgroundColor: 'color-mix(in srgb, var(--tp-text-secondary) 12%, transparent)', color: 'var(--tp-text-secondary)' }}>
            {t('poetry.historicNotRatable')}
          </span>
        )}
      </div>

      <div className="space-y-0.5 select-none" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
        {poemLines.map((line, i) => (
          <p key={i}
            className="leading-relaxed py-1.5 rounded-sm"
            style={{
              color: 'var(--tp-text)',
              fontSize: '1.05rem',
              fontFamily: '"Playfair Display", Georgia, serif',
              paddingLeft: '0.75rem',
              paddingRight: '0.75rem',
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </>
  )
}
