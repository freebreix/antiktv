export type Arch = 'armhf' | 'aarch64'

export interface DrmConfig {
  licenseServer: string
  headers?: Record<string, string>
}

export interface Channel {
  id: number
  name: string
  logo?: string
  manifest: string
  drm?: DrmConfig
}

export interface EpgConfig {
  type: 'xmltv' | 'json'
  xmltvUrl?: string | null
  jsonUrl?: string | null
  refreshMinutes: number
}

export interface DefaultsConfig {
  audioLanguage?: string
  subtitleLanguage?: string
}

export interface Config {
  arch: Arch
  timezone: string
  widevine: { path?: string }
  channels: Channel[]
  epg: EpgConfig
  defaults: DefaultsConfig
}

export interface EpgProgramme {
  channelId: number
  title: string
  start: number // epoch ms
  end: number
  desc?: string
}

export interface EpgIndex {
  channels: Channel[]
  programmes: EpgProgramme[]
  generatedAt: number
}
