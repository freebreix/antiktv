import type { RequestHandler } from "@sveltejs/kit";
import { buildSamplePrograms } from "$lib/server/sample";
import { getGlobalAntikClient } from "$lib/server/antikClient";
import { isAntikConfigured } from "$lib/server/env";

export const GET: RequestHandler = async ({ url }) => {
  const nowParam = url.searchParams.get("now");
  const now = nowParam ? Number(nowParam) : Date.now();
  const requireReal = url.searchParams.get('real') === '1';
  try {
    if (isAntikConfigured()) {
      const client = getGlobalAntikClient();
      const programs = await client.getEpg(now);
      if (programs.length) {
        return new Response(JSON.stringify(programs), { headers: { "content-type": "application/json" } });
      }
    }
  } catch (e) {
    if (requireReal) return new Response(JSON.stringify({ error: String(e) }), { status: 502 });
  }
  if (requireReal) return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
  const programs = buildSamplePrograms(now);
  return new Response(JSON.stringify(programs), { headers: { "content-type": "application/json" } });
};
