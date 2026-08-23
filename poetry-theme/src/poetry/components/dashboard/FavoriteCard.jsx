import { useLanguage } from '../../../language/LanguageProvider'
import ShareQuoteModal from '../ShareQuoteModal'
import { HeartIcon } from '../Icons'

export default function FavoriteCard({ favoriteQuote, favorites, hasFavorites }) {
  const { t } = useLanguage()

  return (
    <section className="animate-fade-in md:col-start-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--tp-text)' }}>
          <HeartIcon size={16} /> {hasFavorites ? t('dashboard.favoriteLine') : t('dashboard.discoverCreate')}
        </p>
        {hasFavorites && favorites.length > 1 && (
          <span className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>{t('dashboard.swipeCard')}</span>
        )}
      </div>
      <ShareQuoteModal
        inline
        favorite={favoriteQuote}
        favorites={hasFavorites ? favorites : [favoriteQuote]}
        initialIndex={hasFavorites ? favorites.indexOf(favoriteQuote) : 0}
      />
    </section>
  )
}
