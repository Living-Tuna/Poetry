import DataIndicator from './DataIndicator'

function ProfileNavItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
      style={{ color: '#fff' }}>
      <span className="flex items-center gap-2"><span>{icon}</span><span>{label}</span></span>
    </button>
  )
}

export default function CompactProfile({ user, myPoems, favorites, myPoemsCachedOnly, onNavigate, onClose, onLogout, shelfCount, inboxUnread, unreadCount }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Profile</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--tp-header-text)' }} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
          {user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'U'}
        </div>
        <h2 className="text-lg font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>{user?.name}</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>@{user?.username}</p>
      </div>

      <div className="flex justify-center gap-8 mb-5">
        <div className="text-center">
          <p className={`text-lg font-bold ${myPoems.length > 0 ? '' : 'opacity-50'}`}>{myPoems.length}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Poems</p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${favorites.length > 0 ? '' : 'opacity-50'}`}>{favorites.length}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Favorites</p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${shelfCount > 0 ? '' : 'opacity-50'}`}>{shelfCount}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Shelf</p>
        </div>
      </div>

      <div className="rounded-xl p-2 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <ProfileNavItem icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        } label={<span className="flex items-center gap-1.5">My Shelf <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>({shelfCount > 0 ? `${shelfCount} books` : 'add your books'})</span></span>}
          onClick={() => { onNavigate('shelf'); onClose() }} />
        <ProfileNavItem icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        } label={<span className="flex items-center gap-1.5">Blend <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>(find your book)</span></span>}
          onClick={() => { onNavigate('blend'); onClose() }} />
        <ProfileNavItem icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        } label={<span className="flex items-center gap-1.5">Inbox {inboxUnread > 0 && <span className="text-[10px] px-1 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--tp-secondary)' }}>{inboxUnread}</span>}</span>}
          onClick={() => { onNavigate('inbox'); onClose() }} />
      </div>

      <div className="space-y-1 mb-4">
        <ProfileNavItem icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
        } label={<span className="flex items-center gap-1.5">My Writings ({myPoems.length}) <DataIndicator cachedOnly={myPoemsCachedOnly} size={10} /></span>}
          onClick={() => { onNavigate('my-writings'); onClose() }} />
        <ProfileNavItem icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        } label={`Favorite Lines (${favorites.length})`}
          onClick={() => { onNavigate('favorites'); onClose() }} />
        <ProfileNavItem icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        } label={<span className="flex items-center gap-1.5">Notifications {unreadCount > 0 && <span className="text-[10px] px-1 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--tp-secondary)' }}>{unreadCount}</span>}</span>}
          onClick={() => { onNavigate('notifications'); onClose() }} />
      </div>

      <button onClick={onLogout} style={{
        width: '100%', padding: '0.625rem', borderRadius: '0.75rem',
        fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
        backgroundColor: 'var(--tp-secondary)', color: '#fff',
      }}>Sign Out</button>
    </div>
  )
}
