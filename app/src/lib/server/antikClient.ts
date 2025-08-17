import type { Channel, Program } from '$lib/types/antik';
import { getAntikEnv, isAntikConfigured } from './env';

type AntikRegion = 'SK' | 'CZ';

function defaultBaseUrl(region: AntikRegion = 'SK') {
  return region === 'CZ' ? 'https://api-cz.webtv.tv/' : 'https://api.webtv.sk/';
}

function parseSetCookies(all: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!all) return out;
  // Extract specific cookies we care about
  const names = ['XSRF-TOKEN', 'webtvapi_session', 'webtv_cz_session'];
  for (const name of names) {
    const idx = all.indexOf(name + '=');
    if (idx !== -1) {
      const tail = all.slice(idx + name.length + 1);
      const val = tail.split(';')[0] ?? '';
      if (name === 'XSRF-TOKEN') {
        out[name] = val ? decodeURIComponent(val) : '';
      } else {
        // Keep raw for session cookies
        out[name] = val;
      }
    }
  }
  return out;
}

function cookiesHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('; ');
}

export class AntikClient {
  private baseUrl: string;
  private deviceId?: string;
  private cookies: Record<string, string> = {};
  private loggedIn = false;
  private triedAltRegion = false;
  private isRefreshingSession = false;
  public persistentDeviceId: string;

  constructor(opts?: { baseUrl?: string; deviceId?: string; region?: AntikRegion }) {
    const env = getAntikEnv();
    const region = opts?.region || env.region || 'SK';
    this.baseUrl = opts?.baseUrl || env.apiUrl || defaultBaseUrl(region);
    this.deviceId = opts?.deviceId || env.deviceId;
    // Use provided device ID, or fall back to persistent one if none provided
    this.persistentDeviceId = opts?.deviceId || this.getOrCreatePersistentDeviceId();
  }

  private getOrCreatePersistentDeviceId(): string {
    // Generate a consistent device ID that stays the same across requests
    const env = getAntikEnv();
    const seed = `antiktv-${env.email}-${this.baseUrl}`;
    
    // Simple hash function to create consistent device ID
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const deviceSuffix = Math.abs(hash).toString(36).padStart(10, '0').slice(-10);
    return `WebTV-antiktv-${deviceSuffix}`;
  }

  isConfigured() {
    return isAntikConfigured();
  }

  private async request(path: string, init?: RequestInit & { json?: any }): Promise<any> {
  const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0',
      'Accept': '*/*',
      'Content-type': 'application/json;charset=UTF-8'
    };
    
    // X-XSRF-TOKEN if present
    if (this.cookies['XSRF-TOKEN']) {
      // token may be quoted in cookie; strip quotes when sending header
      headers['x-xsrf-token'] = this.cookies['XSRF-TOKEN'].replace(/^"|"$/g, '');
    }
    // Cookie header
    if (Object.keys(this.cookies).length) headers['cookie'] = cookiesHeader(this.cookies);

    const body = init?.json !== undefined ? JSON.stringify(init.json) : init?.body;
    
    // Debug logging
    console.log(`🔧 API Request: ${init?.method || 'GET'} ${this.baseUrl + path}`);
    if (body) console.log(`🔧 Body:`, body);
    
  const res = await fetch(this.baseUrl + path, {
      method: init?.method || 'GET',
      headers,
      body
    });
    // capture cookies
    let combined: string[] = [];
    const anyHeaders: any = res.headers as any;
    const arr = anyHeaders.getSetCookie?.();
    if (Array.isArray(arr)) {
      combined = arr;
    } else {
      // Fallback: try different methods to get set-cookie headers
      if (typeof res.headers.entries === 'function') {
        for (const [k, v] of res.headers.entries()) {
          if (String(k).toLowerCase() === 'set-cookie') combined.push(v as string);
        }
      }
      if (combined.length === 0) {
        const single = res.headers.get('set-cookie');
        if (single) combined.push(single);
      }
    }
    const parsed = parseSetCookies(combined.length ? combined.join('\n') : null);
    this.cookies = { ...this.cookies, ...parsed };

    if (!res.ok) {
      // Try to parse error payload
      let err: any = undefined;
      try { err = await res.text(); } catch {}
      throw new Error(`Antik API ${path} failed: ${res.status} ${res.statusText} ${err ?? ''}`);
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return res.text();
  }

