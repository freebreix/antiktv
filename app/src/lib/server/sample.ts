import type { Channel, Program } from "$lib/types/antik";

export const sampleChannels: Channel[] = [
  { id: "1", name: "News HD", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id: "2", name: "Sport Max", url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" },
  { id: "3", name: "Movies+", url: "https://mochamaou.github.io/hlsjs-p2p-engine/demo/streaming/hls/test.m3u8" }
];

export function buildSamplePrograms(now = Date.now()): Program[] {
  return [
    { id: "p1", channelId: "1", title: "Morning News", start: now - 30*60*1000, end: now + 30*60*1000 },
    { id: "p2", channelId: "1", title: "Noon Update", start: now + 30*60*1000, end: now + 90*60*1000 },
    { id: "p3", channelId: "2", title: "Live Match", start: now - 10*60*1000, end: now + 80*60*1000 },
    { id: "p4", channelId: "3", title: "Blockbuster", start: now - 60*60*1000, end: now + 60*60*1000 }
  ];
}
