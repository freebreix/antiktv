import type { RequestHandler } from '@sveltejs/kit';
import { AntikClient } from '$lib/server/antikClient';
import { isAntikConfigured } from '$lib/server/env';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('channelId');
  const requireReal = url.searchParams.get('real') === '1';
  if (!id) return new Response('Missing channelId', { status: 400 });
  try {
    if (isAntikConfigured()) {
      const client = new AntikClient();
      const streamUrl = await client.getStreamUrl(id);
      if (streamUrl) return new Response(JSON.stringify({ url: streamUrl }), { headers: { 'content-type': 'application/json' } });
    }
  } catch (_) {
    // fallthrough
  }
  if (requireReal) return new Response(JSON.stringify({ url: '' }), { headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify({ url: '' }), { headers: { 'content-type': 'application/json' } });
};