  private sessionCookieName(): string | null {
    if (this.cookies['webtvapi_session']) return 'webtvapi_session';
    if (this.cookies['webtv_cz_session']) return 'webtv_cz_session';
    return null;
  }

  async login(email?: string, password?: string): Promise<void> {
    if (this.loggedIn && this.sessionCookieName()) return;
    const env = getAntikEnv();
    const user = email || env.email;
    const pass = password || env.password;
    if (!user || !pass) throw new Error('Antik credentials missing');

    const attempt = async () => {
      // Reset cookies per attempt
      this.cookies = {};
      // Get CSRF cookie
      await this.request('sanctum/csrf-cookie');
      // Login
      await this.request('login', { method: 'POST', json: { login: user, password: pass } });
      if (!this.sessionCookieName() || !this.cookies['XSRF-TOKEN']) {
        throw new Error('Login failed: missing session or XSRF token');
      }
    };

    try {
      await attempt();
    } catch (e) {
      // Try alternate region base if none explicitly set and not yet tried
      const envHasBase = Boolean(env.apiUrl);
      if (!envHasBase && !this.triedAltRegion) {
        this.triedAltRegion = true;
        // Flip base URL
        this.baseUrl = this.baseUrl.includes('api.webtv.sk') ? defaultBaseUrl('CZ') : defaultBaseUrl('SK');
        await attempt();
      } else {
        throw e;
      }
    }
    this.loggedIn = true;
  }

  async getChannels(): Promise<Channel[]> {
    await this.login();
    
    const post = { type: 'TV', meta: { adult: true, promo: true } };
    console.log('🔧 Channels request payload:', post);
    
    const response = await this.request('channels', { method: 'POST', json: post });
    console.log('🔧 Channels response structure:', Object.keys(response || {}));
    
    const out: Channel[] = [];
    
    // Use the data structure
    if (response && response.data) {
      console.log('🔧 Using data structure');
      for (const key of Object.keys(response.data)) {
        const ch = response.data[key];
        const id = String(ch.id_content);
        out.push({
          id,
          name: ch.name,
          logo: ch.logo || undefined,
          url: '',
          number: Number(ch.id) || undefined,
          group: undefined
        });
      }
    } else {
      throw new Error('Unexpected channels response structure');
    }
    
    return out;
  }

  async getEpg(now = Date.now()): Promise<Program[]> {
    await this.login();
    const channels = await this.getChannels();
    if (!channels.length) return [];
    const date = new Date(now);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const body = { date: `${y}-${m}-${d}`, offset: 0, limit: 200, filter: channels.map(c => c.id), search: '' };
    const response = await this.request('epg/channels', { method: 'POST', json: body });
    const out: Program[] = [];
    if (Array.isArray(response)) {
      for (const channel of response) {
        const list = channel?.epg;
        if (Array.isArray(list)) {
          for (const item of list) {
            const start = Date.parse(item.Start);
            const end = Date.parse(item.Stop);
            out.push({
              id: String(item.SeriesID ?? `${item.Channel}-${item.Start}`),
              channelId: String(item.Channel),
              title: item.Title,
              description: item.Description,
              start,
              end
            });
          }
        }
      }
    }
    return out;
  }

  async getStreamUrl(channelId: string): Promise<string> {
    await this.login();
    const response = await this.request('channel/detail', { method: 'POST', json: { channel: channelId } });
    const streams = response?.data?.streams;
    if (Array.isArray(streams) && streams.length) {
      const s = streams[0];
      return typeof s?.url === 'string' ? s.url : '';
    }
    return '';
  }

  // Get cookies formatted for HTTP requests
  getCookieHeader(): string {
    return cookiesHeader(this.cookies);
  }
}

// Global singleton instance to maintain session state across requests
let globalAntikClient: AntikClient | null = null;

export function getGlobalAntikClient(deviceId?: string): AntikClient {
  if (!globalAntikClient) {
    globalAntikClient = new AntikClient({ deviceId });
  } else if (deviceId && globalAntikClient.persistentDeviceId !== deviceId) {
    // If device ID changed, create a new instance
    console.log('🔧 Device ID changed, creating new client instance');
    globalAntikClient = new AntikClient({ deviceId });
  }
  return globalAntikClient;
}
