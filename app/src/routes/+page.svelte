<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getOrCreateDeviceId } from "$lib/client/deviceId";

  interface Channel {
    id: string;
    name: string;
    logo?: string;
    number?: number;
  }

  let channels = $state<Channel[]>([]);
  let selectedChannelIndex = $state(0);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let channelScreenshots = $state<Record<string, string>>({});
  let selectedBackground = $state<string | null>(null);
  let deviceId = $state<string>("");

  const selectedChannel = $derived(channels[selectedChannelIndex]);

  // Update background when selected channel changes
  $effect(() => {
    updateSelectedBackground();
  });

  onMount(async () => {
    try {
      // Get or create device ID from browser cookie
      deviceId = getOrCreateDeviceId();
      console.log("📱 Using device ID:", deviceId);

      await loadChannels();
      if (channels.length > 0) {
        await loadAllScreenshots();
        updateSelectedBackground();
      }
      setupKeyboardNavigation();
    } catch (err) {
      error = `Failed to load: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      loading = false;
    }
  });

  // Load channel list from API
  async function loadChannels() {
    const response = await fetch("/api/channels", {
      headers: {
        "X-Device-ID": deviceId,
      },
    });
    const data = await response.json();

    if (data.success) {
      channels = data.channels.map((ch: any) => ({
        id: ch.channel,
        name: ch.name,
        logo: ch.logo,
        number: ch.number,
      }));
    } else {
      throw new Error("Failed to load channels");
    }
  }

  // Load all channel screenshots
  async function loadAllScreenshots() {
    console.log("📸 Loading screenshots for all channels...");

    try {
      const response = await fetch("/api/screenshots", {
        method: "POST",
        headers: {
          "X-Device-ID": deviceId,
        },
      });
      const data = await response.json();

      if (data.success) {
        channelScreenshots = data.screenshots;
        console.log(
          "📸 Loaded screenshots for",
          Object.keys(channelScreenshots).length,
          "channels"
        );
      } else {
        console.error("📸 Failed to load screenshots:", data.error);
      }
    } catch (err) {
      console.error("📸 Error loading screenshots:", err);
    }
  }

  // Update background when channel selection changes
  function updateSelectedBackground() {
    if (selectedChannel && channelScreenshots[selectedChannel.id]) {
      selectedBackground = channelScreenshots[selectedChannel.id];
    }
  }

  // Handle channel selection
  function selectChannel(index: number) {
    selectedChannelIndex = index;
    updateSelectedBackground();
  }

  // Navigate to channel page
  function goToChannel(channel: Channel) {
    goto(`/channel/${channel.id}`);
  }

  // Setup keyboard navigation
  function setupKeyboardNavigation() {
    window.addEventListener("keydown", handleKeydown);
  }

  // Keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        if (selectedChannelIndex > 0) {
          selectChannel(selectedChannelIndex - 1);
        }
        break;
      case "ArrowRight":
        if (selectedChannelIndex < channels.length - 1) {
          selectChannel(selectedChannelIndex + 1);
        }
        break;
      case "Enter":
        if (selectedChannel) {
          goToChannel(selectedChannel);
        }
        break;
    }
  }
</script>

{#if loading}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p>Loading AntikTV...</p>
  </div>
{:else if error}
  <div class="error-screen">
    <h2>Error</h2>
    <p>{error}</p>
  </div>
{:else}
  <main class="tv-interface">
    <!-- Background Screenshot -->
    <div
      class="background-image"
      style="background-image: url('{selectedBackground}')"
    >
      <div class="video-gradient"></div>
    </div>

    <!-- Channel Selector -->
    <div class="channel-selector">
      <div class="channels-container">
        {#each channels as channel, index}
          <button
            class="channel-item"
            class:selected={index === selectedChannelIndex}
            onclick={() => goToChannel(channel)}
          >
            {#if channel.logo}
              <img src={channel.logo} alt={channel.name} class="channel-logo" />
            {/if}
            <div class="channel-info">
              <div class="channel-name">{channel.name}</div>
              {#if channel.number}
                <div class="channel-number">{channel.number}</div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Selected Channel Info -->
    {#if selectedChannel}
      <div class="selected-channel-info">
        <h1>{selectedChannel.name}</h1>
        <p>Press Enter to watch • Use ← → to navigate</p>
      </div>
    {/if}
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

  .tv-interface {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #000;
    overflow: hidden;
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image 0.5s ease-in-out;
  }

  .video-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.3) 70%,
      rgba(0, 0, 0, 0.8) 90%,
      rgba(0, 0, 0, 0.95) 100%
    );
  }

  .channel-selector {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 0 20px;
  }

  .channels-container {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 20px;
    scroll-behavior: smooth;
  }

  .channels-container::-webkit-scrollbar {
    height: 4px;
  }

  .channels-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  .channels-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  .channel-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 120px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid transparent;
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .channel-item:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-5px);
  }

  .channel-item.selected {
    background: rgba(255, 255, 255, 0.2);
    border-color: #fff;
    transform: translateY(-5px);
  }

  .channel-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-bottom: 10px;
    border-radius: 8px;
  }

  .channel-info {
    text-align: center;
  }

  .channel-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .channel-number {
    font-size: 12px;
    opacity: 0.8;
  }

  .selected-channel-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
    z-index: 5;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .selected-channel-info h1 {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 20px;
    letter-spacing: 2px;
  }

  .selected-channel-info p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .selected-channel-info h1 {
      font-size: 2.5rem;
    }

    .channel-item {
      min-width: 100px;
      padding: 12px;
    }

    .channel-logo {
      width: 50px;
      height: 50px;
    }

    .channel-name {
      font-size: 12px;
    }
  }
</style>
