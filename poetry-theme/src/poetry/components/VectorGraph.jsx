import { useMemo } from 'react'
import { formatDist, bookVector } from '../views/nearbyBooks'
import { useLanguage } from '../../language/LanguageProvider'

const SIZE = 340
const CX = SIZE / 2
const CY = SIZE / 2
const R = 126

function polar(bearingDeg, dist, maxKm) {
  const rad = (bearingDeg * Math.PI) / 180
  const frac = Math.sqrt(Math.min(1, Math.max(0, dist / maxKm)))
  const r = Math.max(26, frac * R)
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) }
}

const MIN_GAP = 34
const MIN_R = 26
const MAX_R = R - 12

function spreadNodes(nodes, maxKm) {
  const pts = nodes.map((g) => polar(g.vector.bearingDeg, g.vector.distanceKm, maxKm))
  for (let iter = 0; iter < 80; iter++) {
    let moved = false
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        let dx = pts[j].x - pts[i].x
        let dy = pts[j].y - pts[i].y
        let d = Math.hypot(dx, dy)
        if (d === 0) { dx = 0.5; dy = 0.5; d = Math.hypot(dx, dy) }
        if (d < MIN_GAP) {
          const push = (MIN_GAP - d) / 2
          const nx = dx / d
          const ny = dy / d
          pts[i].x -= nx * push
          pts[i].y -= ny * push
          pts[j].x += nx * push
          pts[j].y += ny * push
          moved = true
        }
      }
    }
    for (const p of pts) {
      const dx = p.x - CX
      const dy = p.y - CY
      const dist = Math.hypot(dx, dy)
      if (dist > MAX_R) {
        p.x = CX + (dx / dist) * MAX_R
        p.y = CY + (dy / dist) * MAX_R
      } else if (dist < MIN_R) {
        const ang = Math.atan2(dy, dx)
        p.x = CX + MIN_R * Math.cos(ang)
        p.y = CY + MIN_R * Math.sin(ang)
      }
    }
    if (!moved) break
  }
  return pts
}

function truncate(s, n = 16) {
  if (!s) return ''
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

export default function VectorGraph({ groups = [], onSelect, note }) {
  const { t } = useLanguage()
  const { nodes, maxKm, hasUnknown } = useMemo(() => {
    const withVec = []
    for (const g of groups) {
      const v = bookVector(g)
      if (v) withVec.push({ ...g, vector: v })
    }
    const maxD = withVec.length ? Math.max(...withVec.map((x) => x.vector.distanceKm)) : 0
    const maxKm = Math.max(10, maxD)
    const pts = spreadNodes(withVec, maxKm)
    withVec.forEach((g, i) => {
      g.pos = pts[i]
    })
    return { nodes: withVec, maxKm, hasUnknown: withVec.length < groups.length }
  }, [groups])

  if (!nodes.length) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px dashed var(--tp-border)' }}>
        <p className="text-xs" style={{ color: 'var(--tp-text-secondary)' }}>
          {t('graph.noLocations')}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: 'var(--tp-card-shadow)' }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto select-none" style={{ display: 'block' }}>
        {[1 / 3, 2 / 3, 1].map((f) => (
          <circle key={f} cx={CX} cy={CY} r={f * R} fill="none" stroke="var(--tp-border)" strokeWidth="1" strokeDasharray={f === 1 ? '' : '3 4'} />
        ))}
        <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="var(--tp-border)" strokeWidth="1" />
        <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="var(--tp-border)" strokeWidth="1" />

        <text x={CX + R + 5} y={CY + 3} fontSize="7.5" fill="var(--tp-text-secondary)">~{Math.round(maxKm)} km</text>
        <text x={CX + (R * 2) / 3 + 5} y={CY + 3} fontSize="7" fill="var(--tp-text-secondary)" opacity="0.7">~{Math.round((maxKm * 2) / 3)}</text>
        <text x={CX + R / 3 + 5} y={CY + 3} fontSize="7" fill="var(--tp-text-secondary)" opacity="0.7">~{Math.round(maxKm / 3)}</text>

        <text x={CX} y={CY - R - 6} fontSize="9" fontWeight="bold" textAnchor="middle" fill="var(--tp-text-secondary)">N</text>
        <text x={CX} y={CY + R + 13} fontSize="9" fontWeight="bold" textAnchor="middle" fill="var(--tp-text-secondary)">S</text>
        <text x={CX + R + 13} y={CY + 3} fontSize="9" fontWeight="bold" textAnchor="middle" fill="var(--tp-text-secondary)">E</text>
        <text x={CX - R - 13} y={CY + 3} fontSize="9" fontWeight="bold" textAnchor="middle" fill="var(--tp-text-secondary)">W</text>

        {nodes.map((g, i) => {
          const p = g.pos
          const available = g.holders.some((x) => !x.isSelf && x.h.availability === 'available')
          const color = available ? 'var(--tp-secondary)' : '#f59e0b'
          return (
            <g key={i} onClick={() => onSelect && onSelect(g)} className="cursor-pointer">
              <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.45" />
              <circle cx={p.x} cy={p.y} r="10" fill={color} stroke="var(--tp-bg)" strokeWidth="1.5" />
              <text x={p.x + 14} y={p.y + 3} fontSize="8" fontWeight="bold" fill="var(--tp-text)"
                style={{ paintOrder: 'stroke' }} stroke="var(--tp-surface)" strokeWidth="3">
                {truncate(g.title)}
              </text>
              <text x={p.x} y={p.y + 19} fontSize="7" textAnchor="middle" fill="var(--tp-text-secondary)">
                {formatDist(g.vector.distanceKm)}
              </text>
            </g>
          )
        })}

        <circle cx={CX} cy={CY} r="15" fill="var(--tp-secondary)" opacity="0.15" />
        <circle cx={CX} cy={CY} r="7" fill="var(--tp-secondary)" />
        <text x={CX} y={CY - 22} fontSize="8" fontWeight="bold" textAnchor="middle" fill="var(--tp-text)">{t('graph.you')}</text>
      </svg>

      {hasUnknown && (
        <p className="text-[10px] mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>
          {t(groups.length - nodes.length > 1 ? 'graph.unmappedBooks' : 'graph.unmappedBook', { count: groups.length - nodes.length })}
        </p>
      )}
      {note && (
        <p className="text-[10px] mt-2" style={{ color: 'var(--tp-text-secondary)', opacity: 0.8 }}>{note}</p>
      )}
    </div>
  )
}
