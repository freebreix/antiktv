import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGlobalAntikClient } from '$lib/server/antikClient';

export const GET: RequestHandler = async ({ url, request }) => {
  try {
    const channelId = url.searchParams.get('channel') || url.searchParams.get('channelId');
    
    if (!channelId) {
      return json({
        success: false,
        error: 'Channel ID is required'
      }, { status: 400 });
    }
    
    console.log('📡 Stream API - Starting request for channel:', channelId);
    
    const deviceId = request.headers.get('X-Device-ID');
    console.log('📡 Stream API - Device ID from header:', deviceId);
    
    const client = getGlobalAntikClient(deviceId || undefined);
    const streamUrl = await client.getStreamUrl(channelId);
    
    console.log('📡 Stream API - Success:', streamUrl);
    
    return json({
      success: true,
      streamUrl: streamUrl,
      channel: channelId
    });
    
  } catch (error) {
    console.error('📡 Stream API - Error:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      streamUrl: null
    }, { status: 500 });
  }
};
