import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGlobalAntikClient } from '$lib/server/antikClient';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const channelId = url.searchParams.get('channel') || url.searchParams.get('channelId');
    
    if (!channelId) {
      return json({
        success: false,
        error: 'Channel ID is required'
      }, { status: 400 });
    }
    
    console.log('📡 Stream API - Starting request for channel:', channelId);
    
    // Use global client with environment device ID
    const client = getGlobalAntikClient();
    console.log('📡 Stream API - Using client with deviceId:', client.persistentDeviceId);
    
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
