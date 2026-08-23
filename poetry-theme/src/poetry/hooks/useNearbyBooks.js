import { useEffect, useState } from 'react'
import { fetchNearbyGroups } from '../views/nearbyBooks'

export function useNearbyBooks(user) {
  const [nearby, setNearby] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchNearbyGroups(user)
      .then((g) => { if (!cancelled) setNearby(g) })
      .catch(() => { if (!cancelled) setNearby([]) })
    return () => { cancelled = true }
  }, [user])

  return nearby
}
