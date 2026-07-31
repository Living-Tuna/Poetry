import { useState } from 'react'
import { useBook } from '../contexts/BookContext'
import { useAuth } from '../../auth/AuthContext'

const BOOKS_DB = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084' },
  { title: '1984', author: 'George Orwell', isbn: '9780451524935' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769488' },
  { title: 'Animal Farm', author: 'George Orwell', isbn: '9780451526342' },
  { title: 'Lord of the Flies', author: 'William Golding', isbn: '9780399501487' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227' },
]

export default function BlendView({ onNavigate }) {
  const { shelf, sendMessage, addNotif } = useBook()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  function handleSearch() {
    if (!query.trim()) return
    const q = query.toLowerCase()
    const found = BOOKS_DB.filter((b) =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    )
    setResults(found)
  }

  function handleRequest(book) {
    if (!user) { addNotif('Sign in to request a book'); return }
    const holder = shelf.find((b) => b.title.toLowerCase() === book.title.toLowerCase())
    if (holder) {
      sendMessage(holder.author || 'Unknown', book.title, `I'd like to borrow "${book.title}". Is it available?`)
      addNotif(`Request sent to ${holder.author || 'the holder'} for "${book.title}"`)
    } else {
      sendMessage('nearby_reader', book.title, `I'm looking for "${book.title}". Do you have a copy?`)
      addNotif(`Looking for "${book.title}" — checking nearby readers...`)
    }
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
          Blend
        </h2>
      </div>

      <p className="text-xs mb-4" style={{ color: 'var(--tp-text-secondary)' }}>
        Find your book — discover nearby readers who have it.
      </p>

      <div className="flex gap-2 mb-6">
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter book name..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
          style={{ backgroundColor: 'var(--tp-surface)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
        <button onClick={handleSearch}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--tp-secondary)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>

      {results && results.length === 0 && (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No books found. Try a different name.</p>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--tp-text-secondary)' }}>
            {results.length} book{results.length > 1 ? 's' : ''} found
          </p>
          {results.map((book, i) => (
            <div key={i} className="rounded-xl p-4 transition-all duration-200"
              style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{book.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--tp-secondary)' }}>{book.author}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-text-secondary)' }}>ISBN: {book.isbn}</p>
                </div>
                <button onClick={() => handleRequest(book)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.98] whitespace-nowrap"
                  style={{ backgroundColor: 'var(--tp-secondary)' }}>
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
