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
import { contactLabel, contactRevealed } from './components/PeerRequestCard'
import { apiResolveUser } from '../api/messages'
import { apiAutoDetectLocation } from '../api/location'
import { supabase } from '../supabase/client'
import { useLanguage } from '../language/LanguageProvider'
import { applySeo, poemJsonLd, PAGE_SEO, poemUrl, slugify, SITE_URL } from '../seo/seo'

export default function PoetryDashboard() {
  const { t } = useLanguage()
  const { user, login, logout, signup, checkUsername,
          getUserSecurityQuestion, resetPassword } = useAuth()
  const {
    resetQueue, favorites, clearFavorites, fullscreen,
    openFullscreen, navigateToPoem, myPoems, addMyPoem, updateMyPoem, deleteMyPoem,
    editRequest, setEditRequest, recentlyViewed, allPoems, currentPoem,
    editOnOpen, setEditOnOpen, myPoemsCachedOnly,
    loading, reading, lang, changeLanguage,
  } = usePoetry()
  const { shelf, inbox, inboxUnread, unreadCount, notifs, addNotif } = useBook()
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false)
  const [chatContact, setChatContact] = useState(null)
  const [chatContactInfo, setChatContactInfo] = useState(null)
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
    : filteredPoems.length > 0
      ? (() => {
          const p = filteredPoems[Math.floor(Math.random() * filteredPoems.length)]
          const lines = (p.content || '').split('\n').filter(l => l.trim())
          return { sentenceText: lines[0] || p.title, poemTitle: p.title, author: p.author, date: p.created_at, key: `random-${p.id}` }
        })()
      : null
  const [bodyView, setBodyView] = useState('dashboard')
  const [slideOpen, setSlideOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [blendFocus, setBlendFocus] = useState(null)
  const [focusFavorite, setFocusFavorite] = useState(null)
  const [deepPoemId, setDeepPoemId] = useState(null)
  const locationAsked = useRef(false)
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
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

  const [authMode, setAuthMode] = useState('signup')
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
  const [aCountry, setACountry] = useState(localStorage.getItem('poetry_country') || '')
  const [aState, setAState] = useState(localStorage.getItem('poetry_state') || '')
  const [aZip, setAZip] = useState(localStorage.getItem('poetry_zip') || '')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo(0, 0)
  }, [bodyView])

  useEffect(() => {
    const seg = location.pathname.split('/')[1]
    const parts = location.pathname.split('/').filter(Boolean)
    window.scrollTo(0, 0)
    const knownLangs = new Set(Object.values(COUNTRIES).flatMap((c) => c.languages.map((l) => l.code)))
    knownLangs.add('en')
    if (seg && knownLangs.has(seg)) {
      changeLanguage(seg)
      setBodyView('dashboard')
    } else if (seg === 'poem') {
      const id = parts[1]
      if (id) {
        setDeepPoemId(decodeURIComponent(id))
        setBodyView('dashboard')
      } else {
        navigate(`/${localStorage.getItem('poetry_lang') || 'en'}`)
      }
    } else if (seg === 'blend') {
      setBodyView('blend')
      const q = new URLSearchParams(location.search).get('q')
      if (q && q.trim()) setBlendFocus({ q: q.trim(), n: Date.now() })
    } else if (seg === 'shelf') setBodyView('shelf')
    else if (seg === 'inbox') setBodyView('inbox')
    else if (seg === 'notifications') setBodyView('notifications')
    else if (seg === 'terms') setBodyView('terms')
    else if (seg === 'policy') setBodyView('privacy')
    else if (seg === 'about') setBodyView('about')
    else if (seg) navigate(`/${localStorage.getItem('poetry_lang') || 'en'}`)
  }, [location.pathname, location.search, navigate, changeLanguage])

  useEffect(() => {
    if (!deepPoemId || loading || !allPoems.length || fullscreen) return
    const poem =
      allPoems.find((p) => String(p.id) === deepPoemId) ||
      myPoems.find((p) => String(p.id) === deepPoemId)
    if (poem) {
      setDeepPoemId(null)
      navigateToPoem(poem)
    }
  }, [deepPoemId, allPoems, myPoems, loading, fullscreen, navigateToPoem])

  useEffect(() => {
    if (fullscreen && currentPoem) {
      applySeo({
        title: `${currentPoem.title} — ${currentPoem.author || 'Poem'} | Blendly`,
        description: String(currentPoem.content || '').split('\n')[0].slice(0, 160),
        canonical: poemUrl(currentPoem),
        jsonLd: poemJsonLd(currentPoem),
      })
    } else {
      const seo = PAGE_SEO[bodyView] || PAGE_SEO.dashboard
      applySeo({
        ...seo,
        canonical: bodyView === 'dashboard' ? `${SITE_URL}/${lang}` : `${SITE_URL}/${bodyView}`,
      })
    }
  }, [fullscreen, currentPoem, bodyView, lang])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  function handleLanguageSelect(code) {
    changeLanguage(code)
    navigate(`/${code}`)
    setLanguagePickerOpen(false)
  }

  const closeSlide = () => { setSlideOpen(false); setAuthMode('signup'); setAError(''); setSignupStep(0) }

  function openSignup() { setAuthMode('signup'); setAError(''); setSignupStep(0); setASuggestions([]); setAUsername(''); setAName(''); setAPassword(''); setARetype(''); setAQuestion(''); setAAnswer(''); setACountry(localStorage.getItem('poetry_country') || ''); setAState(localStorage.getItem('poetry_state') || ''); setAZip(localStorage.getItem('poetry_zip') || '') }
  function openLogin() { setAuthMode('login'); setAError('') }
  function openForgot() { setAuthMode('forgot'); setAError('') }

  async function handleLogin(e) {
    e?.preventDefault()
    setAError('')
    if (!aUsername.trim() || !aPassword) { setAError(t('auth.fillAllFields')); return }
    setABusy(true)
    const res = await login(aUsername.trim(), aPassword)
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else closeSlide()
  }

  async function handleSignupNext0() {
    setAError('')
    const u = aUsername.trim().toLowerCase()
    if (!u || u.length < 3) { setAError(t('auth.usernameMin3')); return }
    setABusy(true)
    const res = await checkUsername(u)
    setABusy(false)
    if (res.available === null) { setAError(t('auth.usernameCheckFail')); return }
    if (!res.available) { setAError(t('auth.usernameTaken')); setASuggestions(res.suggestions ?? []); return }
    setASuggestions([])
    setSignupStep(1)
  }

  async function handleSignup() {
    setAError('')
    if (!aQuestion.trim() || !aAnswer.trim()) { setAError(t('auth.fillSecurityQA')); return }
    const u = aUsername.trim().toLowerCase()
    setABusy(true)
    const res = await signup(u, aPassword, aName.trim(), aQuestion.trim(), aAnswer.trim(), aCountry, aState, aZip)
    setABusy(false)
    if (!res.ok) setAError(res.error)
    else {
      if (aCountry) localStorage.setItem('poetry_country', aCountry)
      if (aState) localStorage.setItem('poetry_state', aState)
      if (aZip) localStorage.setItem('poetry_zip', aZip)
      setAuthMode('login'); setAError(t('auth.accountCreated')); setAPassword(''); setAAnswer('')
    }
  }

  async function handleForgotLookup(e) {
    e?.preventDefault()
    setAError('')
    if (!aUsername.trim()) { setAError(t('auth.enterUsernameErr')); return }
    setABusy(true)
    const res = await getUserSecurityQuestion(aUsername.trim())
    setABusy(false)
    if (res.error || !res.question) { setAError(res.error || t('auth.usernameNotFound')); return }
    setASecurityQ(res.question)
    setAuthMode('forgot_reset')
  }

  async function handleForgotReset(e) {
    e?.preventDefault()
    setAError('')
    if (!aAnswer.trim()) { setAError(t('auth.answerTheSecurityQuestion')); return }
    if (!aNewPass || aNewPass.length < 6) { setAError(t('auth.passwordMin6')); return }
    setABusy(true)
    const res = await resetPassword(aUsername.trim(), aAnswer.trim(), aNewPass)
    setABusy(false)
    if (!res.ok) {
      if (res.error === 'PASSWORD_RESET_NEEDS_BACKEND') {
        setAError(t('auth.resetNeedsBackend'))
      } else {
        setAError(res.error)
      }
    } else { setAuthMode('login'); setAError(t('auth.resetSuccess')); setAPassword('') }
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
        author: user?.name || t('common.unknown'),
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

  function handleOpenPoem(poem) {
    if (!poem) return
    if (poem.id) navigate(`/poem/${encodeURIComponent(String(poem.id))}/${slugify(poem.title)}`)
    navigateToPoem(poem)
  }

  function handleOpenBlendBook(book) {
    setBlendFocus({ q: book?.title || '', n: Date.now(), book })
    setBodyView('blend')
  }

  useEffect(() => {
    if (!chatContact) { setChatContactInfo(null); return }
    let alive = true
    apiResolveUser(chatContact)
      .then((p) => { if (alive && p) setChatContactInfo({ name: p.name || '', username: p.username || chatContact }) })
      .catch(() => {})
    return () => { alive = false }
  }, [chatContact])

  const chatRevealed = contactRevealed(inbox, user?.username || '', chatContact)

  const seenMsgIds = useRef(new Set())
  const seenNotifIds = useRef(new Set())

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('poetry_inbox')) || []
      cached.forEach((m) => seenMsgIds.current.add(m.id))
    } catch {}
    try {
      const cached = JSON.parse(localStorage.getItem('poetry_notifs')) || []
      cached.forEach((n) => seenNotifIds.current.add(n.id))
    } catch {}
  }, [])

  useEffect(() => {
    const fresh = inbox.filter((m) => !seenMsgIds.current.has(m.id))
    if (fresh.length === 0) return
    fresh.forEach((m) => seenMsgIds.current.add(m.id))
    const incoming = fresh.find((m) => m.from !== user?.username && m.from && !m.read)
    if (!incoming) return
    const kind = incoming.kind || 'chat'
    const label = kind === 'request' ? t('notice.newBookRequest')
      : kind === 'share_yes' ? t('notice.bookShared')
        : kind === 'share_no' ? t('notice.shareDeclined')
          : kind === 'received_yes' ? t('notice.bookReceived')
            : t('notice.newMessage')
    const sender = contactLabel(inbox, user?.username || '', incoming.from)
    setNotice({
      text: t('notice.fromSender', { label, sender }) + (incoming.bookTitle ? ` · ${incoming.bookTitle}` : ''),
      action: () => { setChatContact(incoming.from); handleNavigate('inbox') },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inbox, user])

  useEffect(() => {
    const fresh = notifs.filter((n) => !seenNotifIds.current.has(n.id))
    if (fresh.length === 0) return
    fresh.forEach((x) => seenNotifIds.current.add(x.id))
    const n = fresh[0]
    if (n) setNotice({ text: n.text, action: () => handleNavigate('notifications') })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifs])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 3000)
    return () => clearTimeout(t)
  }, [notice])

  // Daily 8 AM saved-favorites reminder (once per day, only when favorites exist)
  useEffect(() => {
    let timer = null
    const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const fire = () => {
      const now = new Date()
      const key = `poetry_daily_fav_notif_${user?.id || 'guest'}`
      try {
        if (localStorage.getItem(key) === dateKey(now)) return
      } catch {}
      if (now.getHours() < 8 || favorites.length === 0) return
      try { localStorage.setItem(key, dateKey(now)) } catch {}
      const count = favorites.length
      const text = count === 1
        ? t('notifications.dailyFavoritesOne')
        : t('notifications.dailyFavoritesMany', { count })
      addNotif(text)
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(t('notifications.dailyFavoritesTitle'), { body: text })
        }
      } catch {}
    }

    const arm = () => {
      if (timer) clearTimeout(timer)
      const now = new Date()
      const next = new Date(now)
      next.setHours(8, 0, 0, 0)
      if (next <= now) next.setDate(next.getDate() + 1)
      timer = setTimeout(() => { fire(); arm() }, next.getTime() - now.getTime() + 1000)
    }

    fire()
    arm()
    const onVisible = () => { if (document.visibilityState === 'visible') fire() }
    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [favorites.length, user?.id, addNotif, t, lang])

  function handleNoticeClick() {
    const action = notice?.action
    setNotice(null)
    if (action) action()
  }

  useEffect(() => {
    if (locationAsked.current) return
    locationAsked.current = true
    const country = localStorage.getItem('poetry_country') || user?.country || ''
    const state = localStorage.getItem('poetry_state') || user?.state || ''
    const zip = localStorage.getItem('poetry_zip') || user?.zip || ''
    if (country && state && zip) return
    apiAutoDetectLocation()
      .then(async (loc) => {
        const detected = {
          country: loc.country || country,
          state: loc.state || state,
          zip: loc.zip || zip,
          lat: loc.lat ? String(loc.lat) : localStorage.getItem('poetry_lat') || '',
          lng: loc.lng ? String(loc.lng) : localStorage.getItem('poetry_lng') || '',
        }
        if (detected.country) localStorage.setItem('poetry_country', detected.country)
        if (detected.state) localStorage.setItem('poetry_state', detected.state)
        if (detected.zip) localStorage.setItem('poetry_zip', detected.zip)
        if (detected.lat) localStorage.setItem('poetry_lat', detected.lat)
        if (detected.lng) localStorage.setItem('poetry_lng', detected.lng)
        if (detected.country && detected.state && detected.zip && user) {
          try { await supabase.auth.updateUser({ data: detected }) } catch {}
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        allPoems={filteredPoems}
        onSearchSelect={handleOpenPoem}
        favorites={favorites}
        view={bodyView}
        onOpenBooks={(title) => { console.log('[Dashboard] onOpenBooks', title); setBlendFocus({ q: title || '', n: Date.now() }) }}
        onOpenFavorites={(fav) => { console.log('[Dashboard] onOpenFavorites', fav?.key); setFocusFavorite(fav || null); handleNavigate('favorites') }}
        chatContact={chatContact}
        chatName={chatContactInfo?.name}
        chatRevealed={chatRevealed}
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
            className="overflow-y-auto mx-auto"
            style={{
              backgroundColor: 'var(--tp-header-bg)',
              color: 'var(--tp-header-text)',
              maxHeight: '90vh',
              maxWidth: '28rem',
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
        open={menuOpen && !chatContact}
        onClose={() => setMenuOpen(false)}
        onSettings={() => { setMenuOpen(false); handleNavigate('settings') }}
        onWriteNow={() => { setShowWriteModal(true); setMenuOpen(false); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([]) }}
        onFavorites={() => { setMenuOpen(false); handleNavigate('favorites') }}
        onNavigate={handleNavigate}
        onCategories={() => { setMenuOpen(false); handleNavigate('categories') }}
        favoritesCount={favorites.length}
        categoryCount={uniqueCategories.length}
        user={user}
        inboxLatest={inbox[0] ? t('inbox.re', { title: inbox[0].bookTitle }) : t('nav.latestMessages')}
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
      <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--tp-bg)', paddingBottom: isMobile && bodyView === 'dashboard' ? 84 : 0 }}>
        {bodyView === 'dashboard' && (
          <DashboardView
            user={user} slideOpen={slideOpen} setSlideOpen={setSlideOpen}
            setAuthMode={setAuthMode} btnWhite={btnWhite}
            recentlyViewed={recentlyViewed.filter((p) => (p.language || 'en') === lang)} navigateToPoem={handleOpenPoem}
            trending={trending} trendingScroll={trendingScroll}
            scrollTrending={scrollTrending}
            latest={latest}
            favoriteQuote={randomFavorite}
            favorites={favorites}
            myPoems={myPoems} myPoemsCachedOnly={myPoemsCachedOnly}
            onNavigate={handleNavigate}
            onNewPoem={() => { setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([]) }}
            onOpenBlendBook={handleOpenBlendBook}
          />
        )}
        {bodyView === 'my-writings' && (
          <WritingsView
            myPoems={myPoems} myPoemsCachedOnly={myPoemsCachedOnly}
            onNavigate={handleNavigate}
            onEditPoem={handleEditPoem}
            onDeletePoem={deleteMyPoem}
            onNewPoem={() => { setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([]) }}
            navigateToPoem={handleOpenPoem}
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
            navigateToPoem={handleOpenPoem}
          />
        )}
        {bodyView === 'shelf' && <ShelfView onNavigate={handleNavigate} />}
        {bodyView === 'blend' && (
          <BlendView
            onNavigate={handleNavigate}
            focusQuery={blendFocus}
            onOpenAuth={() => { setAuthMode('signup'); setSlideOpen(true) }}
            onOpenChat={(contact) => { setMenuOpen(false); setChatContact(contact); handleNavigate('inbox') }}
          />
        )}
        {bodyView === 'inbox' && (
          <InboxView
            onNavigate={handleNavigate}
            openContact={chatContact}
            onOpenContact={(c) => { setMenuOpen(false); setChatContact(c) }}
          />
        )}
        {bodyView === 'notifications' && <NotificationsView onNavigate={handleNavigate} />}
        {bodyView === 'settings' && <Settings onNavigate={handleNavigate} />}
        {bodyView === 'changelog' && <ChangelogView onNavigate={handleNavigate} />}
      </main>

      {/* Bottom bar (mobile home) / floating write button (desktop) */}
      {isMobile && bodyView === 'dashboard' ? (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 flex items-end justify-around px-2"
          style={{
            backgroundColor: 'var(--tp-secondary)',
            paddingTop: 10,
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
            borderTopLeftRadius: '1.25rem',
            borderTopRightRadius: '1.25rem',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          }}>
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex-1 flex flex-col items-center gap-0.5 pt-1 transition-all active:scale-90"
            style={{ color: 'var(--tp-primary)' }}
            aria-label={t('nav.home')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[10px] font-medium">{t('nav.home')}</span>
          </button>

          <button
            onClick={() => { handleNavigate('dashboard'); resetQueue(); openFullscreen() }}
            className="flex-1 flex flex-col items-center gap-0.5 pt-1 transition-all active:scale-90"
            style={{ color: 'var(--tp-primary)' }}
            aria-label={t('nav.read')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="text-[10px] font-medium">{t('nav.read')}</span>
          </button>

          <button
            onClick={() => {
              if (user) {
                setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([])
              } else {
                setAuthMode('signup'); setSlideOpen(true)
              }
            }}
            className="-mt-5 w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-90"
            style={{ backgroundColor: 'var(--tp-primary)', color: 'var(--tp-secondary)', border: '4px solid var(--tp-secondary)' }}
            aria-label={t('nav.writeAPoem')}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          <button
            onClick={() => handleNavigate('favorites')}
            className="flex-1 flex flex-col items-center gap-0.5 pt-1 transition-all active:scale-90"
            style={{ color: 'var(--tp-primary)' }}
            aria-label={t('nav.favorites')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[10px] font-medium">{t('nav.favorites')}</span>
          </button>

          <button
            onClick={() => handleNavigate('blend')}
            className="flex-1 flex flex-col items-center gap-0.5 pt-1 transition-all active:scale-90"
            style={{ color: 'var(--tp-primary)' }}
            aria-label={t('nav.blend')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <span className="text-[10px] font-medium">{t('nav.blend')}</span>
          </button>
        </nav>
      ) : (
        bodyView === 'dashboard' && (
          <button onClick={() => {
            if (user) {
              setShowWriteModal(true); setEditingPoem(null); setWriteTitle(''); setWriteContent(''); setWriteCategories([])
            } else {
              setAuthMode('signup'); setSlideOpen(true)
            }
          }}
            className="fixed bottom-6 right-6 z-30 w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ backgroundColor: 'var(--tp-secondary)', color: 'white', borderRadius: 'var(--tp-btn-radius, 9999px)' }}
            aria-label={t('nav.writeAPoem')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )
      )}
    </div>
  )
}
