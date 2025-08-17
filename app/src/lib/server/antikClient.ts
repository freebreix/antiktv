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
    
    console.log('🔧 AntikClient created with:');
    console.log('🔧 - baseUrl:', this.baseUrl);
    console.log('🔧 - provided deviceId:', opts?.deviceId);
    console.log('🔧 - env deviceId:', env.deviceId);
    console.log('🔧 - final persistentDeviceId:', this.persistentDeviceId);
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
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
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
        console.log(`🔧 API Request: ${init?.method || 'GET'} ${this.baseUrl + path} (attempt ${attempt}/${maxRetries})`);
        if (body) console.log(`🔧 Body:`, body);
        
        const res = await fetch(this.baseUrl + path, {
          method: init?.method || 'GET',
          headers,
          body
        });
        
        // Handle 502 Bad Gateway - retry if not the last attempt
        if (res.status === 502 && attempt < maxRetries) {
          console.warn(`🔧 Received 502 Bad Gateway, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue; // Retry the request
        }
        
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
      } catch (error) {
        // If it's the last attempt or not a retry-able error, throw
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Check if the error is worth retrying (network errors, timeouts)
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isRetryableError = errorMessage.includes('fetch') || 
                               errorMessage.includes('network') || 
                               errorMessage.includes('timeout') ||
                               errorMessage.includes('ECONNRESET') ||
                               errorMessage.includes('ETIMEDOUT');
        
        if (isRetryableError) {
          console.warn(`🔧 Network error on attempt ${attempt}/${maxRetries}, retrying in ${retryDelay}ms:`, errorMessage);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue; // Retry the request
        } else {
          // Non-retryable error, throw immediately
          throw error;
        }
      }
    }
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
      // Register device after successful login
      await this.registerDevice();
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

  private async registerDevice(): Promise<void> {
    try {
      console.log('🔧 Registering device with name:', this.persistentDeviceId);
      
      // Get current user info to get device_id
      const userResponse = await this.request('user', { method: 'GET' });
      if (!userResponse?.device_id) {
        throw new Error('Failed to get device_id from user endpoint');
      }
      const currentDeviceId = userResponse.device_id;
      console.log('🔧 Current device_id:', currentDeviceId);

      // Get list of existing devices
      const devices = await this.getDevices();
      console.log('🔧 Existing devices:', devices);

      // Find and delete any device with our desired name
      for (const [deviceId, deviceInfo] of Object.entries(devices)) {
        if (deviceInfo.name === this.persistentDeviceId) {
          console.log('🔧 Deleting existing device with same name:', deviceId);
          await this.deleteDevice(deviceId, deviceInfo.name);
        }
      }

      // Refresh devices list after deletion
      const updatedDevices = await this.getDevices();
      
      // Find our current device by public_id and rename it
      for (const [deviceId, deviceInfo] of Object.entries(updatedDevices)) {
        if (deviceInfo.public_id === currentDeviceId) {
          console.log('🔧 Renaming device', deviceId, 'to', this.persistentDeviceId);
          await this.request('changeDeviceName', {
            method: 'POST',
            json: {
              device_id: parseInt(deviceId),
              newName: this.persistentDeviceId
            }
          });
          return;
        }
      }
      
      console.warn('🔧 Could not find current device to rename');
    } catch (error) {
      console.error('🔧 Device registration failed:', error);
      // Don't throw - allow login to continue even if device registration fails
    }
  }

  private async getDevices(): Promise<Record<string, { name: string; public_id: string }>> {
    const response = await this.request('devices', { method: 'GET' });
    const devices: Record<string, { name: string; public_id: string }> = {};
    
    if (Array.isArray(response)) {
      for (const device of response) {
        if (device.id) {
          devices[device.id] = {
            name: device.name,
            public_id: device.public_id
          };
        }
      }
    }
    
    return devices;
  }

  private async deleteDevice(deviceId: string, deviceName: string): Promise<void> {
    const env = getAntikEnv();
    await this.request('removeDevice', {
      method: 'POST',
      json: {
        device_id: parseInt(deviceId),
        device_id_name: deviceName,
        password: env.password
      }
    });
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
    
    // Trim the first 11 channels
    const trimmedChannels = out.slice(11);
    console.log(`🔧 Trimmed first 11 channels, returning ${trimmedChannels.length}/${out.length} channels`);
    
    return trimmedChannels;
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
  // If no device ID is provided, reuse the existing client
  return globalAntikClient;
}
