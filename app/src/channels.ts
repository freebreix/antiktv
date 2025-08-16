import type { Channel } from './types'

const LS_KEY = 'antiktv.channels'

export async function loadChannels(): Promise<Channel[]> {
  const cached = localStorage.getItem(LS_KEY)
  if (cached) {
    try { return JSON.parse(cached) as Channel[] } catch {}
  }
  const cfg = await (await fetch('config.json')).json()
  const channels = cfg.channels as Channel[]
  localStorage.setItem(LS_KEY, JSON.stringify(channels))
  return channels
}

export function setChannels(channels: Channel[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(channels))
}
