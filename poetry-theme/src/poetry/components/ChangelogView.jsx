import { useState } from 'react'
import logs from '../../logs'

function BugIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
      <path d="M12 19v-4" />
      <path d="M9 3l1.5 3" />
      <path d="M15 3l-1.5 3" />
      <path d="M5 7H2" />
      <path d="M22 7h-3" />
      <line x1="4" y1="14" x2="1.5" y2="16" />
      <line x1="20" y1="14" x2="22.5" y2="16" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function ChangelogView({ onNavigate }) {
  const [expanded, setExpanded] = useState({})

  function toggle(v) {
    setExpanded((prev) => ({ ...prev, [v]: !prev[v] }))
  }

  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          Changelog
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-[9px] top-2 bottom-2 w-px" style={{ backgroundColor: 'var(--tp-border)' }} />

          <div className="space-y-0">
            {logs.map((ver, i) => {
              const open = expanded[ver.versionCode]
              const features = Array.isArray(ver.features) ? ver.features : []
              const bugs = Array.isArray(ver.bugs) ? ver.bugs : []
              return (
                <div key={ver.versionCode} className="relative pl-8 pb-2">
                  <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center"
                    style={{
                      backgroundColor: open ? 'var(--tp-secondary)' : 'var(--tp-surface)',
                      borderColor: 'var(--tp-secondary)',
                    }}>
                    {open && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="white" stroke="none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  <button onClick={() => toggle(ver.versionCode)}
                    className="w-full text-left py-1.5 transition-opacity hover:opacity-80">
                    <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>
                      v{ver.versionCode}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--tp-text-secondary)' }}>
                      {ver.date}
                    </p>
                  </button>

                  {open && (
                    <div className="mt-2 space-y-2.5 pb-2 animate-fade-in">
                      {features.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#22c55e' }}>Features</p>
                          {features.map((feat, fi) => (
                            <div key={fi} className="flex items-start gap-1.5">
                              <CheckIcon />
                              <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {bugs.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#ef4444' }}>Bug Fixes</p>
                          {bugs.map((bug, bi) => (
                            <div key={bi} className="flex items-start gap-1.5">
                              <BugIcon />
                              <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{bug}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
    </div>
  )
}
