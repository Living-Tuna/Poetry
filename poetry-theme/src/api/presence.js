import { supabase } from '../supabase/client'

const ONLINE_CHANNEL = 'poetry-online'

export function apiSubscribeOnlineCount(onCount) {
  const channel = supabase.channel(ONLINE_CHANNEL)

  channel.on('presence', { event: 'sync' }, () => {
    onCount(Object.keys(channel.presenceState()).length)
  })

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ onlineAt: new Date().toISOString() })
    }
  })

  return () => {
    channel.unsubscribe()
  }
}
