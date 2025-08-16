import shaka from 'shaka-player'
import type { Channel, Config } from './types'

export class PlayerController {
  private video: HTMLVideoElement
  private player: shaka.Player
  private cfg: Config | null = null

  constructor(video: HTMLVideoElement) {
    this.video = video
    this.player = new shaka.Player(video)
    this.player.addEventListener('error', e => {
      console.error('Shaka error', e)
    })
  window.addEventListener('online', () => this.onNetworkChange())
  window.addEventListener('offline', () => this.onNetworkChange())
  }

  async init(config: Config) {
    this.cfg = config
    shaka.polyfill.installAll()

    // EME check
    const ok = await canPlayWidevine()
    if (!ok) {
      showBanner('Widevine unavailable. Place libwidevinecdm.so and reboot.')
    }

    const prefersHevc = true
    this.player.configure({
      streaming: {
        retryParameters: { maxAttempts: 6, baseDelay: 500, backoffFactor: 2.0, fuzzFactor: 0.5 },
        rebufferingGoal: 1.0,
        bufferingGoal: 5.0,
      },
      drm: {
        servers: {},
        advanced: {},
      },
      manifest: {
        dash: { ignoreMinBufferTime: true }
      }
    })
  }

  async playChannel(ch: Channel) {
    if (!this.player) return
    const drm = ch.drm
    if (drm) {
      this.player.configure({ drm: { servers: { 'com.widevine.alpha': drm.licenseServer }, advanced: {} } })
      this.player.getNetworkingEngine()?.registerRequestFilter((type, req) => {
        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE && drm.headers) {
          for (const [k, v] of Object.entries(drm.headers)) {
            req.headers[k] = v
          }
        }
      })
    }
    await this.player.load(ch.manifest)
    await this.video.play().catch(() => {})
  }

  private onNetworkChange() {
    const el = document.querySelector('.banner') as HTMLElement | null
    if (!el) return
    if (navigator.onLine) {
      el.classList.remove('show')
    } else {
      el.textContent = 'Network offline — retrying…'
      el.classList.add('show')
    }
  }
}

export async function canPlayWidevine(): Promise<boolean> {
  const cfgs = [{
    initDataTypes: ['cenc'],
    audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
    videoCapabilities: [
      { contentType: 'video/mp4; codecs="avc1.64001F"' },
      { contentType: 'video/mp4; codecs="hev1.1.6.L93.B0"' },
    ]
  }]
  try {
    await navigator.requestMediaKeySystemAccess('com.widevine.alpha', cfgs)
    return true
  } catch {
    return false
  }
}

function showBanner(msg: string) {
  const el = document.querySelector('.banner') as HTMLElement | null
  if (!el) return
  el.textContent = msg
  el.classList.add('show')
}
