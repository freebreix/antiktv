import type { ServerLoad } from '@sveltejs/kit';
import { getGlobalAntikClient } from '$lib/server/antikClient';

interface Channel {
  id: string;
  name: string;
  logo?: string;
  number?: number;
}

export const load: ServerLoad = async () => {
  try {
    console.log('📡 Server-side page load - Loading channels and EPG');
    
    // Get Antik client (device ID from environment variable)
    const client = getGlobalAntikClient();
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
      epg: epgData
    };
    
  } catch (error) {
    console.error('📡 Server-side page load - Error:', error);
    
    return {
      channels: [],
      epg: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
