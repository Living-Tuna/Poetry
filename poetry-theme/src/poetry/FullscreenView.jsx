import { useRef, useState, useEffect } from 'react'
import { usePoetry } from './PoetryContext'

const TAP_WINDOW = 800

export default function FullscreenView() {
  const {
    currentPoem, closeFullscreen,
    swipeRight, swipeLeft,
    canSwipeLeft, canSwipeRight,
    toggleFavorite, isFavorite,
    isUserPoem, setEditRequest, deleteMyPoem,
  } = usePoetry()

  const userPoem = isUserPoem(currentPoem)

  const taps = useRef([])
  const dragStart = useRef(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [swipeDir, setSwipeDir] = useState(null)
  const scrollRef = useRef(null)

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

  function handlePointerDown(e) {
    dragStart.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    setSwipeOffset(0)
    setSwipeDir(null)
    setDragging(true)
  }

  function handlePointerMove(e) {
    if (!dragStart.current || !dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (scrollRef.current && Math.abs(dy) > 15) {
      const atTop = scrollRef.current.scrollTop <= 0
      const atBottom = scrollRef.current.scrollTop >= scrollRef.current.scrollHeight - scrollRef.current.clientHeight - 5
      if ((dy > 0 && !atTop) || (dy < 0 && !atBottom)) return
    }

    setSwipeOffset(dx)
    if (dx > 20 && canSwipeRight) setSwipeDir('right')
    else if (dx < -20 && canSwipeLeft) setSwipeDir('left')
    else if (dy > 30) setSwipeDir('down')
    else setSwipeDir(null)
  }

  function handlePointerUp(e) {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setDragging(false)
    setSwipeOffset(0)

    if (dy > 60 && Math.abs(dy) > Math.abs(dx)) {
      closeFullscreen()
    } else if (dx > 60 && canSwipeRight) {
      swipeRight()
    } else if (dx < -60 && canSwipeLeft) {
      swipeLeft()
    }

    setSwipeDir(null)
    dragStart.current = null
  }

  function handleLineTap(lineText) {
    if (!currentPoem) return
    const now = Date.now()
    taps.current = [...taps.current.filter((t) => now - t < TAP_WINDOW), now]
    if (taps.current.length >= 3) {
      taps.current = []
      toggleFavorite(currentPoem.id, lineText)
    }
  }

  if (!currentPoem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'var(--tp-bg)' }}>
        <p style={{ color: 'var(--tp-text-secondary)' }}>No poem selected</p>
        <button onClick={closeFullscreen} className="absolute top-6 right-6 p-2 rounded-xl" style={{ color: 'var(--tp-text)' }}>✕</button>
      </div>
    )
  }

  const lines = currentPoem.content.split('\n').filter(Boolean)

  const transform = dragging ? `translateX(${swipeOffset}px)` : 'translateX(0px)'

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
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>Swipe down to close</span>
        </div>
        <div className="flex items-center gap-2">
          {userPoem && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setEditRequest(currentPoem); closeFullscreen() }}
                className="p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90 flex items-center gap-1 text-xs font-medium"
                style={{ color: 'var(--tp-secondary)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); deleteMyPoem(currentPoem.id) }}
                className="p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90"
                style={{ color: '#ef4444' }}
                aria-label="Delete"
              >✕</button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); swipeLeft() }}
            disabled={!canSwipeLeft}
            className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-xs tabular-nums" style={{ color: 'var(--tp-text-secondary)' }}>{lines.length} lines</span>
          <button
            onClick={(e) => { e.stopPropagation(); swipeRight() }}
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
      {swipeDir === 'down' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-40">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--tp-text-secondary)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Scrollable content area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto poem-scroll"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="px-5 py-8 sm:px-10 select-none"
          style={{
            maxWidth: '680px', margin: '0 auto', width: '100%',
            transform, transition: dragging ? 'none' : 'transform 0.35s ease-out',
          }}
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
          </div>

          {/* Poem lines — triple-tap toggles favorite */}
          <div className="space-y-0.5">
            {lines.map((line, i) => {
              const fav = isFavorite(currentPoem.id, line)
              return (
                <p
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLineTap(line)
                  }}
                  className="leading-relaxed py-1.5 rounded-sm transition-all duration-200 cursor-pointer"
                  style={{
                    color: fav ? 'var(--tp-secondary)' : 'var(--tp-text)',
                    fontSize: '1.05rem',
                    fontFamily: '"Playfair Display", Georgia, serif',
                    backgroundColor: fav ? 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)' : 'transparent',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    borderLeft: fav ? '3px solid var(--tp-secondary)' : '3px solid transparent',
                    transform: fav ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  {line}
                  {fav && <sup className="ml-0.5" style={{ color: 'var(--tp-secondary)', fontSize: '0.6em', lineHeight: '1' }}>★</sup>}
                </p>
              )
            })}
          </div>

          {/* Hint */}
          <p className="text-center text-xs mt-10 mb-6" style={{ color: 'var(--tp-text-secondary)', opacity: 0.4 }}>
            Triple-tap a line to save as favorite ★
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex-shrink-0 px-5 py-2.5 flex items-center justify-between text-xs"
        style={{ color: 'var(--tp-text-secondary)', borderTop: '1px solid var(--tp-border)', backgroundColor: 'var(--tp-bg)' }}
      >
        <span>← {canSwipeLeft ? 'Prev' : '—'}</span>
        <span>Swipe or <kbd className="px-1 rounded" style={{ backgroundColor: 'var(--tp-border)', padding: '1px 6px' }}>←</kbd> <kbd className="px-1 rounded" style={{ backgroundColor: 'var(--tp-border)', padding: '1px 6px' }}>→</kbd></span>
        <span>{canSwipeRight ? 'Next' : '—'} →</span>
      </div>
    </div>
  )
}
