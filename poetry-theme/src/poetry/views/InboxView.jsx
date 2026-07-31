import { useState, useMemo, useEffect } from 'react'
import { useBook } from '../contexts/BookContext'
import { useAuth } from '../../auth/AuthContext'

function fmtTime(ts) {
  try {
    return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function InboxView({ onNavigate }) {
  const { inbox, markRead, sendMessage, addNotif } = useBook()
  const { user } = useAuth()
  const me = user?.username || ''
  const [openContact, setOpenContact] = useState(null)
  const [replyMsg, setReplyMsg] = useState('')

  const conversations = useMemo(() => {
    const map = new Map()
    for (const msg of inbox || []) {
      const contact = msg.from === me ? msg.to : msg.from
      const key = String(contact || 'Unknown')
      if (!map.has(key)) map.set(key, { contact: key, messages: [] })
      map.get(key).messages.push(msg)
    }
    return [...map.values()]
      .map((c) => ({ ...c, messages: [...c.messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) }))
      .sort((a, b) => new Date(b.messages[b.messages.length - 1].timestamp) - new Date(a.messages[a.messages.length - 1].timestamp))
  }, [inbox, me])

  const openConv = conversations.find((c) => c.contact === openContact) || null

  useEffect(() => {
    if (openConv) {
      openConv.messages.forEach((m) => { if (!m.read) markRead(m.id) })
    }
  }, [openContact]) // eslint-disable-line react-hooks/exhaustive-deps

  const lastIncoming = openConv ? [...openConv.messages].reverse().find((m) => m.from !== me) : null
  const lastOutgoing = openConv ? [...openConv.messages].reverse().find((m) => m.from === me) : null
  const needsReply = !!lastIncoming && (!lastOutgoing || new Date(lastIncoming.timestamp) > new Date(lastOutgoing.timestamp))

  function handleSendReply() {
    if (!openConv || !replyMsg.trim()) return
    const thread = openConv.messages
    const bookTitle = thread[thread.length - 1]?.bookTitle || ''
    sendMessage(openConv.contact, bookTitle, replyMsg.trim())
    addNotif(`Reply sent to ${openConv.contact}`)
    setReplyMsg('')
  }

  function handleQuickReply(choice) {
    if (!openConv || !lastIncoming) return
    const bookTitle = lastIncoming.bookTitle || ''
    const text = choice === 'yes'
      ? `Yes, I'd be happy to share "${bookTitle}"!`
      : `Sorry, I can't share "${bookTitle}" right now.`
    sendMessage(openConv.contact, bookTitle, text)
    addNotif(`Reply sent to ${openConv.contact}`)
  }

  const header = (
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
  )

  if (openConv) {
    const thread = openConv.messages
    return (
      <div className="min-h-full flex flex-col px-4 py-6 max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setOpenContact(null)}
            className="p-1.5 rounded-xl transition-opacity hover:opacity-70"
            style={{ color: 'var(--tp-text-secondary)' }} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
              {openConv.contact}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--tp-text-secondary)' }}>{thread.length} message{thread.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pb-3">
          {thread.map((m) => {
            const mine = m.from === me
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%] rounded-xl px-3.5 py-2.5"
                  style={{
                    backgroundColor: mine ? 'var(--tp-secondary)' : 'var(--tp-surface)',
                    color: mine ? '#fff' : 'var(--tp-text)',
                    borderRadius: mine ? '1rem 1rem 0.125rem 1rem' : '1rem 1rem 1rem 0.125rem',
                  }}>
                  {m.bookTitle && (
                    <p className="text-[10px] font-semibold mb-0.5" style={{ opacity: 0.7 }}>Re: {m.bookTitle}</p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <p className="text-[10px] mt-1" style={{ opacity: 0.6 }}>{fmtTime(m.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {needsReply && (
          <div className="flex items-center gap-2 mb-3 p-3 rounded-xl"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 10%, transparent)', border: '1px solid var(--tp-border)' }}>
            <span className="text-xs font-semibold flex-1" style={{ color: 'var(--tp-text-secondary)' }}>
              Can you share this book?
            </span>
            <button onClick={() => handleQuickReply('yes')}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: '#22c55e' }}>Yes</button>
            <button onClick={() => handleQuickReply('no')}
              className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ color: '#f87171', backgroundColor: 'color-mix(in srgb, #f87171 15%, transparent)', border: '1px solid color-mix(in srgb, #f87171 40%, transparent)' }}>No</button>
          </div>
        )}

        <div className="flex items-end gap-2 pt-3" style={{ borderTop: '1px solid var(--tp-border)' }}>
          <textarea value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)}
            placeholder="Write a message..."
            rows={2}
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-colors resize-none"
            style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
          <button onClick={handleSendReply} disabled={!replyMsg.trim()}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-40"
            style={{ backgroundColor: 'var(--tp-secondary)' }}>Send</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-4 py-6 max-w-2xl mx-auto animate-fade-in">
      {header}

      {conversations.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tp-text-secondary)' }}>No conversations yet.</p>
          <p className="text-xs mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>
            Request a book through Blend to start a conversation.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => {
            const last = c.messages[c.messages.length - 1]
            const unread = c.messages.some((m) => !m.read)
            return (
              <div key={c.contact} onClick={() => setOpenContact(c.contact)}
                className="rounded-xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--tp-surface)', border: `1.5px solid ${unread ? 'var(--tp-secondary)' : 'var(--tp-border)'}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)' }}>{c.contact}</p>
                      {unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--tp-secondary)' }} />}
                    </div>
                    {last.bookTitle && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-secondary)' }}>Re: {last.bookTitle}</p>
                    )}
                    <p className="text-sm mt-1.5 leading-relaxed truncate" style={{ color: 'var(--tp-text-secondary)', opacity: last.from === me ? 0.6 : 1 }}>
                      {last.message}
                    </p>
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--tp-text-secondary)', opacity: 0.6 }}>
                    {fmtTime(last.timestamp)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
