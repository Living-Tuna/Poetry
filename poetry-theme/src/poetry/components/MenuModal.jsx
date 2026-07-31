import { PenIcon, StarIcon } from './Icons'

function MenuBtn({ icon, label, onClick, subtle, danger }) {
  return (
    <button onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ color: danger ? '#ef4444' : (subtle ? 'var(--tp-text-secondary)' : 'var(--tp-text)') }}>
      <span className="flex items-center gap-3">
        <span style={{ color: danger ? '#ef4444' : 'var(--tp-secondary)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
        {label}
      </span>
    </button>
  )
}

function NavCardBtn({ icon, label, subtext, onClick, badge }) {
  return (
    <button onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
      style={{ color: 'var(--tp-text)' }}>
      <span style={{ color: 'var(--tp-secondary)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium truncate">{label}</span>
        <span className="block text-[10px] mt-0.5 truncate" style={{ color: 'var(--tp-text-secondary)' }}>{subtext}</span>
      </span>
      {badge > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold flex-shrink-0"
          style={{ backgroundColor: 'var(--tp-secondary)' }}>{badge}</span>
      )}
    </button>
  )
}

import logs from '../../logs'

export default function MenuModal({ open, onClose, onSettings, onWriteNow, onFavorites, onNavigate, onCategories, onChangelog, favoritesCount, categoryCount, user, inboxLatest, unreadCount, shelfCount }) {
  return (
    <div className="fixed inset-0 z-40"
      onClick={onClose}
      style={{
        backgroundColor: open ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'background-color 0.3s ease',
      }}>
      <div onClick={(e) => e.stopPropagation()}
        className="h-full w-64 p-5 flex flex-col overflow-y-auto"
        style={{
          backgroundColor: 'var(--tp-surface)',
          borderRight: '1.5px solid var(--tp-border)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>Menu</h3>
        </div>

        {/* Rounded card with Shelf, Blend, Inbox */}
        <div className="rounded-xl p-2 mb-4" style={{ backgroundColor: 'var(--tp-bg)', border: '1.5px solid var(--tp-border)' }}>
          <NavCardBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          } label="My Shelf" subtext={shelfCount > 0 ? `${shelfCount} book${shelfCount > 1 ? 's' : ''}` : 'add your books'}
            onClick={() => { onNavigate('shelf'); onClose() }} />
          <NavCardBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          } label="Blend" subtext="find your book"
            onClick={() => { onNavigate('blend'); onClose() }} />
          <NavCardBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          } label="Inbox" subtext={inboxLatest || 'latest messages'} badge={unreadCount}
            onClick={() => { onNavigate('inbox'); onClose() }} />
        </div>

        <div className="space-y-0.5">
          {user && (
            <MenuBtn icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            } label="My Writings" onClick={() => { onNavigate('my-writings'); onClose() }} />
          )}
          <MenuBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          } label="Write New" onClick={onWriteNow} />
          <MenuBtn icon={<StarIcon size={16} />} label={`Favorites (${favoritesCount})`}
            onClick={() => { onNavigate('favorites'); onClose() }} />
          <MenuBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          } label={`Categories (${categoryCount})`} onClick={onCategories} />
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--tp-border)' }}>
          <MenuBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          } label="Settings" onClick={onSettings} />
        </div>

        <div className="mt-auto pt-4 space-y-0.5" style={{ borderTop: '1px solid var(--tp-border)' }}>
          <MenuBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="12 8 8 12 12 16" /><polyline points="16 8 12 12 16 16" />
            </svg>
          } label={<span>Changelog <span className="text-[10px] font-normal" style={{ color: 'var(--tp-text-secondary)' }}>v{logs[0].versionCode}</span></span>}
            onClick={() => { onChangelog(); onClose() }} subtle />
          <MenuBtn icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          } label="Close" onClick={onClose} subtle />
        </div>
      </div>
    </div>
  )
}
