import { useRef, useState, useEffect } from 'react'
import { usePoetry } from './PoetryContext'
import { getPoetInfo } from '../data/poems'

const SWIPE_THRESHOLD = 100
const TRANSITION_DURATION = 300

export default function PoetryCard() {
  const {
    currentPoem, swipeRight, swipeLeft,
    canSwipeLeft, canSwipeRight, openFullscreen,
  } = usePoetry()

  const dragRef = useRef(null)
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(false)

  function animateSwipeIn(direction) {
    setAnimating(true)
    if (direction === 'right') {
      swipeRight()
      setAnimDir('right')
      setDx(-window.innerWidth - 100)
    } else {
      swipeLeft()
      setAnimDir('left')
      setDx(window.innerWidth + 100)
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDx(0)
        setTimeout(() => resetCard(), TRANSITION_DURATION)
      })
    })
  }

  function handlePointerDown(e) {
    dragRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    setDx(0)
    setDragging(true)
    setAnimating(false)
  }

  function handlePointerMove(e) {
    if (!dragRef.current || animating) return
    const delta = e.clientX - dragRef.current.x
    setDx(delta)
  }

  function handlePointerUp(e) {
    if (!dragRef.current || animating) return
    const delta = e.clientX - dragRef.current.x
    const elapsed = Date.now() - dragRef.current.time
    const isFastFlick = elapsed < 200 && Math.abs(delta) > 30

    if ((delta > SWIPE_THRESHOLD || (isFastFlick && delta > 30)) && canSwipeRight) {
      animateSwipeIn('right')
    } else if ((delta < -SWIPE_THRESHOLD || (isFastFlick && delta < -30)) && canSwipeLeft) {
      animateSwipeIn('left')
    } else {
      resetCard()
    }

    setDragging(false)
    dragRef.current = null
  }

  function resetCard() {
    setDx(0)
    setAnimating(false)
  }

  function handleKey(e) {
    if (e.key === 'ArrowRight' && canSwipeRight && !animating) {
      animateSwipeIn('right')
    }
    if (e.key === 'ArrowLeft' && canSwipeLeft && !animating) {
      animateSwipeIn('left')
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [canSwipeRight, canSwipeLeft])

  if (!currentPoem) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl"
        style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
        <p style={{ color: 'var(--tp-text-secondary)' }}>No more poems ✨</p>
      </div>
    )
  }

  const poet = getPoetInfo(currentPoem.author)
  const rotate = Math.min(Math.max(dx / 15, -12), 12)
  const opacity = Math.max(1 - Math.abs(dx) / 600, 0.7)
  const transition = animating ? `transform ${TRANSITION_DURATION}ms ease-out, opacity ${TRANSITION_DURATION}ms ease-out` : 'none'

  return (
    <div className="relative select-none" style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Navigation hint — prev peeking */}
      {canSwipeLeft && dx <= 0 && (
        <div className="absolute inset-0 rounded-xl opacity-20 scale-[0.95] -translate-x-2 z-0"
          style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }} />
      )}

      {/* Card */}
      <div
        className="relative z-10 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: 'var(--tp-surface)',
          borderRadius: '1.25rem',
          boxShadow: dragging || animating ? '0 8px 30px rgba(0,0,0,0.15)' : 'var(--tp-card-shadow)',
          border: '1.5px solid var(--tp-border)',
          transform: `translateX(${dx}px) rotate(${rotate}deg)`,
          opacity,
          transition,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={(e) => { if (dragging) handlePointerUp(e) }}
      >
        {/* Swipe indicators */}
        {dx > 20 && (
          <div className="absolute top-5 left-5 z-20 px-3 py-1 rounded-lg text-sm font-bold rotate-[-12deg] border-2 pointer-events-none"
            style={{ color: 'var(--tp-secondary)', borderColor: 'var(--tp-secondary)' }}>
            SWIPE
          </div>
        )}
        {dx < -20 && (
          <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-lg text-sm font-bold rotate-[12deg] border-2 pointer-events-none"
            style={{ color: 'var(--tp-text-secondary)', borderColor: 'var(--tp-text-secondary)' }}>
            BACK
          </div>
        )}

        {/* Header */}
        <div className="p-5 pb-0" onClick={openFullscreen}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ backgroundColor: 'var(--tp-secondary)' }}>
              {currentPoem.author.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
                {currentPoem.author}
              </h3>
              <p style={{ color: 'var(--tp-text-secondary)', fontSize: '0.75rem' }}>{poet.country} · {currentPoem.date}</p>
            </div>
          </div>
          <h2 className="text-lg font-bold leading-tight mb-2"
            style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            {currentPoem.title}
          </h2>
        </div>

        {/* Excerpt */}
        <div className="px-5 pb-3" onClick={openFullscreen}>
          <p className="text-sm leading-relaxed whitespace-pre-line line-clamp-5"
            style={{ color: 'var(--tp-text-secondary)', fontFamily: '"Inter", system-ui, sans-serif' }}>
            {currentPoem.content.split('\n').slice(0, 5).join('\n')}
          </p>
          <p className="text-xs mt-1.5 italic" style={{ color: 'var(--tp-muted, #94a3b8)' }}>Tap to read full poem</p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-medium" style={{ color: 'var(--tp-text-secondary)' }}>{currentPoem.likes.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); if (canSwipeLeft && !animating) animateSwipeIn('left') }}
              disabled={!canSwipeLeft}
              className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:scale-110 active:scale-90"
              style={{ color: 'var(--tp-text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); openFullscreen() }}
              className="p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90"
              style={{ color: 'var(--tp-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); if (canSwipeRight && !animating) animateSwipeIn('right') }}
              disabled={!canSwipeRight}
              className="p-1.5 rounded-xl transition-all disabled:opacity-20 hover:scale-110 active:scale-90"
              style={{ color: 'var(--tp-text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      <p className="text-center text-xs mt-2 opacity-40" style={{ color: 'var(--tp-text-secondary)' }}>
        ← drag or use arrows →
      </p>
    </div>
  )
}
