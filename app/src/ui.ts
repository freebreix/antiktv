import type { Channel, EpgIndex } from './types'
import { programmesNowNext } from './epg'

export function renderShell(root: HTMLElement) {
  root.innerHTML = `
  <div class="app">
    <div class="banner"></div>
    <div class="header">
      <div class="title">AntikTV</div>
      <div class="clock" id="clock"></div>
    </div>
    <div class="player">
      <video class="video" id="video" playsinline muted></video>
      <div class="osd" id="osd"></div>
      <div class="channel-list" id="channelList"></div>
      <div class="epg-grid" id="epg"></div>
    </div>
    <div class="footer">Use TV remote: <kbd>CH±</kbd> <kbd>0-9</kbd> <kbd>Back</kbd></div>
  </div>`
}

export function setClock() {
  const el = document.getElementById('clock')!
  const tick = () => {
    const d = new Date()
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  tick()
  setInterval(tick, 1000 * 30)
}

export function updateOsd(ch: Channel, epg?: EpgIndex) {
  const el = document.getElementById('osd')!
  let extra = ''
  if (epg) {
    const { now, next } = programmesNowNext(epg, ch.id)
    extra = ` — Now: ${now?.title || '—'}  Next: ${next?.title || '—'}`
  }
  el.textContent = `${ch.name}${extra}`
}

export function renderChannelList(channels: Channel[], activeId: number) {
  const el = document.getElementById('channelList')!
  el.innerHTML = channels.map(c => `<div class="channel ${c.id===activeId?'active':''}"><div>${c.id.toString().padStart(2,'0')}</div><div>${c.name}</div></div>`).join('')
}

export function showChannelList(show: boolean) {
  const el = document.getElementById('channelList')!
  el.classList.toggle('show', show)
}

export function renderEpgGrid(epg: EpgIndex) {
  const el = document.getElementById('epg')!
  const now = Date.now()
  const horizonMs = 2 * 60 * 60 * 1000
  const until = now + horizonMs
  const rows = epg.channels.map(ch => {
    const items = epg.programmes.filter(p => p.channelId === ch.id && p.end > now && p.start < until)
    const cells = items.map(p => `<div class="prg">${p.title}</div>`).join('')
    return `<div class="epg-row"><div class="ch">${ch.name}</div>${cells}</div>`
  }).join('')
  el.innerHTML = rows
}

export function showEpg(show: boolean) {
  const el = document.getElementById('epg')!
  el.classList.toggle('show', show)
}
