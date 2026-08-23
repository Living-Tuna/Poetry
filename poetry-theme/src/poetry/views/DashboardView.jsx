import { useLanguage } from '../../language/LanguageProvider'
import LegalLinks from '../components/LegalLinks'
import AnnouncementBanner from '../components/AnnouncementBanner'
import PoetryCard from '../PoetryCard'
import { BookIcon } from '../components/Icons'

import { useDashboardData, useNewsletter } from '../hooks/useDashboardData'
import { useNearbyBooks } from '../hooks/useNearbyBooks'

import WelcomeCard from '../components/dashboard/WelcomeCard'
import FavoriteCard from '../components/dashboard/FavoriteCard'
import StatsHero from '../components/dashboard/StatsHero'
import ActionCard from '../components/dashboard/ActionCard'
import NearbyBooks from '../components/dashboard/NearbyBooks'
import NewsletterCard from '../components/dashboard/NewsletterCard'
import RecentlyViewed from '../components/dashboard/RecentlyViewed'
import MyWritings from '../components/dashboard/MyWritings'
import TrendingPoems from '../components/dashboard/TrendingPoems'
import LatestPoems from '../components/dashboard/LatestPoems'

export default function DashboardView({
  user, slideOpen, setSlideOpen, setAuthMode, btnWhite,
  recentlyViewed, navigateToPoem,
  trending, trendingScroll, scrollTrending,
  latest, favoriteQuote, favorites,
  myPoems, myPoemsCachedOnly, onNavigate,
  onNewPoem, onOpenBlendBook,
}) {
  const { t } = useLanguage()
  const { stats, onlineCount, newsletterCount } = useDashboardData()
  const { email, setEmail, state: nlState, submit: nlSubmit } = useNewsletter()
  const nearby = useNearbyBooks(user)

  const hasFavorites = favorites && favorites.length > 0
  const handleSignUp = () => { setSlideOpen(true); setAuthMode('signup') }

  return (
    <div className="px-4 py-5 max-w-6xl mx-auto w-full space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:items-start md:gap-6">

      <div className="md:col-span-2"><AnnouncementBanner /></div>

      {user && favoriteQuote ? (
        <FavoriteCard favoriteQuote={favoriteQuote} favorites={favorites} hasFavorites={hasFavorites} />
      ) : !user ? (
        <WelcomeCard onSignUp={handleSignUp} />
      ) : null}

      <StatsHero user={user} stats={stats} onlineCount={onlineCount}
        newsletterCount={newsletterCount} setSlideOpen={setSlideOpen}
        setAuthMode={setAuthMode} btnWhite={btnWhite} />

      <ActionCard
        className="md:col-start-1"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>}
        title={t('dashboard.readyToShare')}
        subtitle={t('dashboard.updateBookshelf')}
        onClick={() => onNavigate('shelf')} />

      <NearbyBooks nearby={nearby} onNavigate={onNavigate} onOpenBlendBook={onOpenBlendBook} />

      <ActionCard
        className="md:col-start-1"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
        title={t('dashboard.needBook')}
        subtitle={t('dashboard.blendPromo')}
        onClick={() => onNavigate('blend')} />

      <NewsletterCard email={email} setEmail={setEmail} state={nlState} onSubmit={nlSubmit} />

      <RecentlyViewed items={recentlyViewed} navigateToPoem={navigateToPoem} />

      <MyWritings user={user} myPoems={myPoems} myPoemsCachedOnly={myPoemsCachedOnly}
        navigateToPoem={navigateToPoem} onNewPoem={onNewPoem} onNavigate={onNavigate} />

      <section className="animate-fade-in md:col-start-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
            <BookIcon size={16} /> {t('dashboard.startReading')}</h3>
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{t('dashboard.swipeToExplore')}</span>
        </div>
        <PoetryCard />
      </section>

      <TrendingPoems trending={trending} trendingScroll={trendingScroll}
        scrollTrending={scrollTrending} navigateToPoem={navigateToPoem} />

      <LatestPoems latest={latest} navigateToPoem={navigateToPoem} />

      <div className="pt-6 pb-2 md:col-span-2" style={{ borderTop: '1px solid var(--tp-border)' }}>
        <LegalLinks onNavigate={onNavigate} />
      </div>

      <div className="h-4 md:col-span-2" />
    </div>
  )
}
