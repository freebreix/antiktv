import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getGlobalAntikClient } from '$lib/server/antikClient';

// In-memory cache for screenshots
const screenshotCache = new Map<string, string>();

export const GET: RequestHandler = async ({ url }) => {
  try {
    const channelId = url.searchParams.get('channel');
    
    if (!channelId) {
      return json({
        success: false,
        error: 'Channel ID is required'
      }, { status: 400 });
    }
    
    // Check if we have a cached screenshot
    if (screenshotCache.has(channelId)) {
      return json({
        success: true,
        screenshot: screenshotCache.get(channelId),
        channel: channelId,
        cached: true
      });
    }
    
    console.log('📸 Screenshot API - Generating screenshot for channel:', channelId);
    
    // For now, we'll generate a placeholder screenshot URL
    // In a real implementation, this would capture actual video frames
    const screenshot = await generateChannelScreenshot(channelId);
    
    // Cache the screenshot
    screenshotCache.set(channelId, screenshot);
    
    console.log('📸 Screenshot API - Success for channel:', channelId);
    
    return json({
      success: true,
      screenshot: screenshot,
      channel: channelId,
      cached: false
    });
    
  } catch (error) {
    console.error('📸 Screenshot API - Error:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      screenshot: null
    }, { status: 500 });
  }
};

async function generateChannelScreenshot(channelId: string): Promise<string> {
  // For now, we'll create placeholder screenshots based on channel
  // In a real implementation, this would:
  // 1. Get the stream URL for the channel
  // 2. Use FFmpeg or similar to capture a frame
  // 3. Save it as a static image
  // 4. Return the URL to that image
  
  // Generate a placeholder screenshot using a service like picsum with channel-specific seed
  const seed = channelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed}/1920/1080`;
}

// Endpoint to generate all screenshots at once
export const POST: RequestHandler = async ({ request }) => {
  try {
    console.log('📸 Screenshot API - Generating all channel screenshots');
    
    const deviceId = request.headers.get('X-Device-ID');
    console.log('📸 Screenshot API - Device ID from header:', deviceId);
    
    const client = getGlobalAntikClient(deviceId || undefined);
    const channels = await client.getChannels();
    
    const screenshots: Record<string, string> = {};
    
    // Generate screenshots for all channels
    for (const channel of channels) {
      if (!screenshotCache.has(channel.id)) {
        const screenshot = await generateChannelScreenshot(channel.id);
        screenshotCache.set(channel.id, screenshot);
      }
      screenshots[channel.id] = screenshotCache.get(channel.id)!;
    }
    
    console.log('📸 Screenshot API - Generated screenshots for', Object.keys(screenshots).length, 'channels');
    
    return json({
      success: true,
      screenshots: screenshots,
      count: Object.keys(screenshots).length
    });
    
  } catch (error) {
    console.error('📸 Screenshot API - Error generating all screenshots:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      screenshots: {}
    }, { status: 500 });
  }
};
