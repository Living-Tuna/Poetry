import { COUNTRIES } from '../../constants/languages'
import { apiFetchAllShelfBooks } from '../../api/shelfBooks'

const geoCache = new Map()

export function countryCodeFor(name) {
  const target = String(name || '').trim().toLowerCase()
  if (!target) return ''
  return Object.entries(COUNTRIES).find(([, v]) => String(v.name || '').trim().toLowerCase() === target)?.[0] || ''
}

async function zippopotamGeo(code, zip) {
  const res = await fetch(`https://api.zippopotam.us/${code}/${zip}`)
  if (!res.ok) throw new Error('not found')
  const data = await res.json()
  const p = data?.places?.[0]
  if (!p) throw new Error('no place')
  return { lat: Number(p.latitude), lng: Number(p.longitude) }
}

async function nominatimGeo(code, zip) {
  const q = encodeURIComponent(`${zip} ${code}`)
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('not found')
  const data = await res.json()
  const hit = data?.[0]
  if (!hit) throw new Error('no result')
  return { lat: Number(hit.lat), lng: Number(hit.lon) }
}

async function geoFor(code, zip) {
  if (!code || !zip) return null
  const key = `${code}:${zip}`
  if (geoCache.has(key)) return geoCache.get(key)
  const sources = [() => zippopotamGeo(code, zip), () => nominatimGeo(code, zip)]
  for (const source of sources) {
    try {
      const g = await source()
      geoCache.set(key, g)
      return g
    } catch {}
  }
  geoCache.set(key, null)
  return null
}

function coords(lat, lng) {
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null
  return { lat: la, lng: ln }
}

function haversine(a, b) {
  const R = 6371
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

export function bearing(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const toDeg = (rad) => (rad * 180) / Math.PI
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const dLng = toRad(b.lng - a.lng)
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function formatDist(km) {
  if (km < 1) return 'less than a km away'
  if (km < 1000) return `~${Math.round(km)} km away`
  return `~${(km / 1000).toFixed(1).replace(/\.0$/, '')}k km away`
}

export function userLocation(user) {
  return {
    country: localStorage.getItem('poetry_country') || user?.country || '',
    state: localStorage.getItem('poetry_state') || user?.state || '',
    zip: localStorage.getItem('poetry_zip') || user?.zip || '',
    lat: localStorage.getItem('poetry_lat') || user?.lat || '',
    lng: localStorage.getItem('poetry_lng') || user?.lng || '',
  }
}

function holderSort(a, b) {
  if (a.isSelf !== b.isSelf) return a.isSelf ? 1 : -1
  const avail = (x) => (x.h.availability === 'available' ? 0 : 1)
  if (avail(a) !== avail(b)) return avail(a) - avail(b)
  if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm
  if (a.distanceKm !== null) return -1
  if (b.distanceKm !== null) return 1
  return 0
}

export function groupBooks(rows, user) {
  const groups = new Map()
  for (const r of rows || []) {
    const key = `${String(r.title || '').trim().toLowerCase()}||${String(r.author || '').trim().toLowerCase()}`
    if (!groups.has(key)) {
      groups.set(key, { title: r.title, author: r.author, subtitle: r.subtitle, summary: r.summary, holders: [] })
    }
    groups.get(key).holders.push({ h: r, distanceKm: null, isSelf: r.user_id === user?.id })
  }
  return [...groups.values()]
}

export async function addDistances(groups, user) {
  const req = userLocation(user)
  let reqGeo = coords(req.lat, req.lng)
  if (!reqGeo && req.country && req.zip) {
    reqGeo = await geoFor(countryCodeFor(req.country), req.zip)
  }
  for (const g of groups) {
    for (const item of g.holders) {
      if (item.isSelf || !reqGeo) continue
      const h = item.h
      let g2 = coords(h.holder_lat, h.holder_lng)
      if (!g2 && h.lat && h.lng) g2 = coords(h.lat, h.lng)
      if (!g2) {
        const country = h.holder_country || h.country
        const zip = h.holder_zip || h.zip
        if (country && zip) g2 = await geoFor(countryCodeFor(country), zip)
      }
      if (g2) {
        item.distanceKm = haversine(reqGeo, g2)
        item.lat = g2.lat
        item.lng = g2.lng
        item.bearingDeg = bearing(reqGeo, g2)
      }
    }
    g.holders.sort(holderSort)
  }
  return groups
}

export function nearestDist(g) {
  const nearest = g.holders.filter((x) => !x.isSelf && x.distanceKm !== null)
  return nearest.length ? Math.min(...nearest.map((x) => x.distanceKm)) : Infinity
}

export function bookVector(book) {
  const withLoc = book.holders.filter((x) => x.distanceKm !== null)
  if (!withLoc.length) return null
  const nearest = withLoc.reduce((a, b) => (a.distanceKm <= b.distanceKm ? a : b))
  return { bearingDeg: nearest.bearingDeg, distanceKm: nearest.distanceKm, holder: nearest }
}

export function nearestAvailableHolder(book) {
  return book.holders.find((x) => !x.isSelf && x.h.availability === 'available') || null
}

export async function fetchNearbyGroups(user) {
  const rows = await apiFetchAllShelfBooks()
  const groups = groupBooks(rows, user)
  await addDistances(groups, user)
  groups.sort((a, b) => nearestDist(a) - nearestDist(b))
  return groups
}
