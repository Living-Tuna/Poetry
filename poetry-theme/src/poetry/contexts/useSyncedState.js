import { useEffect, useRef, useState } from 'react'
import { apiFetchUserData, apiSaveUserData } from '../../api/userdata'

function loadArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}

function saveArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr))
}

export function useSyncedState(userId, section, storageKey, enabled = true) {
  const [value, setValue] = useState([])
  const hydrated = useRef(false)

  useEffect(() => {
    if (!enabled || !userId) {
      hydrated.current = false
      setValue([])
      return
    }
    let cancelled = false
    setValue(loadArray(storageKey))
    apiFetchUserData(userId)
      .then((row) => {
        if (cancelled) return
        const server = Array.isArray(row?.[section]) ? row[section] : []
        if (server.length > 0) {
          setValue(server)
          saveArray(storageKey, server)
        } else {
          const local = loadArray(storageKey)
          if (local.length > 0) apiSaveUserData(userId, { [section]: local }).catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) hydrated.current = true })
    return () => { cancelled = true }
  }, [userId, section, storageKey, enabled])

  useEffect(() => {
    if (!enabled) return
    saveArray(storageKey, value)
  }, [value, storageKey, enabled])

  useEffect(() => {
    if (!enabled || !hydrated.current || !userId) return
    const t = setTimeout(() => {
      apiSaveUserData(userId, { [section]: value }).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [value, enabled, userId, section])

  return [value, setValue]
}
