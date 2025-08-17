// Simple test script to debug AntikClient using app environment
import { AntikClient } from './src/lib/server/antikClient.ts';
import { env } from './src/lib/server/env.ts';

async function testAntikClient() {
  console.log('Testing AntikClient with app environment...');
  console.log('Environment check:');
  console.log('- Email:', env.ANTIK_EMAIL ? '✓ configured' : '✗ missing');
  console.log('- Password:', env.ANTIK_PASSWORD ? '✓ configured' : '✗ missing');
  console.log('- Device ID:', env.ANTIK_DEVICE_ID ? '✓ configured' : '✗ missing');
  console.log('- Region:', env.ANTIK_REGION || 'SK (default)');
  
  const client = new AntikClient();

  console.log('Configuration check:', client.isConfigured());
  
  if (!client.isConfigured()) {
    console.error('❌ AntikClient not configured. Check your .env file.');
    return;
  }
  
  try {
    console.log('\n🔐 Attempting login...');
    await client.login();
    console.log('✅ Login successful');

    console.log('\n📺 Fetching channels...');
    const channels = await client.getChannels();
    console.log(`✅ Found ${channels.length} channels`);
    if (channels.length > 0) {
      console.log('First channel:', {
        id: channels[0].id,
        name: channels[0].name,
        logo: channels[0].logo
      });
    }

    if (channels.length > 0) {
      console.log('\n📅 Fetching EPG...');
      const epg = await client.getEpg([channels[0].id], new Date());
      console.log(`✅ Found ${epg.length} EPG entries for channel ${channels[0].name}`);
      if (epg.length > 0) {
        console.log('First EPG entry:', {
          title: epg[0].title,
          start: epg[0].start,
          end: epg[0].end,
          description: epg[0].description?.substring(0, 100) + '...'
        });
      }

      console.log('\n🎬 Getting stream URL...');
      const streamUrl = await client.getStreamUrl(channels[0].id);
      console.log('✅ Stream URL:', streamUrl || 'No stream URL');
      
      if (streamUrl) {
        console.log('Stream type:', streamUrl.includes('.m3u8') ? 'HLS' : streamUrl.includes('.mpd') ? 'DASH' : 'Unknown');
      }
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('403') || error.message.includes('Unauthorized')) {
      console.error('This looks like an authentication issue.');
      console.error('Check your credentials and make sure your Antik account is active.');
    }
    console.error('Full error:', error);
  }
}

console.log('AntikTV API Test');
console.log('================');
testAntikClient();
