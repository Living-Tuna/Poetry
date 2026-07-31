import { useEffect, useRef } from 'react'
import { getLanguageName } from '../../constants/languages'

const CATEGORIES = ['Love', 'Nature', 'Philosophy', 'Tragedy', 'Hope', 'Spirituality', 'Freedom', 'War', 'Death', 'Joy', 'Reflection', 'Fantasy']

export default function WritePoemView({
  open, onClose, onSave, editingPoem,
  title, onTitleChange,
  content, onContentChange,
  categories, onCategoriesChange,
  lang,
}) {
  const titleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => titleRef.current?.focus(), 60)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  const canSave = Boolean(title.trim() && content.trim())

  function toggleCategory(cat) {
    if (categories.includes(cat)) {
      onCategoriesChange(categories.filter((c) => c !== cat))
    } else if (categories.length < 3) {
      onCategoriesChange([...categories, cat])
    }
  }

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
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-sm sm:text-base font-bold truncate px-2"
          style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {editingPoem ? 'Edit Poem' : 'Write a Poem'}
        </h2>

        <button
          onClick={onSave}
          disabled={!canSave}
          className="px-4 py-1.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
          style={{ backgroundColor: 'var(--tp-secondary)' }}
        >
          {editingPoem ? 'Update' : 'Save'}
        </button>
      </div>

      {/* Writing area */}
      <div className="flex-1 overflow-y-auto poem-scroll px-5 py-8">
        <div className="max-w-2xl mx-auto">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Title your poem..."
            className="w-full text-center text-2xl sm:text-3xl font-bold px-3 py-2 rounded-xl outline-none transition-colors"
            style={{
              color: 'var(--tp-text)',
              backgroundColor: 'transparent',
              fontFamily: '"Playfair Display", Georgia, serif',
            }}
            onFocus={(e) => { e.target.style.borderBottom = '1.5px solid var(--tp-secondary)'; e.target.style.borderRadius = '0' }}
            onBlur={(e) => { e.target.style.borderBottom = 'none' }}
          />
          <p className="text-center text-[10px] px-2 py-0.5 rounded-full mt-3 inline-block"
            style={{ backgroundColor: 'var(--tp-secondary)', color: '#fff' }}>
            {getLanguageName(lang) || lang}
          </p>

          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your poem here..."
            rows={16}
            className="w-full mt-6 px-3 py-2 rounded-xl text-base outline-none resize-none transition-colors"
            style={{
              color: 'var(--tp-text)',
              backgroundColor: 'transparent',
              fontFamily: '"Playfair Display", Georgia, serif',
              lineHeight: '1.8',
              minHeight: '45vh',
            }}
            onFocus={(e) => { e.target.style.backgroundColor = 'var(--tp-surface)' }}
            onBlur={(e) => { e.target.style.backgroundColor = 'transparent' }}
          />
        </div>
      </div>

      {/* Bottom bar — category selector */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: '1px solid var(--tp-border)', backgroundColor: 'var(--tp-bg)' }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--tp-text-secondary)' }}>
          Categories (up to 3):
        </p>
        <div
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
        >
          {CATEGORIES.map((cat) => {
            const selected = categories.includes(cat)
            return (
              <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 transition-all"
                style={{
                  backgroundColor: selected ? 'var(--tp-secondary)' : 'var(--tp-bg)',
                  color: selected ? '#fff' : 'var(--tp-text-secondary)',
                  border: '1px solid var(--tp-border)',
                  opacity: !selected && categories.length >= 3 ? 0.4 : 1,
                }}
              >{cat}</button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
