import type { RequestHandler } from './$types';
import { getGlobalAntikClient } from '$lib/server/antikClient';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  try {
    console.log('🧪 Testing AntikClient...');
    
    // Debug: Check environment variables
    const { getAntikEnv } = await import('$lib/server/env');
    const env = getAntikEnv();
    console.log('Environment check:');
    console.log('- Email configured:', !!env.email);
    console.log('- Password configured:', !!env.password);
    console.log('- Device ID configured:', !!env.deviceId);
    console.log('- Region:', env.region || 'SK (default)');
    
    if (env.email) {
      console.log('- Email value:', env.email);
    }
    
    const client = getGlobalAntikClient();
    
    // Test 1: Configuration check
    const isConfigured = client.isConfigured();
    results.tests.push({
      name: 'Configuration Check',
      status: isConfigured ? 'PASS' : 'FAIL',
      result: isConfigured
    });

    if (!isConfigured) {
      return json({ 
        success: false, 
        error: 'AntikClient not configured. Check environment variables.',
        results 
      });
    }

    // Test 2: Login
    console.log('🔐 Testing login...');
    try {
      await client.login();
      
      // Debug: Check what cookies we have after login
      const cookies = (client as any).cookies || {};
      console.log('Cookies after login:', Object.keys(cookies));
      console.log('Session cookie:', (client as any).sessionCookieName?.() || 'none');
      console.log('XSRF token:', cookies['XSRF-TOKEN'] ? 'present' : 'missing');
      
      results.tests.push({
        name: 'Login',
        status: 'PASS',
        result: 'Login successful',
        debug: {
          cookies: Object.keys(cookies),
          sessionCookie: (client as any).sessionCookieName?.() || 'none',
          hasXsrfToken: !!cookies['XSRF-TOKEN']
        }
      });
    } catch (loginError: any) {
      console.error('❌ Login failed:', loginError.message);
      results.tests.push({
        name: 'Login',
        status: 'FAIL',
        result: loginError.message,
        error: {
          message: loginError.message,
          stack: loginError.stack?.split('\n').slice(0, 3)
        }
      });
      
      return json({
        success: false,
        error: `Login failed: ${loginError.message}`,
        hint: 'Check your ANTIK_EMAIL and ANTIK_PASSWORD in .env file. Make sure the account is active and not locked.',
        results
      });
    }

    // Test 3: Fetch channels
    console.log('📺 Testing channels...');
    try {
      const channels = await client.getChannels();
      results.tests.push({
        name: 'Get Channels',
        status: channels.length > 0 ? 'PASS' : 'FAIL',
        result: `Found ${channels.length} channels`,
        data: channels.slice(0, 3).map(c => ({ id: c.id, name: c.name }))
      });

      // Test 4: Fetch EPG if we have channels
      if (channels.length > 0) {
        console.log('📅 Testing EPG...');
        const firstChannel = channels[0]!;
        const epg = await client.getEpg();
        results.tests.push({
          name: 'Get EPG',
          status: epg.length >= 0 ? 'PASS' : 'FAIL',
          result: `Found ${epg.length} EPG entries`,
          data: epg.slice(0, 2).map(e => ({ 
            title: e.title, 
            start: e.start, 
            end: e.end 
          }))
        });

        // Test 5: Get stream URL
        console.log('🎬 Testing stream URL...');
        const streamUrl = await client.getStreamUrl(firstChannel.id);
        results.tests.push({
          name: 'Get Stream URL',
          status: streamUrl ? 'PASS' : 'WARN',
          result: streamUrl || 'No stream URL returned',
          data: streamUrl ? {
            url: streamUrl,
            type: streamUrl.includes('.m3u8') ? 'HLS' : streamUrl.includes('.mpd') ? 'DASH' : 'Unknown'
          } : null
        });

        // Test 6: Find and stream RTL channel
        console.log('📺 Testing RTL channel stream...');
        const rtlChannel = channels.find(channel => 
          channel.name.toLowerCase().startsWith('rtl')
        );
        
        if (rtlChannel) {
          console.log('🔍 Found RTL channel:', rtlChannel.name, 'with id:', rtlChannel.id);
          const rtlStreamUrl = await client.getStreamUrl(rtlChannel.id);
          results.tests.push({
            name: 'RTL Channel Stream',
            status: rtlStreamUrl ? 'PASS' : 'WARN',
            result: rtlStreamUrl ? `RTL stream URL obtained for ${rtlChannel.name}` : `RTL channel found (${rtlChannel.name}) but no stream URL`,
            data: {
              channel: {
                id: rtlChannel.id,
                name: rtlChannel.name,
                logo: rtlChannel.logo
              },
              stream: rtlStreamUrl ? {
                url: rtlStreamUrl,
                type: rtlStreamUrl.includes('.m3u8') ? 'HLS' : rtlStreamUrl.includes('.mpd') ? 'DASH' : 'Unknown'
              } : null
            }
          });
        } else {
          results.tests.push({
            name: 'RTL Channel Stream',
            status: 'WARN',
            result: 'No RTL channel found in channels list',
            data: {
              availableChannels: channels.slice(0, 10).map(c => c.name),
              searchedFor: 'channel name starting with "rtl" (case insensitive)'
            }
          });
        }
      }
    } catch (channelsError: any) {
      console.error('❌ Channels error:', channelsError.message);
      results.tests.push({
        name: 'Get Channels',
        status: 'FAIL',
        result: channelsError.message,
        error: {
          message: channelsError.message,
          stack: channelsError.stack?.split('\n').slice(0, 3)
        }
      });
      
      // If channels fail, we can't test the rest
      return json({
        success: false,
        error: `Channels API failed: ${channelsError.message}`,
        results
      });
    }

    const passedTests = results.tests.filter(t => t.status === 'PASS').length;
    const totalTests = results.tests.length;

    return json({
      success: true,
      summary: `${passedTests}/${totalTests} tests passed`,
      results
    });

  } catch (error: any) {
    console.error('❌ Test error:', error);
    
    results.tests.push({
      name: 'Error Handling',
      status: 'FAIL',
      result: error.message,
      error: {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5)
      }
    });

    return json({
      success: false,
      error: error.message,
      results
    }, { status: 500 });
  }
};
