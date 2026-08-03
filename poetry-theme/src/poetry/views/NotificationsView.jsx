import { useBook } from '../contexts/BookContext'
import { useLanguage } from '../../language/LanguageProvider'

export default function NotificationsView({ onNavigate }) {
  const { notifs, markNotifRead, clearNotifs, unreadCount } = useBook()
  const { t, lang } = useLanguage()

  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            {t('notifications.title')}
          </h2>
          {unreadCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold"
              style={{ backgroundColor: 'var(--tp-secondary)' }}>{unreadCount}</span>
          )}
        </div>
        {notifs.length > 0 && (
          <button onClick={clearNotifs}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-70"
            style={{ color: '#fca5a5', backgroundColor: 'color-mix(in srgb, #fca5a5 15%, transparent)' }}>
            {t('notifications.clearAll')}
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>{t('notifications.empty')}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifs.map((n) => (
            <div key={n.id} onClick={() => markNotifRead(n.id)}
              className="rounded-xl p-3.5 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'var(--tp-surface)',
                border: `1.5px solid ${n.read ? 'var(--tp-border)' : 'var(--tp-secondary)'}`,
                opacity: n.read ? 0.7 : 1,
              }}>
              <div className="flex items-start gap-2">
                {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: 'var(--tp-secondary)' }} />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm" style={{ color: n.read ? 'var(--tp-text-secondary)' : 'var(--tp-text)' }}>{n.text}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--tp-text-secondary)', opacity: 0.5 }}>
                    {new Date(n.timestamp).toLocaleString(lang || 'en-US')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
