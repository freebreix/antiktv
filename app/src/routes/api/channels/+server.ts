import type { RequestHandler } from "@sveltejs/kit";
import { sampleChannels } from "$lib/server/sample";
import { AntikClient } from "$lib/server/antikClient";
import { isAntikConfigured } from "$lib/server/env";

export const GET: RequestHandler = async ({ url }) => {
  const requireReal = url.searchParams.get('real') === '1';
  if (isAntikConfigured()) {
    try {
      const client = new AntikClient();
      const channels = await client.getChannels();
      if (channels.length) {
        return new Response(JSON.stringify(channels), { headers: { "content-type": "application/json" } });
      }
    } catch (e) {
      if (requireReal) return new Response(JSON.stringify({ error: String(e) }), { status: 502 });
    }
  }
  if (requireReal) return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
  return new Response(JSON.stringify(sampleChannels), { headers: { "content-type": "application/json" } });
};
