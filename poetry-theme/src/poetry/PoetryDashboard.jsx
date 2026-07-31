import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { usePoetry } from './PoetryContext'
import FullscreenView from './FullscreenView'
import Settings from './Settings'
import Header from './components/Header'
import MenuModal from './components/MenuModal'
import AuthForms from './components/AuthForms'
import CompactProfile from './components/CompactProfile'
import PersonProfile from './components/PersonProfile'
import { btnWhite } from './components/AuthForms'
import WritePoemView from './components/WritePoemView'
import WritingsView from './views/WritingsView'
import FavoritesView from './views/FavoritesView'
import TermsView from './views/TermsView'
import PrivacyView from './views/PrivacyView'
import AboutView from './views/AboutView'
import CategoriesView from './views/CategoriesView'
import CategoryPoemsView from './views/CategoryPoemsView'
import DashboardView from './views/DashboardView'
import ShelfView from './views/ShelfView'
import BlendView from './views/BlendView'
import InboxView from './views/InboxView'
import NotificationsView from './views/NotificationsView'
import LanguagePicker from './components/LanguagePicker'
import ChangelogView from './components/ChangelogView'
import LocationModal from './components/LocationModal'
import { COUNTRIES } from '../constants/languages'
import { useBook } from './contexts/BookContext'

