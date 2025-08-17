import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGlobalAntikClient } from '$lib/server/antikClient';

export const GET: RequestHandler = async ({ request }) => {
  try {
    console.log('📡 Channels API - Starting request');
    
    const deviceId = request.headers.get('X-Device-ID');
    console.log('📡 Channels API - Device ID from header:', deviceId);
    console.log('📡 Channels API - All headers:', Object.fromEntries(request.headers.entries()));
    
    const client = getGlobalAntikClient(deviceId || undefined);
    console.log('📡 Channels API - Using client with deviceId:', client.persistentDeviceId);
    
    const channels = await client.getChannels();
    
    console.log('📡 Channels API - Success:', channels.length, 'channels');
    
    return json({
      success: true,
      channels: channels
    });
    
  } catch (error) {
    console.error('📡 Channels API - Error:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      channels: []
    }, { status: 500 });
  }
};
