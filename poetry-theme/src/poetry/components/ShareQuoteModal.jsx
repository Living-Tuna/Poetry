import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import html2canvas from 'html2canvas'
import { SITE_NAME, shareText } from '../../constants'

export default function ShareQuoteModal({ favorite, favorites, initialIndex, onClose, inline = false }) {
  const cardRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const swipeStart = useRef(null)
  const swipedRef = useRef(false)

  const list = favorites && favorites.length ? favorites : [favorite]
  const [index, setIndex] = useState(() => {
    if (!favorites || !favorites.length) return 0
    const start = initialIndex || 0
    return Math.max(0, Math.min(start, favorites.length - 1))
  })
  const current = list[Math.min(index, list.length - 1)]

  const lineText = current.sentenceText || current.lineText
  const poemTitle = current.poemTitle
  const author = current.author
  const textLen = lineText.length
  const quoteFontSize = textLen < 40 ? '1.125rem' : textLen < 80 ? '1rem' : textLen < 120 ? '0.875rem' : '0.75rem'
  const date = current.date ? new Date(current.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : ''

  function go(delta) {
    setIndex((i) => Math.max(0, Math.min(i + delta, list.length - 1)))
  }

  function onSwipeStart(e) {
    swipeStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { }
  }

  function onSwipeEnd(e) {
    if (!swipeStart.current) return
    const dx = e.clientX - swipeStart.current.x
    const dy = e.clientY - swipeStart.current.y
    swipeStart.current = null
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    swipedRef.current = true
    go(dx < 0 ? 1 : -1)
  }

  function handleBackdropClick() {
    if (swipedRef.current) { swipedRef.current = false; return }
    onClose()
  }

  async function getCanvas() {
    return html2canvas(cardRef.current, { scale: 4, useCORS: true, backgroundColor: null })
  }

  async function handleShare() {
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(shareText())
      } catch {}
      return
    }
    setBusy(true)
    try {
      const canvas = await getCanvas()
      const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) return
      const file = new File([blob], `poetry-${poemTitle.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' })
      await navigator.share({
        title: `"${lineText}"`,
        text: `${shareText()} — "${lineText}" — ${poemTitle} by ${author}`,
        files: [file],
      })
    } catch { }
    setBusy(false)
  }

  const card = (
    <>
      {list.length > 1 && (
        <div className="flex items-center gap-1.5">
          {list.map((_, i) => (
            <span key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? '18px' : '6px',
                height: '6px',
                backgroundColor: i === index ? 'var(--tp-secondary)' : 'rgba(255,255,255,0.35)',
              }} />
          ))}
        </div>
      )}

      <div ref={cardRef}
        onPointerDown={onSwipeStart}
        onPointerUp={onSwipeEnd}
        onPointerCancel={onSwipeEnd}
        onLostPointerCapture={onSwipeEnd}
        className="w-full aspect-square rounded-3xl flex flex-col items-center justify-center text-center p-8 select-none"
        style={{
          backgroundColor: 'var(--tp-surface)',
          border: '2px solid var(--tp-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          touchAction: 'pan-y',
          cursor: 'grab',
        }}>
        <div className="mb-3 flex-shrink-0" style={{ color: 'var(--tp-secondary)', opacity: 0.3 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <div className="flex-1 min-h-0 w-full overflow-y-auto px-1">
          <div className="min-h-full flex items-center justify-center">
            <p className="leading-relaxed font-medium"
              style={{
                color: 'var(--tp-text)',
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontSize: quoteFontSize,
              }}>
              "{lineText}"
            </p>
          </div>
        </div>

        <div className="mt-auto pt-4 flex-shrink-0">
          <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: 'var(--tp-border)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--tp-secondary)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            {poemTitle}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>
            by {author}
          </p>
          {date && (
            <p className="text-[10px] mt-1.5" style={{ color: 'var(--tp-text-secondary)', opacity: 0.6 }}>
              {date}
            </p>
          )}
          <p className="text-[9px] mt-2 font-semibold tracking-wider uppercase" style={{ color: 'var(--tp-secondary)', opacity: 0.5 }}>
            {SITE_NAME}
          </p>
        </div>
      </div>

      <div className="flex gap-2 w-full max-w-sm">
        <button onClick={handleShare} disabled={busy}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: 'var(--tp-secondary)' }}>
          {busy ? '⋯' : 'Share'}
        </button>
        {!inline && (
          <button onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-70 active:scale-90 flex-shrink-0"
            style={{ color: 'var(--tp-text-secondary)', backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </>
  )

  if (inline) {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
        {card}
      </div>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-4 w-full max-w-sm animate-fade-in">
        {card}
      </div>
    </div>,
    document.body
  )
}
