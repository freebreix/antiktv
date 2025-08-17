<script lang="ts">
  import Hls from 'hls.js';
  let { url } = $props<{ url: string }>();
  let videoEl: HTMLVideoElement | null = null;
  let hls: Hls | null = null;

  $effect(() => {
    if (!videoEl) return;
    if (!url) return;
    // clean previous
    hls?.destroy();
    hls = null;

    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = url;
      videoEl.play().catch(() => {});
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl?.play().catch(() => {});
      });
    }

    return () => {
      hls?.destroy();
      hls = null;
    };
  });
</script>

<div class="w-full">
  <div class="aspect-video bg-black rounded-lg overflow-hidden">
    <video bind:this={videoEl} class="w-full h-full" controls playsInline>
      <track kind="captions" label="off" srcLang="en" default>
    </video>
  </div>
</div>
