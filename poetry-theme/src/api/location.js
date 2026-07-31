import { COUNTRIES } from '../constants/languages'

export async function apiFetchStateFromZip(countryCode, zip) {
  const res = await fetch(`https://api.zippopotam.us/${countryCode}/${zip}`)
  if (!res.ok) throw new Error('ZIP not found')
  const data = await res.json()
  const state = data?.places?.[0]?.state
  if (!state) throw new Error('No state returned')
  return state
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
          resolve({ country, state: data.principalSubdivision || '' })
        } catch (err) {
          reject(err)
        }
      },
      () => reject(new Error('Location permission denied')),
      { timeout: 10000, maximumAge: 600000, enableHighAccuracy: false },
    )
  })
}
