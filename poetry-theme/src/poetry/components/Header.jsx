import { getLanguageName } from '../../constants/languages'

export default function Header({ user, themeId, onMenuToggle, onProfileToggle, lang, onLangClick }) {
  const langDisplay = getLanguageName(lang) || lang.toUpperCase()
  return (
    <header
      className="flex-shrink-0 z-30 px-4 py-3 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--tp-header-bg)',
        color: 'var(--tp-header-text)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <button onClick={onMenuToggle} className="p-1.5 rounded-xl transition-opacity hover:opacity-70" aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="text-center">
        <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome'}
        </h1>
        <p className="text-[10px] opacity-80 leading-tight">
          {user ? `@${user.username}` : 'please sign in'}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onLangClick}
          className="px-2 py-1 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-70 flex items-center gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          {langDisplay}
        </button>
        <button onClick={onProfileToggle} className="p-1.5 rounded-xl transition-opacity hover:opacity-70" aria-label="Profile">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
          </svg>
        </button>
      </div>
    </header>
  )
}
