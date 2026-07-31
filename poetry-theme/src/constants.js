export const SITE_NAME = 'poetree.in'
export const SHARE_PREFIX = 'Independent poetry on'

export const HERO_MISSION_TEXT =
  'From the verses of prehistoric and ancient times to the poems written tonight, we carry humanity\u2019s literature forward \u2014 and connect you with like-minded readers to share real books through Blend.'
export const HERO_SAFETY_NOTICE =
  'Stay safe: never share personal information, and always strictly follow the Privacy Policy.'
export function shareText() {
  return `${SHARE_PREFIX} ${SITE_NAME}`
}

export function isHistoricPoem(poem) {
  return Boolean(poem && !poem.user_id)
}

export function isIndependentPoem(poem) {
  return Boolean(poem && poem.user_id)
}
