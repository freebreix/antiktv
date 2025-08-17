import type { ServerLoad } from '@sveltejs/kit';
import { getGlobalAntikClient } from '$lib/server/antikClient';

interface Channel {
  id: string;
  name: string;
  logo?: string;
  number?: number;
}

export const load: ServerLoad = async ({ cookies }) => {
  try {
    console.log('📡 Server-side page load - Loading channels and EPG');
    
    // Get device ID from cookie or create a new one
    let deviceId = cookies.get('device-id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      cookies.set('device-id', deviceId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: false,
        secure: false,
        sameSite: 'lax'
      });
    }
    
    console.log('📡 Server-side page load - Device ID:', deviceId);
    
    // Get Antik client and load channels
    const client = getGlobalAntikClient(deviceId);
    const rawChannels = await client.getChannels();
    
    console.log('📡 Server-side page load - Loaded', rawChannels.length, 'channels');
    
    // Load EPG data
    const epgData = await client.getEpg();
    console.log('📡 Server-side page load - Loaded', epgData.length, 'EPG programs');
    
    // Transform channels to our interface (without stream URLs for now)
    const channels: Channel[] = rawChannels.map((ch: any) => ({
      id: ch.channel || ch.id,
      name: ch.name,
      logo: ch.logo,
      number: ch.number
    }));
    
    console.log('📡 Server-side page load - Prepared', channels.length, 'channels for frontend');
    
    return {
      channels: channels,
      epg: epgData,
      deviceId: deviceId
    };
    
  } catch (error) {
    console.error('📡 Server-side page load - Error:', error);
    
    return {
      channels: [],
      epg: [],
      deviceId: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
