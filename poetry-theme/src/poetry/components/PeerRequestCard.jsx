import { useMemo } from 'react'
import { formatDist } from '../views/nearbyBooks'
import { useLanguage } from '../../language/LanguageProvider'
import { translate } from '../../language/translator'

function peerState(inbox, me, bookTitle, holderUsername) {
  const req = (inbox || []).find((m) =>
    m.from === me && m.kind === 'request' &&
    m.bookTitle === bookTitle && m.to === holderUsername)
  if (!req) return 'idle'
  const resp = (inbox || []).find((m) =>
    m.requestId === req.requestId &&
    (m.kind === 'share_yes' || m.kind === 'share_no'))
  if (resp?.kind === 'share_yes') return 'accepted'
  if (resp?.kind === 'share_no') return 'declined'
  return 'awaiting'
}

export function isOngoingBlend(inbox, me, bookTitle) {
  const req = (inbox || []).find((m) =>
    m.from === me && m.kind === 'request' && m.bookTitle === bookTitle)
  if (!req) return false
  const resp = (inbox || []).find((m) =>
    m.requestId === req.requestId &&
    (m.kind === 'share_yes' || m.kind === 'share_no'))
  return resp?.kind !== 'share_no'
}

export function contactRevealed(inbox, me, contact) {
  const msgs = (inbox || []).filter((m) =>
    (m.from === me && m.to === contact) || (m.from === contact && m.to === me))
  return msgs.some((m) => m.kind === 'share_yes')
}

export function contactLabel(inbox, me, contact) {
  return contactRevealed(inbox, me, contact) ? contact : translate('common.anonymous')
}

function Arrow({ fromLeft, accepted }) {
  const color = accepted ? '#22c55e' : 'var(--tp-secondary)'
  return (
    <svg width="46" height="16" viewBox="0 0 46 16" className="flex-shrink-0">
      <line x1={fromLeft ? '2' : '44'} y1="8" x2={fromLeft ? '36' : '10'} y2="8"
        stroke={color} strokeWidth="2" strokeDasharray={accepted ? '' : '4 3'} />
      <polygon
        points={fromLeft ? '40,8 31,3 31,13' : '6,8 15,3 15,13'}
        fill={color} />
    </svg>
  )
}

function Avatar({ label, sub, initial, tone, size = 44 }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 72 }}>
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: size, height: size,
          backgroundColor: tone === 'green'
            ? 'color-mix(in srgb, #22c55e 18%, transparent)'
            : 'color-mix(in srgb, var(--tp-secondary) 18%, transparent)',
          color: tone === 'green' ? '#22c55e' : 'var(--tp-secondary)',
          border: '2px solid var(--tp-border)',
        }}>
        <span className="font-bold text-base">{initial}</span>
      </div>
      <p className="text-[10px] font-semibold mt-1.5 truncate max-w-full" style={{ color: 'var(--tp-text)' }}>{label}</p>
      {sub && <p className="text-[9px] truncate max-w-full" style={{ color: 'var(--tp-text-secondary)', opacity: 0.7 }}>{sub}</p>}
    </div>
  )
}

export default function PeerRequestCard({ book, user, inbox, onRequest, onOpenChat, showDistance = true }) {
  const { t } = useLanguage()
  const me = user?.username || ''
  const meInitial = (user?.name || user?.username || 'Y').trim().charAt(0).toUpperCase() || 'Y'

  const holder = useMemo(() => {
    const myReq = (inbox || []).find((m) =>
      m.from === me && m.kind === 'request' && m.bookTitle === book.title)
    if (myReq) {
      const match = (book.holders || []).find((x) => (x.h.holder_username || 'Reader') === myReq.to)
      if (match) return match
    }
    return (
      (book.holders || []).find((x) => !x.isSelf && x.h.availability === 'available') ||
      (book.holders || []).find((x) => !x.isSelf) ||
      null
    )
  }, [book, inbox, me])

  const holderName = holder?.h?.holder_username || 'Reader'
  const state = useMemo(() => peerState(inbox, me, book.title, holderName), [inbox, me, book.title, holderName])

  if (!holder) return null

  const accepted = state === 'accepted'
  const awaiting = state === 'awaiting'
  const declined = state === 'declined'
  const revealedName = holder.h.holder_name || holder.h.holder_username
  const rightInitial = accepted ? (revealedName || '?').trim().charAt(0).toUpperCase() : '?'

  return (
    <div className="rounded-2xl p-4 animate-fade-in transition-all"
      style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>

      {/* P2P row: You ⇄ Anonymous */}
      <div className="flex items-center justify-between">
        <Avatar label={t('common.you')} initial={meInitial} />

        <div className="flex-1 flex flex-col items-center px-2">
          {awaiting && (
            <>
              <Arrow fromLeft accepted={false} />
              <span className="text-[10px] mt-1 text-center font-medium" style={{ color: 'var(--tp-secondary)' }}>
                {t('peer.awaitingResponse')}
              </span>
            </>
          )}
          {accepted && (
            <>
              <Arrow fromLeft={false} accepted />
              <span className="text-[10px] mt-1 text-center font-medium" style={{ color: '#22c55e' }}>
                {t('peer.accepted')}
              </span>
              {onOpenChat && (
                <button
                  onClick={() => onOpenChat(holderName)}
                  className="mt-1.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ backgroundColor: 'var(--tp-secondary)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {t('peer.inbox')}
                </button>
              )}
            </>
          )}
          {!awaiting && !accepted && (
            <span className="text-[10px] text-center" style={{ color: 'var(--tp-text-secondary)', opacity: 0.5 }}>
              {declined ? t('peer.declined') : t('peer.readerNearby')}
            </span>
          )}
        </div>

        <Avatar
          label={accepted ? revealedName : t('common.anonymous')}
          initial={rightInitial}
          tone={accepted ? 'green' : undefined}
        />
      </div>

      {/* Book + action */}
      <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid var(--tp-border)' }}>
        <p className="text-sm font-bold truncate" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>
          {book.title}
        </p>
        {book.author && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--tp-secondary)' }}>{book.author}</p>}
        {showDistance && (
          <p className="text-[10px] mt-1" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>
            {holder.distanceKm !== null && holder.distanceKm !== undefined
              ? formatDist(holder.distanceKm)
              : t('peer.readerNearby')}
          </p>
        )}

        <div className="mt-3">
          {awaiting ? (
            <span className="inline-block px-5 py-2 rounded-xl text-xs font-semibold"
              style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)' }}>
              {t('peer.awaitingResponse')}
            </span>
          ) : accepted ? (
            <span className="inline-block px-5 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ backgroundColor: '#22c55e' }}>
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t('peer.accepted')}
              </span>
            </span>
          ) : declined ? (
            <span className="inline-block px-5 py-2 rounded-xl text-xs font-semibold"
              style={{ color: '#f87171', backgroundColor: 'color-mix(in srgb, #f87171 12%, transparent)' }}>
              {t('peer.declined')}
            </span>
          ) : (
            <button
              onClick={() => onRequest && onRequest(book, holder)}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--tp-secondary)' }}>
              {t('peer.request')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
