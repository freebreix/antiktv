import type { Channel, EpgIndex, EpgProgramme } from './types'

const EPG_LS = 'antiktv.epg'
const REFRESH_MIN = 15

export async function loadEpg(channels: Channel[], refreshMinutes = REFRESH_MIN): Promise<EpgIndex> {
  const now = Date.now()
  const cached = localStorage.getItem(EPG_LS)
  if (cached) {
    try {
      const idx = JSON.parse(cached) as EpgIndex
      if (now - idx.generatedAt < refreshMinutes * 60_000) return idx
    } catch {}
  }
  // Load config
  const cfg = await (await fetch('config.json')).json()
  let programmes: EpgProgramme[] = []
  if (cfg.epg.type === 'xmltv' && cfg.epg.xmltvUrl) {
    programmes = await fetchXmltv(cfg.epg.xmltvUrl, channels)
  } else if (cfg.epg.type === 'json' && cfg.epg.jsonUrl) {
    programmes = await fetchJsonEpg(cfg.epg.jsonUrl)
  }
  const idx: EpgIndex = { channels, programmes, generatedAt: now }
  localStorage.setItem(EPG_LS, JSON.stringify(idx))
  return idx
}

async function fetchXmltv(url: string, channels: Channel[]): Promise<EpgProgramme[]> {
  const res = await fetch(url)
  const text = await res.text()
  // Minimal XMLTV parser (quick and dirty for embedded usage)
  // Expect lines with: <programme start="YYYYMMDDHHmmss +ZZZZ" stop="..." channel="id"><title>..</title></programme>
  const progs: EpgProgramme[] = []
  const chByName = new Map(channels.map(c => [c.name, c]))
  const progRe = /<programme[^>]*start="(\d{14})\s*[+\-]\d{4}"[^>]*stop="(\d{14})\s*[+\-]\d{4}"[^>]*channel="([^"]+)"[^>]*>\s*<title[^>]*>([^<]+)<\/title>/g
  let m: RegExpExecArray | null
  while ((m = progRe.exec(text))) {
    const [_, s, e, ch, title] = m
    const chMeta = chByName.get(ch) || channels.find(c => String(c.id) === ch)
    if (!chMeta) continue
    const start = xmltvTimeToEpoch(s)
    const end = xmltvTimeToEpoch(e)
    if (end <= start) continue
    progs.push({ channelId: chMeta.id, title, start, end })
  }
  return progs
}

async function fetchJsonEpg(url: string): Promise<EpgProgramme[]> {
  const res = await fetch(url)
  const data = await res.json()
  // Expect array of { channelId, title, start, end }
  if (Array.isArray(data)) return data
  return []
}

function xmltvTimeToEpoch(s: string): number {
  const y = Number(s.slice(0,4))
  const mo = Number(s.slice(4,6)) - 1
  const d = Number(s.slice(6,8))
  const h = Number(s.slice(8,10))
  const mi = Number(s.slice(10,12))
  const se = Number(s.slice(12,14))
  return Date.UTC(y, mo, d, h, mi, se)
}

export function programmesNowNext(epg: EpgIndex, channelId: number): {now?: EpgProgramme, next?: EpgProgramme} {
  const t = Date.now()
  const list = epg.programmes.filter(p => p.channelId === channelId)
  let now: EpgProgramme | undefined
  let next: EpgProgramme | undefined
  for (const p of list) {
    if (p.start <= t && p.end > t) now = p
    if (!next && p.start > t) next = p
    if (now && next) break
  }
  return { now, next }
}
