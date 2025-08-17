import type { RequestHandler } from './$types';
import { AntikClient } from '$lib/server/antikClient';

// Simple rate limiting to prevent infinite loops
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW_MS = 5000; // 5 seconds
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(): boolean {
  const now = Date.now();
  // Clean old timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0]! < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  requestTimestamps.push(now);
  return false;
}

export const POST: RequestHandler = async ({ request }) => {
  // Check rate limiting first
  if (isRateLimited()) {
    console.warn('🔐 DRM Proxy: Rate limited - too many requests');
    return new Response('Too many DRM requests. Please wait.', {
      status: 429,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Retry-After': '5'
      }
    });
  }

  try {
    console.log('🔐 DRM Proxy: Received license request');
    
    // Check content-length first
    const contentLength = request.headers.get('content-length');
    console.log('🔐 DRM Proxy: Content-Length header:', contentLength);
    
    // Log the full request URL and method
    console.log('🔐 DRM Proxy: Request URL:', request.url);
    console.log('🔐 DRM Proxy: Request method:', request.method);
    
    // Get the raw license request data from the client
    let licenseRequest: ArrayBuffer;
    try {
      // Try different methods to read the body
      const clonedRequest = request.clone();
      const bodyText = await clonedRequest.text();
      console.log('🔐 DRM Proxy: Request body as text:', bodyText.substring(0, 100));
      
      licenseRequest = await request.arrayBuffer();
      console.log('🔐 DRM Proxy: License request size:', licenseRequest.byteLength, 'bytes');
      
      if (licenseRequest.byteLength > 0) {
        // Log first few bytes in hex for debugging
        const firstBytes = new Uint8Array(licenseRequest.slice(0, Math.min(20, licenseRequest.byteLength)));
        console.log('🔐 DRM Proxy: First bytes (hex):', Array.from(firstBytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
      }
    } catch (bodyError) {
      console.error('🔐 DRM Proxy: Failed to read request body:', bodyError);
      return new Response('Failed to read license request body', {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Check if we have a valid license request
    if (licenseRequest.byteLength === 0) {
      console.log('🔐 DRM Proxy: Empty license request body - this is likely a test/preflight request from dash.js');
      console.log('🔐 DRM Proxy: Content-Length was:', contentLength, 'but actual bytes read:', licenseRequest.byteLength);
      
      // For empty requests, just return success to indicate the endpoint is working
      // The real license request should come after this test
      return new Response('DRM proxy ready - waiting for license request', {
        status: 200,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain'
        }
      });
    }
    
    console.log('🔐 DRM Proxy: ✅ Received valid license request with', licenseRequest.byteLength, 'bytes');
    
    // Log request headers for debugging
    const requestHeaders = Object.fromEntries(request.headers.entries());
    console.log('🔐 DRM Proxy: Incoming headers:', requestHeaders);
    
    // Create client instance and ensure we're logged in
    const client = new AntikClient();
    await client.login();
    console.log('🔐 DRM Proxy: Authenticated with Antik API');
    
    // Get the cookie header for debugging
    const cookieHeader = client.getCookieHeader();
    console.log('🔐 DRM Proxy: Using cookies:', cookieHeader.substring(0, 100) + '...');
    
    // Forward the license request to the actual DRM server with proper authentication
    const drmHeaders = {
      'Content-Type': 'application/octet-stream',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Cookie': cookieHeader,
      'Referer': 'https://webtv.sk/',
      'Origin': 'https://webtv.sk',
      'Accept': 'application/octet-stream, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    };
    
    console.log('🔐 DRM Proxy: Sending request to DRM server with headers:', Object.keys(drmHeaders));
    
    const response = await fetch('https://drm.antik.sk/widevine/key', {
      method: 'POST',
      headers: drmHeaders,
      body: licenseRequest
    });
    
    console.log('🔐 DRM Proxy: License server response:', response.status, response.statusText);
    console.log('🔐 DRM Proxy: Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      // Try to get the error response body for debugging
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) {
        errorBody = 'Could not read response body';
      }
      console.error('🔐 DRM Proxy: License server error details:', errorBody);
      
      return new Response(`DRM license error: ${response.status} ${response.statusText}\nDetails: ${errorBody}`, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Get the license response
    const licenseResponse = await response.arrayBuffer();
    console.log('🔐 DRM Proxy: License response size:', licenseResponse.byteLength, 'bytes');
    
    // Return the license with proper CORS headers
    return new Response(licenseResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('🔐 DRM Proxy: Error:', error);
    return new Response(`DRM proxy error: ${error instanceof Error ? error.message : String(error)}`, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

// Handle preflight OPTIONS requests
export const OPTIONS: RequestHandler = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
