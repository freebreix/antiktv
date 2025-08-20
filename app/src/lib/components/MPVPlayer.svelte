<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { mpvVideoService } from "$lib/client/mpvVideoService";

  interface Props {
    streamUrl?: string | null;
    autoplay?: boolean;
    onStatusChange?: (status: any) => void;
    onPositionChange?: (position: number) => void;
    onError?: (error: string) => void;
    onLoadStart?: () => void;
    onCanPlay?: () => void;
    onPlaying?: () => void;
    onWaiting?: () => void;
  }

  const {
    streamUrl = null,
    autoplay = true,
    onStatusChange,
    onPositionChange,
    onError,
    onLoadStart,
    onCanPlay,
    onPlaying,
    onWaiting,
  }: Props = $props();

  // State
  let status = $state({
    playing: false,
    paused: false,
    loading: false,
    buffering: false,
    position: 0,
    duration: 0,
    error: "",
  });

  let unsubscribeStatus: (() => void) | null = null;
  let unsubscribePosition: (() => void) | null = null;

  // Reactive effects
  $effect(() => {
    if (streamUrl && mpvVideoService.isSupported()) {
      loadStream(streamUrl);
    }
  });

  onMount(() => {
    if (!mpvVideoService.isSupported()) {
      console.warn(
        "MPV video service not available - make sure you are running in Tauri"
      );
      const error = "MPV not available - please run in Tauri mode";
      status.error = error;
      onError?.(error);
      return;
    }

    // Subscribe to status changes
    unsubscribeStatus = mpvVideoService.onStatusChange((newStatus) => {
      const oldStatus = status;
      status = { ...newStatus };

      // Call appropriate callbacks based on status changes
      if (newStatus.loading && !oldStatus.loading) {
        onLoadStart?.();
      }
      if (newStatus.playing && !oldStatus.playing) {
        onPlaying?.();
        onCanPlay?.();
      }
      if (newStatus.buffering && !oldStatus.buffering) {
        onWaiting?.();
      }
      if (newStatus.error && newStatus.error !== oldStatus.error) {
        onError?.(newStatus.error);
      }

      onStatusChange?.(newStatus);
    });

    // Subscribe to position changes
    unsubscribePosition = mpvVideoService.onPositionChange((position) => {
      status.position = position;
      onPositionChange?.(position);
    });

    // Load initial stream if provided
    if (streamUrl) {
      loadStream(streamUrl);
    }
  });

  onDestroy(() => {
    unsubscribeStatus?.();
    unsubscribePosition?.();
  });

  async function loadStream(url: string) {
    if (!mpvVideoService.isSupported()) {
      const error = "MPV not available";
      status.error = error;
      onError?.(error);
      return;
    }

    try {
      const success = await mpvVideoService.loadStream(url);
      if (success && autoplay) {
        await mpvVideoService.play();
      }
    } catch (error) {
      console.error("Failed to load stream:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      status.error = errorMessage;
      onError?.(errorMessage);
    }
  }

  // Expose player control methods
  export async function play() {
    return await mpvVideoService.play();
  }

  export async function pause() {
    return await mpvVideoService.pause();
  }

  export async function stop() {
    return await mpvVideoService.stop();
  }

  export async function togglePlayPause() {
    return await mpvVideoService.togglePlayPause();
  }

  export async function setVolume(volume: number) {
    return await mpvVideoService.setVolume(volume);
  }

  export function getStatus() {
    return status;
  }

  export function getCurrentStreamUrl() {
    return mpvVideoService.getCurrentStreamUrl();
  }
</script>

<!-- MPV Player placeholder div -->
<div
  class="mpv-player-container"
  class:loading={status.loading}
  class:playing={status.playing}
  class:error={!!status.error}
>
  {#if !mpvVideoService.isSupported()}
    <div class="error-message">
      <h3>MPV Player Not Available</h3>
      <p>This application requires Tauri with MPV support.</p>
      <p>Please run this application in Tauri mode.</p>
    </div>
  {:else if status.error}
    <div class="error-message">
      <h3>Playback Error</h3>
      <p>{status.error}</p>
    </div>
  {:else if status.loading}
    <div class="loading-message">
      <div class="loading-spinner"></div>
      <p>Loading stream...</p>
    </div>
  {:else if !streamUrl}
    <div class="no-stream-message">
      <p>No stream loaded</p>
    </div>
  {/if}

  <!-- MPV renders in a separate native window/overlay, so this is just a placeholder -->
  <div class="mpv-overlay" class:visible={status.playing}>
    <!-- Optional overlay content for controls, etc. -->
    <slot />
  </div>
</div>

<style>
  .mpv-player-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .error-message,
  .loading-message,
  .no-stream-message {
    text-align: center;
    padding: 2rem;
  }

  .error-message h3 {
    color: #ff6b6b;
    margin-bottom: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #333;
    border-top: 4px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .mpv-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .mpv-overlay.visible {
    opacity: 1;
  }

  .mpv-overlay :global(*) {
    pointer-events: auto;
  }
</style>
