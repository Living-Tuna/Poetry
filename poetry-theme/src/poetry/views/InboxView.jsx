import { useState } from 'react'
import { useBook } from '../contexts/BookContext'

export default function InboxView({ onNavigate }) {
  const { inbox, markRead, sendMessage, addNotif } = useBook()
  const [replyTo, setReplyTo] = useState(null)
  const [replyMsg, setReplyMsg] = useState('')

  function handleReply(msg) {
    if (!replyMsg.trim()) return
    sendMessage(msg.from, msg.bookTitle, replyMsg.trim())
    setReplyMsg('')
    setReplyTo(null)
    addNotif(`Reply sent to ${msg.from}`)
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
          Inbox
        </h2>
      </div>

      {inbox.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No messages yet.</p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
            Request a book through Blend to start a conversation.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {inbox.map((msg) => (
            <div key={msg.id} onClick={() => { markRead(msg.id) }}
              className="rounded-xl p-4 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'var(--tp-surface)',
                border: `1.5px solid ${msg.read ? 'var(--tp-border)' : 'var(--tp-secondary)'}`,
                opacity: msg.read ? 0.8 : 1,
              }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--tp-text)' }}>{msg.from}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--tp-secondary)' }} />}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--tp-secondary)' }}>Re: {msg.bookTitle}</p>
                  <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--tp-text-secondary)' }}>{msg.message}</p>
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--tp-text-secondary)', opacity: 0.6 }}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setReplyTo(replyTo === msg.id ? null : msg.id) }}
                  className="p-1.5 rounded-lg transition-all hover:scale-110 flex-shrink-0"
                  style={{ color: 'var(--tp-secondary)' }} aria-label="Reply">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>

              {replyTo === msg.id && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--tp-border)' }}>
                  <textarea value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors resize-none mb-2"
                    style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
                  <div className="flex gap-2">
                    <button onClick={() => { setReplyTo(null); setReplyMsg('') }}
                      className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all hover:opacity-70"
                      style={{ color: 'var(--tp-text-secondary)', border: '1.5px solid var(--tp-border)' }}>Cancel</button>
                    <button onClick={() => handleReply(msg)}
                      className="flex-1 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--tp-secondary)' }}>Send</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
