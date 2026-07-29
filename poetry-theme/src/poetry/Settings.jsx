import { useTheme } from '../theme/ThemeContext'
import { themeList } from '../theme/themes'

export default function Settings({ onClose }) {
  const { themeId, setTheme } = useTheme()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[80vh] overflow-y-auto animate-fade-in"
        style={{
          backgroundColor: 'var(--tp-surface)',
          border: '1.5px solid var(--tp-border)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-bold"
            style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Theme Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl transition-colors hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--tp-text-secondary)' }}>
          Choose a color theme for your poetry experience
        </p>

        {/* Theme grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {themeList.map((t) => {
            const isActive = themeId === t.id
            const preview = t.css
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={[
                  'relative rounded-xl p-4 text-left transition-all duration-200',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isActive ? 'ring-2 scale-[1.02]' : 'hover:shadow-md',
                ].join(' ')}
                style={{
                  backgroundColor: preview['--tp-surface'],
                  border: `1.5px solid ${isActive ? preview['--tp-secondary'] : preview['--tp-border']}`,
                  ringColor: isActive ? preview['--tp-secondary'] : 'transparent',
                }}
              >
                {isActive && (
                  <span
                    className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: preview['--tp-secondary'] }}
                  />
                )}

                <span className="text-2xl block mb-2">{t.emoji}</span>

                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: preview['--tp-text'], fontFamily: '"Playfair Display", serif' }}
                >
                  {t.label}
                </p>

                {/* Color swatches */}
                <div className="flex gap-1 mt-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preview['--tp-secondary'] }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preview['--tp-tertiary'] }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preview['--tp-accent'] }} />
                </div>

                <p className="text-[10px] mt-1.5" style={{ color: preview['--tp-text-secondary'] }}>
                  {isActive ? 'Active' : t.id}
                </p>
              </button>
            )
          })}
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--tp-secondary)' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
