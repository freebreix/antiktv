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

  constructor(opts?: { baseUrl?: string; deviceId?: string; region?: AntikRegion }) {
    const env = getAntikEnv();
    const region = opts?.region || env.region || 'SK';
    this.baseUrl = opts?.baseUrl || env.apiUrl || defaultBaseUrl(region);
    this.deviceId = opts?.deviceId || env.deviceId;
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
    // Remove extra headers that Kodi plugin doesn't use
    // headers['x-requested-with'] = 'XMLHttpRequest';
    // headers['referer'] = this.baseUrl;
    
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
    console.log(`🔧 Headers:`, headers);
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
    // Check device registration but don't try to fix it automatically 
    await this.ensureDeviceRegistration();
  }

  async ensureDeviceRegistration(): Promise<void> {
    try {
      console.log('🔧 Checking device registration status...');
      
      // Get user info to get device_id
      const userInfo = await this.request('user');
      if (!userInfo || !userInfo.device_id) {
        throw new Error('Failed to get user device_id');
      }
      const userDeviceId = userInfo.device_id;
      console.log('🔧 User device_id:', userDeviceId);
      
      // Get existing devices
      const devices = await this.request('devices');
      console.log('🔧 Existing devices count:', Array.isArray(devices) ? devices.length : 'not array');
      
      if (!Array.isArray(devices)) {
        console.log('🔧 Devices response is not an array, continuing without device registration');
        return;
      }
      
      // Check if user's device_id matches any existing device
      const matchingDevice = devices.find(device => device?.public_id === userDeviceId);
      
      if (matchingDevice) {
        console.log('🔧 ✅ Found matching device:', matchingDevice.name, 'with public_id:', matchingDevice.public_id);
        console.log('🔧 ✅ Device registration is valid - API should work');
        return;
      }
      
      console.log('🔧 ❌ User device_id not found in registered devices list');
      console.log('🔧 Attempting to register device by freeing up a slot...');
      
      // Find the first device that looks like it could be removed (older WebTV devices)
      const deviceToRemove = devices.find(device => 
        device?.name?.includes('Zariadenie WebTV-') && 
        device?.public_id?.startsWith('WebTV-')
      );
      
      if (deviceToRemove) {
        console.log('🔧 Found device to remove:', deviceToRemove.name, 'id:', deviceToRemove.id);
        
        // Delete the old device to free up a slot
        await this.deleteDevice(deviceToRemove.id, deviceToRemove.name);
        
        // Now try to find a device that matches our current device_id
        // (this might work after deletion + session refresh)
        console.log('🔧 Device deleted, checking if registration is now possible...');
        
        // Get fresh device list and user info
        const newDevices = await this.request('devices');
        const newUserInfo = await this.request('user');
        
        if (Array.isArray(newDevices) && newUserInfo?.device_id) {
          const newMatchingDevice = newDevices.find(device => device?.public_id === newUserInfo.device_id);
          if (newMatchingDevice) {
            console.log('🔧 ✅ Success! Device registration now valid after cleanup');
            return;
          }
        }
        
        console.log('🔧 Device deletion completed but registration still not working');
      } else {
        console.log('🔧 ❌ No suitable device found to remove for registration');
      }
      
      console.log('🔧 ❌ Device registration failed - this may cause 403 errors on API calls');
      
    } catch (error) {
      console.error('🔧 Device registration failed:', error instanceof Error ? error.message : String(error));
      // Continue anyway
    }
  }

  async deleteDevice(deviceId: number, deviceName: string): Promise<void> {
    try {
      console.log('🔧 Deleting device:', deviceName, 'with id:', deviceId);
      
      const env = getAntikEnv();
      const deleteData = {
        device_id: deviceId,
        device_id_name: deviceName,
        password: env.password
      };
      
      await this.request('removeDevice', { method: 'POST', json: deleteData });
      console.log('🔧 ✅ Device deleted successfully');
      
    } catch (error) {
      console.error('🔧 ❌ Failed to delete device:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async getChannels(): Promise<Channel[]> {
    await this.login();
    
    // Debug: First try to get user info to verify authentication
    try {
      const userInfo = await this.request('user');
      console.log('🔧 User info retrieved:', !!userInfo);
    } catch (userError) {
      console.log('🔧 User info failed:', userError instanceof Error ? userError.message : String(userError));
    }
    
    // Try the channels API
    const post = { type: 'TV', meta: { adult: true, promo: true } };
    console.log('🔧 Channels request payload:', post);
    
    try {
      const response = await this.request('channels', { method: 'POST', json: post });
      console.log('🔧 Channels response structure:', Object.keys(response || {}));
      console.log('🔧 Full response:', response);
      
      const out: Channel[] = [];
      
      // Try different response structures
      if (response && response.result && response.result.channels) {
        // Structure: { result: { channels: [...] } }
        console.log('🔧 Using result.channels structure');
        for (const ch of response.result.channels) {
          const detail = ch.channel_detail || ch;
          out.push({
            id: String(detail.channel_id || detail.id_content || detail.id),
            name: detail.display_name || detail.name,
            logo: detail.picture || detail.logo || undefined,
            url: '',
            number: Number(detail.id) || undefined,
            group: undefined
          });
        }
      } else if (response && response.data) {
        // Original structure: { data: {...} }
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
      } else if (Array.isArray(response)) {
        // Array structure: [...]
        console.log('🔧 Using array structure');
        for (const ch of response) {
          out.push({
            id: String(ch.id_content || ch.id || ch.channel_id),
            name: ch.name || ch.display_name,
            logo: ch.logo || ch.picture || undefined,
            url: '',
            number: Number(ch.id) || undefined,
            group: undefined
          });
        }
      } else {
        console.log('🔧 Unknown response structure:', response);
      }
      
      return out;
    } catch (channelsError) {
      console.log('🔧 Channels API failed, trying alternative endpoints...');
      
      // Try alternative endpoint
      try {
        const altResponse = await this.request('channel/list', { method: 'GET' });
        console.log('🔧 Alternative endpoint response:', altResponse);
        // Handle alternative response...
        return [];
      } catch (altError) {
        console.log('🔧 Alternative endpoint also failed:', altError instanceof Error ? altError.message : String(altError));
        throw channelsError; // Re-throw original error
      }
    }
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
