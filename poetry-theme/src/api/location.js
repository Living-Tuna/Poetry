import { COUNTRIES } from '../constants/languages'

function titleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function zippopotamState(countryCode, zip) {
  const res = await fetch(`https://api.zippopotam.us/${countryCode}/${zip}`)
  if (!res.ok) throw new Error('ZIP not found')
  const data = await res.json()
  const state = data?.places?.[0]?.state
  if (!state) throw new Error('No state returned')
  return state
}

async function indiaPincodeState(zip) {
  const res = await fetch(`https://aniket-thapa.github.io/india-pincode-api/pincodes/${zip}.json`)
  if (!res.ok) throw new Error('PIN not found')
  const data = await res.json()
  const state = data?.state
  if (!state) throw new Error('No state returned')
  return titleCase(state)
}

async function indiaPostalState(zip) {
  const target = `https://api.postalpincode.in/pincode/${zip}`
  const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`)
  if (!res.ok) throw new Error('PIN not found')
  const data = await res.json()
  const state = Array.isArray(data) && data[0]?.PostOffice?.[0]?.State
  if (!state) throw new Error('No state returned')
  return state
}

export async function apiFetchStateFromZip(countryCode, zip) {
  const sources = [() => zippopotamState(countryCode, zip)]
  if (countryCode === 'IN') sources.push(() => indiaPincodeState(zip), () => indiaPostalState(zip))
  let lastErr
  for (const source of sources) {
    try {
      return await source()
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr || new Error('No state returned')
}

function stateFromReverseGeocode(data) {
  const sub = data.principalSubdivision
  if (sub) return sub
  const countryCode = data.countryCode || ''
  const admin = data.localityInfo?.administrative || []
  const subDiv = admin.find((a) => a.isoCode && a.isoCode.startsWith(`${countryCode}-`))
  if (subDiv?.name) return subDiv.name
  return data.city || data.locality || ''
}

export function apiAutoDetectLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          if (!res.ok) throw new Error('Reverse geocode failed')
          const data = await res.json()
          const code = data.countryCode
          const country = (code && COUNTRIES[code]?.name) || data.countryName || ''
          const zip = data.postcode || ''
          let state = ''
          const digits = zip.replace(/\D/g, '')
          if (code && digits.length >= 3) {
            try {
              state = await apiFetchStateFromZip(code, digits)
            } catch {}
          }
          if (!state) state = stateFromReverseGeocode(data)
          resolve({ country, state, zip })
        } catch (err) {
          reject(err)
        }
      },
      () => reject(new Error('Location permission denied')),
      { timeout: 10000, maximumAge: 600000, enableHighAccuracy: false },
    )
  })
}
