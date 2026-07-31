export const SITE_NAME = 'poetree.in'
export const SHARE_PREFIX = 'Independent poetry on'
export function shareText() {
  return `${SHARE_PREFIX} ${SITE_NAME}`
}

export function isHistoricPoem(poem) {
  return Boolean(poem && !poem.user_id)
}

export function isIndependentPoem(poem) {
  return Boolean(poem && poem.user_id)
}
