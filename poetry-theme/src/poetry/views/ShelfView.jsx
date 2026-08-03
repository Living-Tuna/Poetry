import { useState } from 'react'
import { useBook } from '../contexts/BookContext'
import { useLanguage } from '../../language/LanguageProvider'
import LegalLinks from '../components/LegalLinks'

export default function ShelfView({ onNavigate }) {
  const { shelf, addBook, removeBook, markSent, markReceived } = useBook()
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [pageCount, setPageCount] = useState('')
  const [author, setAuthor] = useState('')
  const [summary, setSummary] = useState('')
  const [trackingId, setTrackingId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    addBook({
      title: title.trim(),
      subtitle: subtitle.trim(),
      pageCount: pageCount.trim(),
      author: author.trim(),
      summary: summary.trim(),
    })
    setTitle(''); setSubtitle(''); setPageCount(''); setAuthor(''); setSummary('')
    setShowForm(false)
  }

  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')}
          className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
          style={{ color: 'var(--tp-text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
          {t('nav.shelf')}
        </h2>
      </div>

      <button onClick={() => setShowForm(!showForm)}
        className="mb-6 w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
        style={{ color: 'var(--tp-secondary)', border: '1.5px dashed var(--tp-border)' }}>
        {showForm ? t('common.cancel') : (shelf.length > 0 ? t('shelf.addAnother') : t('shelf.addBook'))}
      </button>

      {shelf.length === 0 && !showForm && (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>
            {t('shelf.empty')}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
            {t('shelf.emptySubtext')}
          </p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 w-14 h-14 mx-auto flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ backgroundColor: 'var(--tp-secondary)', color: 'white' }}
            aria-label={t('shelf.addBook')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-3 mb-6" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{t('shelf.addBook')}</h3>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('shelf.titlePlaceholder')} required
            className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors"
            style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder={t('shelf.subtitlePlaceholder')}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors"
            style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
          <div className="flex gap-3">
            <input value={pageCount} onChange={(e) => setPageCount(e.target.value)} placeholder={t('shelf.pageCountPlaceholder')} type="number"
              className="w-1/3 px-3 py-2 rounded-xl text-sm outline-none transition-colors"
              style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={t('shelf.authorPlaceholder')} required
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-colors"
              style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
          </div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder={t('shelf.summaryPlaceholder')} rows={3}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors resize-none"
            style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70"
              style={{ color: 'var(--tp-text-secondary)', border: '1.5px solid var(--tp-border)' }}>{t('common.cancel')}</button>
            <button type="submit"
              className="flex-1 py-2 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--tp-secondary)' }}>{t('shelf.addToShelf')}</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {shelf.map((book) => (
          <div key={book.id} className="rounded-xl p-4 transition-all duration-200"
            style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{book.title}</p>
                {book.subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>{book.subtitle}</p>}
                <p className="text-xs mt-1" style={{ color: 'var(--tp-secondary)' }}>{t('common.byAuthor', { author: book.author })}</p>
                {book.pageCount && <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>{t('shelf.pages', { count: book.pageCount })}</p>}
                {book.summary && <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>{book.summary}</p>}
              </div>
              <button onClick={() => setTrackingId(trackingId === book.id ? null : book.id)}
                className="p-1.5 rounded-lg transition-all hover:scale-110"
                style={{ color: 'var(--tp-secondary)' }} aria-label={t('shelf.trackExchange')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
            </div>

            {trackingId === book.id && (
              <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--tp-border)' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--tp-text)' }}>{t('shelf.trackExchange')}</p>
                {!book.sent ? (
                  <button onClick={() => markSent(book.id)}
                    className="w-full py-2 rounded-xl text-xs font-medium transition-all active:scale-[0.98]"
                    style={{ color: '#fff', backgroundColor: 'var(--tp-secondary)' }}>
                    {t('shelf.markAsSent')}
                  </button>
                ) : !book.received ? (
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#fbbf24' }}>{t('shelf.sentConfirm')}</p>
                    <div className="flex gap-2">
                      <button onClick={() => markSent(book.id)}
                        className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{ color: '#fff', backgroundColor: 'var(--tp-secondary)' }}>{t('shelf.yesSent')}</button>
                      <button onClick={() => {}}
                        className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{ color: 'var(--tp-text-secondary)', border: '1.5px solid var(--tp-border)' }}>{t('shelf.notYet')}</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#22c55e' }}>{t('shelf.sent')}</p>
                    {!book.received ? (
                      <div className="flex gap-2">
                        <button onClick={() => markReceived(book.id)}
                          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{ color: '#fff', backgroundColor: 'var(--tp-secondary)' }}>{t('shelf.yesReceived')}</button>
                        <button onClick={() => {}}
                          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{ color: 'var(--tp-text-secondary)', border: '1.5px solid var(--tp-border)' }}>{t('shelf.notYet')}</button>
                      </div>
                    ) : (
                      <p className="text-xs" style={{ color: '#22c55e' }}>{t('shelf.receivedComplete')}</p>
                    )}
                  </div>
                )}
                {book.sent && (
                  <button onClick={() => removeBook(book.id)}
                    className="w-full py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{ color: '#ef4444' }}>
                    {t('shelf.removeFromShelf')}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 pb-2 mt-6" style={{ borderTop: '1px solid var(--tp-border)' }}>
        <LegalLinks onNavigate={onNavigate} />
      </div>
    </div>
  )
}
