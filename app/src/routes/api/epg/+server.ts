import type { RequestHandler } from "@sveltejs/kit";
import { getGlobalAntikClient } from "$lib/server/antikClient";
import { isAntikConfigured } from "$lib/server/env";

export const GET: RequestHandler = async ({ url, cookies }) => {
  const nowParam = url.searchParams.get("now");
  const now = nowParam ? Number(nowParam) : Date.now();
  const channelId = url.searchParams.get('channel');
  
  try {
    if (isAntikConfigured()) {
      // Get device ID from cookie
      const deviceId = cookies.get('device-id');
      const client = getGlobalAntikClient(deviceId);
      const programs = await client.getEpg(now);
      
      if (programs.length) {
        // Filter by channel if specified
        const filteredPrograms = channelId 
          ? programs.filter(program => program.channelId === channelId)
          : programs;
        
        return new Response(JSON.stringify({
          success: true,
          programs: filteredPrograms
        }), { headers: { "content-type": "application/json" } });
      }
    }
  } catch (e) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: String(e) 
    }), { status: 502 });
  }
  
  // If no real data available, return empty array
  return new Response(JSON.stringify({
    success: true,
    programs: []
  }), { headers: { "content-type": "application/json" } });
};
