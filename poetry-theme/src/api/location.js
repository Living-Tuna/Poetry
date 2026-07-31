export async function apiFetchStateFromZip(countryCode, zip) {
  const res = await fetch(`https://api.zippopotam.us/${countryCode}/${zip}`)
  if (!res.ok) throw new Error('ZIP not found')
  const data = await res.json()
  const state = data?.places?.[0]?.state
  if (!state) throw new Error('No state returned')
  return state
}
