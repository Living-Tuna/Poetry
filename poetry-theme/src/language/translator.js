import { EN, LANGUAGE_PACKAGES } from '../constants/languagecode'

let currentLang = 'en'

export function setCurrentLang(code) {
  currentLang = code || 'en'
}

export function getCurrentLang() {
  return currentLang
}

/* Translate a key to the active language, falling back to English.
   `vars` values replace {placeholder} tokens in the string. */
export function translate(key, vars) {
  const pkg = LANGUAGE_PACKAGES[currentLang]
  let str = (pkg && pkg[key]) || EN[key]
  if (str == null) str = key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = String(str).split(`{${k}}`).join(String(v == null ? '' : v))
    }
  }
  return str
}
