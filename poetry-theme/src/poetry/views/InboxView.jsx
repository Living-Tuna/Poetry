import { useState, useMemo, useEffect, useRef } from 'react'
import { useBook } from '../contexts/BookContext'
import { useAuth } from '../../auth/AuthContext'
import { contactLabel } from '../components/PeerRequestCard'

function fmtTime(ts) {
  try {
    return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function InboxView({ onNavigate, openContact, onOpenContact }) {
  const { inbox, markRead, sendMessage, respondToRequest, confirmReceived, addNotif } = useBook()
  const { user } = useAuth()
  const me = user?.username || ''
  const [replyMsg, setReplyMsg] = useState('')
  const [dismissedReceived, setDismissedReceived] = useState(() => new Set())
  const messagesEndRef = useRef(null)

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

  useEffect(() => {
    if (openConv && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [openContact, openConv?.messages.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const pendingRequest = useMemo(() => {
    if (!openConv) return null
    return openConv.messages.find((m) =>
      m.kind === 'request' && m.from !== me &&
      !openConv.messages.some((x) =>
        x.requestId === m.requestId && (x.kind === 'share_yes' || x.kind === 'share_no')))
  }, [openConv, me])

  const pendingReceived = useMemo(() => {
    if (!openConv) return null
    return openConv.messages.find((m) =>
      m.kind === 'share_yes' && m.from !== me &&
      !dismissedReceived.has(m.requestId) &&
      !openConv.messages.some((x) =>
        x.requestId === m.requestId && x.kind === 'received_yes'))
  }, [openConv, me, dismissedReceived])

  const msgAuthor = (requestId) => {
    const req = openConv?.messages.find((m) => m.requestId === requestId)
    return req?.author || ''
  }

  function handleSendReply() {
    if (!openConv || !replyMsg.trim()) return
    const thread = openConv.messages
    const bookTitle = thread[thread.length - 1]?.bookTitle || ''
    sendMessage(openConv.contact, bookTitle, replyMsg.trim())
    addNotif(`Reply sent to ${contactLabel(inbox, me, openConv.contact)}`)
    setReplyMsg('')
  }

  function handleShareDecision(agree) {
    if (!pendingRequest) return
    respondToRequest(openConv.contact, {
      requestId: pendingRequest.requestId,
      bookTitle: pendingRequest.bookTitle,
      author: pendingRequest.author,
      agree,
    })
    addNotif(agree
      ? `You agreed to share "${pendingRequest.bookTitle}" with ${contactLabel(inbox, me, openConv.contact)}`
      : `You declined sharing "${pendingRequest.bookTitle}"`)
  }

  function handleReceivedConfirm(received) {
    if (!pendingReceived) return
    if (received) {
      confirmReceived(openConv.contact, {
        requestId: pendingReceived.requestId,
        bookTitle: pendingReceived.bookTitle,
        author: msgAuthor(pendingReceived.requestId),
      })
      addNotif(`"${pendingReceived.bookTitle}" added to your shelf`)
    } else {
      setDismissedReceived((prev) => {
        const next = new Set(prev)
        next.add(pendingReceived.requestId)
        return next
      })
      sendMessage(openConv.contact, pendingReceived.bookTitle, 'Not yet received.')
      addNotif('Marked as not received yet')
    }
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
      <div className="h-full flex flex-col px-4 py-4 max-w-2xl mx-auto">
        <div className="flex-1 space-y-2 overflow-y-auto pb-3 animate-fade-in">
          {thread.map((m) => {
            const mine = m.from === me
            const kind = m.kind || 'chat'
            const isYes = kind === 'share_yes' || kind === 'received_yes'
            const label = kind === 'request' ? 'Book request'
              : kind === 'share_yes' ? (mine ? 'Shared' : 'Shared with you')
                : kind === 'share_no' ? 'Declined'
                  : kind === 'received_yes' ? (mine ? 'Received' : 'Exchange complete')
                    : m.bookTitle || ''
            const bubbleStyle = {
              backgroundColor: mine
                ? (isYes ? '#16a34a' : 'var(--tp-secondary)')
                : (isYes ? 'color-mix(in srgb, #22c55e 16%, transparent)' : 'var(--tp-surface)'),
              color: mine ? '#fff' : (isYes ? '#22c55e' : 'var(--tp-text)'),
              borderRadius: mine ? '1rem 1rem 0.125rem 1rem' : '1rem 1rem 1rem 0.125rem',
              border: isYes && !mine ? '1px solid color-mix(in srgb, #22c55e 40%, transparent)' : 'none',
            }
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${kind !== 'chat' ? 'animate-pop-in' : ''}`} style={bubbleStyle}>
                  {label && <p className="text-[10px] font-semibold mb-0.5" style={{ opacity: 0.75 }}>{label}</p>}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <p className="text-[10px] mt-1" style={{ opacity: 0.6 }}>{fmtTime(m.timestamp)}</p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {pendingRequest && (
          <div className="flex items-center gap-2 mb-3 p-3 rounded-xl animate-pop-in flex-shrink-0"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 10%, transparent)', border: '1px solid var(--tp-border)' }}>
            <span className="text-xs font-semibold flex-1" style={{ color: 'var(--tp-text-secondary)' }}>
              {contactLabel(inbox, me, openConv.contact)} wants to borrow "{pendingRequest.bookTitle}". Would you like to share?
            </span>
            <button onClick={() => handleShareDecision(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: '#22c55e' }}>Yes</button>
            <button onClick={() => handleShareDecision(false)}
              className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ color: '#f87171', backgroundColor: 'color-mix(in srgb, #f87171 15%, transparent)', border: '1px solid color-mix(in srgb, #f87171 40%, transparent)' }}>No</button>
          </div>
        )}

        {pendingReceived && (
          <div className="flex items-center gap-2 mb-3 p-3 rounded-xl animate-pop-in flex-shrink-0"
            style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)', border: '1px solid color-mix(in srgb, #22c55e 35%, transparent)' }}>
            <span className="text-xs font-semibold flex-1" style={{ color: 'var(--tp-text-secondary)' }}>
              {contactLabel(inbox, me, openConv.contact)} shared "{pendingReceived.bookTitle}" with you. Did you receive it?
            </span>
            <button onClick={() => handleReceivedConfirm(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: '#22c55e' }}>Yes</button>
            <button onClick={() => handleReceivedConfirm(false)}
              className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ color: 'var(--tp-text-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-text-secondary) 12%, transparent)', border: '1px solid var(--tp-border)' }}>Not yet</button>
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 flex-shrink-0" style={{ borderTop: '1px solid var(--tp-border)' }}>
          <input
            value={replyMsg}
            onChange={(e) => setReplyMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendReply() } }}
            placeholder="Message..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-colors"
            style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }} />
          <button onClick={handleSendReply} disabled={!replyMsg.trim()} aria-label="Send"
            className="p-2.5 rounded-full text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 flex-shrink-0"
            style={{ backgroundColor: 'var(--tp-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
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
              <div key={c.contact} onClick={() => onOpenContact(c.contact)}
                className="rounded-xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--tp-surface)', border: `1.5px solid ${unread ? 'var(--tp-secondary)' : 'var(--tp-border)'}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)' }}>{contactLabel(inbox, me, c.contact)}</p>
                      {unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--tp-secondary)' }} />}
                    </div>
                    {last.bookTitle && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--tp-secondary)' }}>{last.bookTitle}</p>
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
