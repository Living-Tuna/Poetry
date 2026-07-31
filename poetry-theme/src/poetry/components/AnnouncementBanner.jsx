import { useState } from 'react'
import announcements from '../../announcement'

const DISMISS_KEY = 'poetry_announcement_dismissed'

const TYPE_META = {
  logo:    { color: 'var(--tp-secondary)', label: 'Logo' },
  announce: { color: '#3b82f6', label: 'Announcement' },
  note:    { color: '#f59e0b', label: 'Note' },
  error:   { color: '#ef4444', label: 'Error' },
  bug:     { color: '#a855f7', label: 'Bug' },
  fixed:   { color: '#22c55e', label: 'Fixed' },
}

function TypeIcon({ type }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'logo':
      return (
        <svg {...common}>
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
          <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
        </svg>
      )
    case 'announce':
      return (
        <svg {...common}>
          <path d="M3 11v4a1 1 0 0 0 1 1h2l3 4V6L6 10H4a1 1 0 0 0-1 1z" />
          <path d="M15 5.5v13a2 2 0 0 0 3 1.73l3-1.73a2 2 0 0 0 1-1.73V6.23a2 2 0 0 0-1-1.73l-3-1.73a2 2 0 0 0-3 1.73z" />
        </svg>
      )
    case 'note':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      )
    case 'error':
      return (
        <svg {...common}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      )
    case 'bug':
      return (
        <svg {...common}>
          <rect x="8" y="6" width="8" height="14" rx="4" />
          <path d="M19 7l-3 2M5 7l3 2" />
          <path d="M19 19l-3-2M5 19l3-2" />
          <path d="M20 13h-4M8 13H4M10 3l1 2M14 3l-1 2" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12.5l2.5 2.5L16 9" />
        </svg>
      )
  }
}

function loadDismissed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(DISMISS_KEY)) || [])
  } catch {
    return new Set()
  }
}

function saveDismissed(set) {
  try {
    localStorage.setItem(DISMISS_KEY, JSON.stringify([...set]))
  } catch {}
}

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(loadDismissed)
  const [open, setOpen] = useState(false)

  const active = announcements.find((a) => !dismissed.has(a.id)) || null

  if (!active) return null

  const meta = TYPE_META[active.type] || TYPE_META.note
  const color = meta.color

  function handleDismiss() {
    setDismissed((prev) => {
      const next = new Set(prev)
      next.add(active.id)
      saveDismissed(next)
      return next
    })
    setOpen(false)
  }

  return (
    <div className="rounded-xl overflow-hidden animate-fade-in"
      style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:opacity-90"
        aria-label={active.heading}
      >
        <span className="flex-shrink-0" style={{ color }}><TypeIcon type={active.type} /></span>
        <span className="flex-1 min-w-0 truncate text-sm font-bold" style={{ color: 'var(--tp-text)' }}>
          {active.heading}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 hidden sm:block" style={{ color }}>
          {meta.label}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ color: 'var(--tp-text-secondary)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-4 py-3 pt-1 border-t animate-slide-down" style={{ borderColor: 'var(--tp-border)' }}>
          <div className="flex items-start gap-2.5">
            <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--tp-text-secondary)' }}>
              {active.description}
            </p>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg transition-colors hover:opacity-70 flex-shrink-0"
              style={{ color: 'var(--tp-text-secondary)' }}
              aria-label="Close announcement"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
