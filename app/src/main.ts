import { PlayerController } from './player'
import { renderShell, setClock, updateOsd, renderChannelList, showChannelList, renderEpgGrid, showEpg } from './ui'
import { loadChannels } from './channels'
import { loadEpg } from './epg'
import type { Config } from './types'
import { attachInput } from './input'

async function loadConfig(): Promise<Config> {
  const res = await fetch('config.json')
  return await res.json()
}

async function bootstrap() {
  const root = document.getElementById('app-root')!
  renderShell(root)
  setClock()

  const video = document.getElementById('video') as HTMLVideoElement
  const player = new PlayerController(video)

  const cfg = await loadConfig()
  await player.init(cfg)

  let channels = await loadChannels()
  if (channels.length < 1) {
    const err = document.querySelector('.banner') as HTMLElement
    err.textContent = 'No channels configured. Edit /home/kiosk/app/config.json'
    err.classList.add('show')
    return
  }
  let epg = await loadEpg(channels, cfg.epg?.refreshMinutes ?? 20)

  let index = 0
  const playAt = async (i: number) => {
    index = (i + channels.length) % channels.length
    const ch = channels[index]
    await player.playChannel(ch)
    updateOsd(ch, epg)
    renderChannelList(channels, ch.id)
  }

  renderChannelList(channels, channels[0].id)
  renderEpgGrid(epg)
  await playAt(index)

  let listVisible = false
  let epgVisible = false

  attachInput(ev => {
    switch (ev.action) {
      case 'ch_plus': playAt(index + 1); listVisible = true; showChannelList(true); break
      case 'ch_minus': playAt(index - 1); listVisible = true; showChannelList(true); break
      case 'back': if (epgVisible) { epgVisible = false; showEpg(false); } else if (listVisible) { listVisible = false; showChannelList(false) } break
      case 'left': if (epgVisible) { /* time scroll TBD */ } break
      case 'right': if (epgVisible) { /* time scroll TBD */ } break
      case 'up': if (listVisible) playAt(index - 1); break
      case 'down': if (listVisible) playAt(index + 1); break
      case 'enter': if (!epgVisible && !listVisible) { listVisible = true; showChannelList(true) } else if (listVisible) { listVisible = false; showChannelList(false) } break
      case 'num': if (ev.value != null) { const idx = channels.findIndex(c => c.id === ev.value); if (idx >= 0) playAt(idx) } break
    }
  })

  // Periodically refresh EPG
  setInterval(async () => { epg = await loadEpg(channels, cfg.epg?.refreshMinutes ?? 20); renderEpgGrid(epg); updateOsd(channels[index], epg) }, (cfg.epg?.refreshMinutes ?? 20) * 60 * 1000)
}

bootstrap().catch(err => {
  const el = document.querySelector('.banner') as HTMLElement
  el.textContent = String(err)
  el.classList.add('show')
  console.error(err)
})
