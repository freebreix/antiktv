<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { getOrCreateDeviceId } from "$lib/client/deviceId";

  let videoElement = $state<HTMLVideoElement>();
  let dashPlayer: any = null;
  let loading = $state(true);
  let error = $state<string | null>(null);
  let channelInfo = $state<any>(null);
  let streamUrl = $state<string | null>(null);
  let deviceId = $state<string>("");

  const channelId = $page.params.id;

  onMount(() => {
    const initializeChannel = async () => {
      try {
        // Get device ID from browser cookie
        deviceId = getOrCreateDeviceId();
        console.log("📱 Channel page using device ID:", deviceId);

        await loadDashJS();
        await loadChannelInfo();
        if (streamUrl) {
          await initializePlayer();
        }
      } catch (err) {
        error = `Failed to load channel: ${err instanceof Error ? err.message : String(err)}`;
      } finally {
        loading = false;
      }
    };

    initializeChannel();

    // Setup keyboard navigation
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (dashPlayer) {
        dashPlayer.reset();
      }
    };
  });

  // Load dash.js library
  async function loadDashJS() {
    return new Promise((resolve, reject) => {
      if ((window as any).dashjs) {
        resolve(undefined);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.dashjs.org/latest/dash.all.min.js";
      script.onload = () => resolve(undefined);
      script.onerror = () => reject(new Error("Failed to load dash.js"));
      document.head.appendChild(script);
    });
  }

  // Load channel information and stream URL
  async function loadChannelInfo() {
    // Load channels to find the specific channel info
    const channelsResponse = await fetch("/api/channels", {
      headers: {
        "X-Device-ID": deviceId,
      },
    });
    const channelsData = await channelsResponse.json();

    if (channelsData.success) {
      const channels = channelsData.channels || [];
      channelInfo = channels.find(
        (ch: any) => ch.channel === channelId || ch.id === channelId
      );

      if (!channelInfo) {
        throw new Error(`Channel ${channelId} not found`);
      }
    } else {
      throw new Error("Failed to load channel data");
    }

    // Load stream URL for this specific channel
    const streamResponse = await fetch(`/api/stream?channel=${channelId}`, {
      headers: {
        "X-Device-ID": deviceId,
      },
    });
    const streamData = await streamResponse.json();

    if (streamData.success && streamData.streamUrl) {
      streamUrl = streamData.streamUrl;
    } else {
      throw new Error("No stream URL available");
    }
  }

  // Initialize DASH player
  async function initializePlayer() {
    if (!streamUrl || !videoElement) return;

    const dashjs = (window as any).dashjs;
    if (!dashjs) return;

    dashPlayer = dashjs.MediaPlayer().create();
    dashPlayer.initialize(videoElement, streamUrl, true);

    // Configure DRM
    const protectionData = {
      "com.widevine.alpha": {
        serverURL: "http://localhost:5173/api/drm-proxy",
        httpRequestHeaders: {
          "Content-Type": "application/octet-stream",
        },
        withCredentials: false,
        priority: 0,
      },
    };

    dashPlayer.setProtectionData(protectionData);

    // Setup event listeners
    dashPlayer.on("streamInitialized", () => {
      console.log("🎬 Stream initialized for channel:", channelInfo?.name);
    });

    dashPlayer.on("error", (e: any) => {
      console.error("🎬 Player error:", e);
      error = `Playback error: ${e.error?.message || "Unknown error"}`;
    });
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "Escape":
      case "Backspace":
        goto("/");
        break;
      case " ": // Spacebar
        event.preventDefault();
        if (videoElement) {
          if (videoElement.paused) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        }
        break;
    }
  }
</script>

<svelte:head>
  <title>{channelInfo?.name || "Channel"} - AntikTV</title>
</svelte:head>

{#if loading}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p>Loading {channelId}...</p>
  </div>
{:else if error}
  <div class="error-screen">
    <h2>Error</h2>
    <p>{error}</p>
    <button onclick={() => goto("/")} class="back-button"
      >← Back to Channels</button
    >
  </div>
{:else}
  <main class="channel-player">
    <!-- Video Player -->
    <div class="video-container">
      <video bind:this={videoElement} controls autoplay class="video-player">
        <track kind="captions" src="" label="No captions available" />
      </video>
    </div>

    <!-- Channel Info Overlay -->
    <div class="channel-overlay">
      <div class="channel-header">
        <button onclick={() => goto("/")} class="back-button">← Back</button>
        <div class="channel-title">
          {#if channelInfo?.logo}
            <img
              src={channelInfo.logo}
              alt={channelInfo.name}
              class="channel-logo"
            />
          {/if}
          <h1>{channelInfo?.name}</h1>
          {#if channelInfo?.number}
            <span class="channel-number">CH {channelInfo.number}</span>
          {/if}
        </div>
      </div>

      <div class="controls-hint">
        <p>Press ESC to go back • SPACE to play/pause</p>
      </div>
    </div>
  </main>
{/if}

<style>
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #000;
    color: #fff;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #333;
    border-top: 4px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #000;
    color: #fff;
    text-align: center;
    padding: 20px;
  }

  .channel-player {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #000;
    overflow: hidden;
  }

  .video-container {
    width: 100%;
    height: 100%;
  }

  .video-player {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .channel-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      transparent 100%
    );
    padding: 20px;
    transition: opacity 0.3s ease;
  }

  .channel-overlay:hover {
    opacity: 1;
  }

  .channel-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .back-button {
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .back-button:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: #fff;
    transform: translateY(-2px);
  }

  .channel-title {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #fff;
  }

  .channel-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 8px;
  }

  .channel-title h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .channel-number {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }

  .controls-hint {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }

  .controls-hint p {
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 768px) {
    .channel-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .channel-title h1 {
      font-size: 1.8rem;
    }

    .channel-logo {
      width: 50px;
      height: 50px;
    }

    .back-button {
      padding: 10px 16px;
      font-size: 14px;
    }
  }

  /* Auto-hide overlay after 3 seconds */
  .channel-overlay {
    animation: auto-hide 3s ease-in-out 2s forwards;
  }

  @keyframes auto-hide {
    to {
      opacity: 0;
      pointer-events: none;
    }
  }

  .channel-overlay:hover {
    animation: none;
    opacity: 1;
    pointer-events: all;
  }
</style>