export default function PoetryDashboard() {
  const { user, login, logout, signup, checkUsername,
          getUserSecurityQuestion, resetPassword } = useAuth()
  const {
    resetQueue, favorites, clearFavorites, fullscreen,
    navigateToPoem, myPoems, addMyPoem, updateMyPoem, deleteMyPoem,
    editRequest, setEditRequest, recentlyViewed, allPoems,
    editOnOpen, setEditOnOpen, myPoemsCachedOnly,
    reading,
  } = usePoetry()
  const { shelf, inbox, inboxUnread, unreadCount, notifs } = useBook()
  const [lang, setLang] = useState(localStorage.getItem('poetry_lang') || 'en')
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false)
  const [chatContact, setChatContact] = useState(null)
  const [showPersonProfile, setShowPersonProfile] = useState(false)
  const [notice, setNotice] = useState(null)
  const filteredPoems = allPoems.filter((p) => (p.language || 'en') === lang)
  const trending = filteredPoems.length > 0
    ? [...filteredPoems]
        .filter((p) => !user || p.author !== user.username)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6)
    : []
  const latest = filteredPoems.length > 0
    ? [...filteredPoems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6)
    : []
  const uniqueCategories = filteredPoems.length > 0
    ? [...new Set(filteredPoems.flatMap((p) => p.categories || []))].sort()
    : []
  const randomFavorite = favorites.length > 0
    ? favorites[Math.floor(Math.random() * favorites.length)]
    : null
  const [bodyView, setBodyView] = useState('dashboard')
  const [slideOpen, setSlideOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [blendFocus, setBlendFocus] = useState(null)
  const [focusFavorite, setFocusFavorite] = useState(null)
  const locationAsked = useRef(false)
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [writeTitle, setWriteTitle] = useState('')
  const [writeContent, setWriteContent] = useState('')
  const [writeCategories, setWriteCategories] = useState([])
  const [editingPoem, setEditingPoem] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const categoryPoems = selectedCategory && filteredPoems.length > 0
    ? filteredPoems.filter((p) => (p.categories || []).includes(selectedCategory))
    : []
  const trendingScroll = useRef(null)
  const mainRef = useRef(null)

  const [authMode, setAuthMode] = useState('login')
  const [aUsername, setAUsername] = useState('')
  const [aPassword, setAPassword] = useState('')
  const [aRetype, setARetype] = useState('')
  const [aName, setAName] = useState('')
  const [aQuestion, setAQuestion] = useState('')
  const [aAnswer, setAAnswer] = useState('')
  const [aNewPass, setANewPass] = useState('')
  const [aError, setAError] = useState('')
  const [aBusy, setABusy] = useState(false)
  const [aSuggestions, setASuggestions] = useState([])
  const [aSecurityQ, setASecurityQ] = useState('')
  const [signupStep, setSignupStep] = useState(0)
  const [aCountry, setACountry] = useState('')
  const [aState, setAState] = useState('')
  const [aZip, setAZip] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo(0, 0)
  }, [bodyView])

  useEffect(() => {
    const seg = location.pathname.split('/')[1]
    window.scrollTo(0, 0)
    const knownLangs = new Set(Object.values(COUNTRIES).flatMap((c) => c.languages.map((l) => l.code)))
    knownLangs.add('en')
    if (seg && knownLangs.has(seg)) {
      localStorage.setItem('poetry_lang', seg)
      setLang(seg)
      setBodyView('dashboard')
    }     else if (seg === 'shelf') setBodyView('shelf')
    else if (seg === 'blend') setBodyView('blend')
    else if (seg === 'inbox') setBodyView('inbox')
    else if (seg === 'notifications') setBodyView('notifications')
    else if (seg === 'terms') setBodyView('terms')
    else if (seg === 'policy') setBodyView('privacy')
    else if (seg === 'about') setBodyView('about')
    else if (seg) navigate(`/${lang}`)
  }, [location.pathname, lang, navigate])

  function handleLanguageSelect(code) {
    localStorage.setItem('poetry_lang', code)
    setLang(code)
    setLanguagePickerOpen(false)
  }

  const closeSlide = () => { setSlideOpen(false); setAuthMode('login'); setAError(''); setSignupStep(0) }

  function openSignup() { setAuthMode('signup'); setAError(''); setSignupStep(0); setASuggestions([]); setAUsername(''); setAName(''); setAPassword(''); setARetype(''); setAQuestion(''); setAAnswer(''); setACountry(''); setAState(''); setAZip('') }
  function openLogin() { setAuthMode('login'); setAError('') }
  function openForgot() { setAuthMode('forgot'); setAError('') }

  async function handleLogin(e) {
    e?.preventDefault()
    setAError('')
    if (!aUsername.trim() || !aPassword) { setAError('Fill all fields'); return }
    setABusy(true)
    const res = await login(aUsername.trim(), aPassword)
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else closeSlide()
  }

  async function handleSignupNext0() {
    setAError('')
    const u = aUsername.trim().toLowerCase()
    if (!u || u.length < 3) { setAError('Username must be at least 3 characters'); return }
    setABusy(true)
    const res = await checkUsername(u)
    setABusy(false)
    if (res.available === null) { setAError('Could not check username — please try again.'); return }
    if (!res.available) { setAError('Username taken — try one below'); setASuggestions(res.suggestions ?? []); return }
    setASuggestions([])
    setSignupStep(1)
  }

  async function handleSignup() {
    setAError('')
    if (!aQuestion.trim() || !aAnswer.trim()) { setAError('Fill security question and answer'); return }
    const u = aUsername.trim().toLowerCase()
    setABusy(true)
    const res = await signup(u, aPassword, aName.trim(), aQuestion.trim(), aAnswer.trim(), aCountry, aState, aZip)
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else {
      if (aCountry) localStorage.setItem('poetry_country', aCountry)
      if (aState) localStorage.setItem('poetry_state', aState)
      if (aZip) localStorage.setItem('poetry_zip', aZip)
      setAuthMode('login'); setAError('Account created! Sign in below.'); setAPassword(''); setAAnswer('')
    }
  }

  async function handleForgotLookup(e) {
    e?.preventDefault()
    setAError('')
    if (!aUsername.trim()) { setAError('Enter your username'); return }
    setABusy(true)
    const res = await getUserSecurityQuestion(aUsername.trim())
    setABusy(false)
    if (res.error || !res.question) { setAError(res.error || 'Username not found'); return }
    setASecurityQ(res.question)
    setAuthMode('forgot_reset')
  }

  async function handleForgotReset(e) {
    e?.preventDefault()
    setAError('')
    if (!aAnswer.trim()) { setAError('Answer the security question'); return }
    if (!aNewPass || aNewPass.length < 6) { setAError('Password must be at least 6 characters'); return }
    setABusy(true)
    const res = await resetPassword(aUsername.trim(), aAnswer.trim(), aNewPass)
    setABusy(false)
    if (!res.ok) {
      if (res.error === 'PASSWORD_RESET_NEEDS_BACKEND') {
        setAError('Password reset requires Edge Functions to be deployed. Use Supabase Dashboard for now.')
      } else {
        setAError(res.error)
      }
    } else { setAuthMode('login'); setAError('Password reset. Sign in with your new password.'); setAPassword('') }
  }

  useEffect(() => {
    if (editRequest) {
      setEditingPoem(editRequest)
      setWriteTitle(editRequest.title)
      setWriteContent(editRequest.content)
      setWriteCategories(editRequest.categories || [])
      setShowWriteModal(true)
      setEditRequest(null)
    }
  }, [editRequest])

  function handleSavePoem() {
    if (!writeTitle.trim() || !writeContent.trim()) return
    if (editingPoem) {
      updateMyPoem(editingPoem.id, { title: writeTitle.trim(), content: writeContent.trim(), categories: writeCategories, language: lang })
    } else {
      addMyPoem({
        id: Date.now(),
        title: writeTitle.trim(),
        content: writeContent.trim(),
        categories: writeCategories,
        language: lang,
        createdAt: new Date().toLocaleDateString(),
        author: user?.name || 'Unknown',
      })
    }
    setWriteTitle('')
    setWriteContent('')
    setWriteCategories([])
    setEditingPoem(null)
    setShowWriteModal(false)
  }

  function handleEditPoem(p) {
    setEditOnOpen(true)
    navigateToPoem(p)
  }

  function handleNavigate(view) {
    setBodyView(view)
    if (view !== 'inbox') setChatContact(null)
    if (view === 'blend') {
      setBlendFocus(null)
      const zip = localStorage.getItem('poetry_zip') || user?.zip || ''
      if (user && !zip) setShowLocationModal(true)
    }
  }

  const seenMsgIds = useRef(new Set())
  const seenNotifIds = useRef(new Set())

  useEffect(() => {
    const fresh = inbox.filter((m) => !seenMsgIds.current.has(m.id))
    if (fresh.length > 0) {
      const newest = inbox.find((m) => fresh.includes(m.id))
      if (newest && newest.from !== user?.username && !newest.read) {
        setNotice({ text: `New message from ${newest.from}`, action: () => handleNavigate('inbox') })
      }
      fresh.forEach((m) => seenMsgIds.current.add(m.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inbox, user])

  useEffect(() => {
    const fresh = notifs.filter((n) => !seenNotifIds.current.has(n.id))
    if (fresh.length > 0) {
      const n = notifs.find((x) => fresh.includes(x.id))
      if (n) setNotice({ text: n.text, action: () => handleNavigate('notifications') })
      fresh.forEach((x) => seenNotifIds.current.add(x.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifs])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 3000)
    return () => clearTimeout(t)
  }, [notice])

  function handleNoticeClick() {
    const action = notice?.action
    setNotice(null)
    if (action) action()
  }

  useEffect(() => {
    if (!user || locationAsked.current) return
    const country = localStorage.getItem('poetry_country') || user.country || ''
    const state = localStorage.getItem('poetry_state') || user.state || ''
    const zip = localStorage.getItem('poetry_zip') || user.zip || ''
    if (!country || !state || !zip) {
      locationAsked.current = true
      setShowLocationModal(true)
    }
  }, [user])

  function handleSelectCategory(cat) {
    setSelectedCategory(cat)
    setBodyView('category-poems')
  }

  if (fullscreen) return <FullscreenView />

  function scrollTrending(dir) {
    if (!trendingScroll.current) return
    const amount = 280
    trendingScroll.current.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh', height: '100dvh', backgroundColor: 'var(--tp-bg)' }}>
      <Header
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        onProfileToggle={() => setSlideOpen(!slideOpen)}
        lang={lang}
        onLangClick={() => setLanguagePickerOpen(true)}
        allPoems={allPoems}
        onSearchSelect={navigateToPoem}
        favorites={favorites}
        view={bodyView}
        onOpenBooks={(title) => { console.log('[Dashboard] onOpenBooks', title); setBlendFocus({ q: title || '', n: Date.now() }) }}
        onOpenFavorites={(fav) => { console.log('[Dashboard] onOpenFavorites', fav?.key); setFocusFavorite(fav || null); handleNavigate('favorites') }}
        chatContact={chatContact}
        onChatBack={() => setChatContact(null)}
        onChatProfile={() => setShowPersonProfile(true)}
        notice={notice}
        onNoticeClick={handleNoticeClick}
      />

      {showPersonProfile && chatContact && (
        <PersonProfile
          username={chatContact}
          onClose={() => setShowPersonProfile(false)}
        />
      )}

      {/* ─── Slide-down panel ─── */}
      <div
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          transform: slideOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: slideOpen ? 1 : 0,
          pointerEvents: slideOpen ? 'auto' : 'none',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease-in-out',
        }}
      >
        <div onClick={() => setSlideOpen(false)} style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div onClick={(e) => e.stopPropagation()}
            className="overflow-y-auto"
            style={{
              backgroundColor: 'var(--tp-header-bg)',
              color: 'var(--tp-header-text)',
              maxHeight: '90vh',
              borderRadius: '0 0 1.25rem 1.25rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            {!user && (
              <AuthForms
                authMode={authMode} signupStep={signupStep}
                aUsername={aUsername} aPassword={aPassword} aRetype={aRetype}
                aName={aName} aQuestion={aQuestion} aAnswer={aAnswer}
                aNewPass={aNewPass} aError={aError} aBusy={aBusy}
                aSuggestions={aSuggestions} aSecurityQ={aSecurityQ}
                aCountry={aCountry} aState={aState} aZip={aZip}
                setAUsername={setAUsername} setAPassword={setAPassword}
                setARetype={setARetype} setAName={setAName}
                setAQuestion={setAQuestion} setAAnswer={setAAnswer}
                setANewPass={setANewPass} setAError={setAError}
                setABusy={setABusy} setASuggestions={setASuggestions}
                setSignupStep={setSignupStep} setAuthMode={setAuthMode}
                setACountry={setACountry} setAState={setAState} setAZip={setAZip}
                handleLogin={handleLogin} handleSignupNext0={handleSignupNext0}
                handleSignup={handleSignup}
                handleForgotLookup={handleForgotLookup}
                handleForgotReset={handleForgotReset}
                openSignup={openSignup} openLogin={openLogin} openForgot={openForgot}
                closeSlide={closeSlide}
              />
            )}

            {user && (
              <CompactProfile
                user={user} myPoems={myPoems} favorites={favorites}
                myPoemsCachedOnly={myPoemsCachedOnly}
                onNavigate={handleNavigate} onClose={closeSlide}
                onLogout={logout}
                shelfCount={shelf.length}
                inboxUnread={inboxUnread}
                unreadCount={unreadCount}
                streak={reading?.streakCurrent || 0}
              />
            )}
          </div>
        </div>
      </div>

      <MenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSettings={() => { setMenuOpen(false); handleNavigate('settings') }}
        onWriteNow={() => { setShowWriteModal(true); setMenuOpen(false); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([]) }}
        onFavorites={() => { setMenuOpen(false); handleNavigate('favorites') }}
        onNavigate={handleNavigate}
        onCategories={() => { setMenuOpen(false); handleNavigate('categories') }}
        favoritesCount={favorites.length}
        categoryCount={uniqueCategories.length}
        user={user}
        inboxLatest={inbox[0] ? `Re: ${inbox[0].bookTitle}` : 'latest messages'}
        unreadCount={inboxUnread}
        shelfCount={shelf.length}
        onChangelog={() => { setMenuOpen(false); handleNavigate('changelog') }}
      />

      {showLocationModal && <LocationModal onClose={() => setShowLocationModal(false)} />}

      <LanguagePicker
        open={languagePickerOpen}
        lang={lang}
        onSelect={handleLanguageSelect}
        onClose={() => setLanguagePickerOpen(false)}
      />

      <WritePoemView
        open={showWriteModal}
        onClose={() => { setShowWriteModal(false); setWriteTitle(''); setWriteContent(''); setWriteCategories([]); setEditingPoem(null) }}
        onSave={handleSavePoem}
        editingPoem={editingPoem}
        title={writeTitle} onTitleChange={setWriteTitle}
        content={writeContent} onContentChange={setWriteContent}
        categories={writeCategories} onCategoriesChange={setWriteCategories}
        lang={lang}
      />

      {/* Body — view switching */}
      <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--tp-bg)' }}>
        {bodyView === 'dashboard' && (
          <DashboardView
            user={user} slideOpen={slideOpen} setSlideOpen={setSlideOpen}
            setAuthMode={setAuthMode} btnWhite={btnWhite}
            recentlyViewed={recentlyViewed} navigateToPoem={navigateToPoem}
            trending={trending} trendingScroll={trendingScroll}
            scrollTrending={scrollTrending}
            latest={latest}
            favoriteQuote={randomFavorite}
            favorites={favorites}
            myPoems={myPoems} myPoemsCachedOnly={myPoemsCachedOnly}
            onNavigate={handleNavigate}
            onNewPoem={() => { setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([]) }}
          />
        )}
        {bodyView === 'my-writings' && (
          <WritingsView
            myPoems={myPoems} myPoemsCachedOnly={myPoemsCachedOnly}
            onNavigate={handleNavigate}
            onEditPoem={handleEditPoem}
            onDeletePoem={deleteMyPoem}
            onNewPoem={() => { setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([]) }}
            navigateToPoem={navigateToPoem}
          />
        )}
        {bodyView === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onNavigate={handleNavigate}
            onClearFavorites={clearFavorites}
            focusFavorite={focusFavorite}
          />
        )}
        {bodyView === 'terms' && <TermsView onNavigate={handleNavigate} />}
        {bodyView === 'privacy' && <PrivacyView onNavigate={handleNavigate} />}
        {bodyView === 'about' && <AboutView onNavigate={handleNavigate} />}
        {bodyView === 'categories' && (
          <CategoriesView
            categories={uniqueCategories.map((name) => ({
              name,
              count: filteredPoems.length > 0 ? filteredPoems.filter((p) => (p.categories || []).includes(name)).length : 0,
            }))}
            onSelectCategory={handleSelectCategory}
            onNavigate={handleNavigate}
          />
        )}
        {bodyView === 'category-poems' && (
          <CategoryPoemsView
            category={selectedCategory}
            poems={categoryPoems}
            onNavigate={handleNavigate}
            navigateToPoem={navigateToPoem}
          />
        )}
        {bodyView === 'shelf' && <ShelfView onNavigate={handleNavigate} />}
        {bodyView === 'blend' && (
          <BlendView
            onNavigate={handleNavigate}
            focusQuery={blendFocus}
            onOpenAuth={() => { setAuthMode('login'); setSlideOpen(true) }}
          />
        )}
        {bodyView === 'inbox' && (
          <InboxView
            onNavigate={handleNavigate}
            openContact={chatContact}
            onOpenContact={setChatContact}
          />
        )}
        {bodyView === 'notifications' && <NotificationsView onNavigate={handleNavigate} />}
        {bodyView === 'settings' && <Settings onNavigate={handleNavigate} />}
        {bodyView === 'changelog' && <ChangelogView onNavigate={handleNavigate} />}
      </main>

      {/* Floating write button — only on dashboard */}
      {bodyView === 'dashboard' && (
        <button onClick={() => {
          if (user) {
            setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([])
          } else {
            setAuthMode('login'); setSlideOpen(true)
          }
        }}
          className="fixed bottom-6 right-6 z-30 w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'var(--tp-secondary)', color: 'white', borderRadius: 'var(--tp-btn-radius, 9999px)' }}
          aria-label="Write a poem">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
    </div>
  )
}
