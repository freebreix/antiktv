<script lang="ts">
  import { onMount } from "svelte";
  import { getOrCreateDeviceId } from "$lib/client/deviceId";
  import type { PageData } from "./$types";

  interface Channel {
    id: string;
    name: string;
    logo?: string;
    number?: number;
  }

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();

  // State management
  let channels = $state<Channel[]>(data.channels || []);
  let selectedChannelIndex = $state(0);
  let loading = $state(true);
  let error = $state<string | null>(data.error || null);
  let deviceId = $state<string>(data.deviceId || "");

  // Video player state
  let videoElement = $state<HTMLVideoElement>();
  let dashPlayer: any = null;
  let currentChannelInfo = $state<any>(null);
  let currentStreamUrl = $state<string | null>(null);
  let isVideoLoading = $state(false);
  let isVideoBuffering = $state(false);
  let playingChannelIndex = $state(0); // Track which channel is actually playing

  // EPG state
  let epgData = $state<any[]>(data.epg || []);
  let currentProgram = $state<any>(null);
  let nextProgram = $state<any>(null);
  let upcomingShows = $state<any[]>([]);
  let previewProgram = $state<any>(null);
  let previewUpcomingShows = $state<any[]>([]);
  let lastEpgRefresh = $state<number>(Date.now());

  // UI state
  let showChannelSelector = $state(false);
  let selectorTimeout: number | null = null;
  let currentTime = $state<string>("00:00");
  let previewChannelIndex = $state<number | null>(null); // Simplified: just track which channel is being previewed
  let isConnectionLost = $state(false);
  const selectedChannel = $derived(channels[selectedChannelIndex]);
  const isPreviewMode = $derived(
    previewChannelIndex !== null && previewChannelIndex !== playingChannelIndex
  );
  const displayChannelIndex = $derived(
    previewChannelIndex ?? selectedChannelIndex
  );
  const displayChannel = $derived(channels[displayChannelIndex]);

  // Hungarian translations
  const hu = {
    loading: "AntikTV betöltése...",
    error: "Hiba",
    liveTV: "Élő TV",
    liveDescription: "Jelenleg élő tartalom sugárzása",
    noProgramInfo: "Nincs műsorinformáció",
    noDescription: "Műsörleírás nem érhető el",
    comingUp: "Következik:",
    loadingStream: "Stream betöltése...",
    buffering: "Pufferelés...",
    pressAnyKey: "Nyomj meg egy gombot a csatorna kiválasztásához",
    connectionLost: "Kapcsolat megszakadt",
    reconnecting: "Újracsatlakozás...",
  };

  // Reactive effect to initialize player when video element is ready
  $effect(() => {
    if (videoElement && currentStreamUrl && !dashPlayer) {
      initializePlayer();
    }
  });

  onMount(() => {
    const initialize = async () => {
      try {
        // Get device ID from server cookie (same as server uses)
        const cookies = document.cookie.split(";");
        let cookieDeviceId = "";
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (name === "device-id" && value) {
            cookieDeviceId = decodeURIComponent(value);
            break;
          }
        }

        deviceId = cookieDeviceId || getOrCreateDeviceId();
        console.log("📱 Using device ID:", deviceId);
        console.log("📺 Loaded", channels.length, "channels from server");

        // Load last selected channel from localStorage
        const savedChannelIndex = localStorage.getItem(
          "antiktv-selected-channel"
        );
        if (savedChannelIndex && !isNaN(Number(savedChannelIndex))) {
          const index = Number(savedChannelIndex);
          if (index >= 0 && index < channels.length) {
            selectedChannelIndex = index;
            playingChannelIndex = index; // Set playing channel index when loading from localStorage
          }
        }

        if (channels.length > 0) {
          await loadDashJS();
          await loadCurrentChannel();
        }

        setupKeyboardNavigation();
        setupEpgRefresh();
        setupTimeUpdate();
      } catch (err) {
        error = `Failed to initialize: ${err instanceof Error ? err.message : String(err)}`;
      } finally {
        loading = false;
      }
    };

    initialize();

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (dashPlayer) {
        dashPlayer.reset();
      }
    };
  });

  // Setup EPG refresh timer (every 10 minutes)
  function setupEpgRefresh() {
    // Refresh EPG every 10 minutes
    const refreshInterval = setInterval(() => {
      const timeSinceLastRefresh = Date.now() - lastEpgRefresh;
      if (timeSinceLastRefresh >= 10 * 60 * 1000) {
        // 10 minutes
        refreshEpgData();
      }
    }, 60 * 1000); // Check every minute

    // Cleanup interval on component destroy
    return () => clearInterval(refreshInterval);
  }

  // Setup time update timer
  function setupTimeUpdate() {
    function updateTime() {
      const now = new Date();
      currentTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    updateTime(); // Initial update
    const timeInterval = setInterval(updateTime, 1000); // Update every second

    // Cleanup interval on component destroy
    return () => clearInterval(timeInterval);
  }

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

  // Load current program from EPG for a specific channel
  function getChannelEpgData(channelIndex: number) {
    const channel = channels[channelIndex];
    if (!channel || !epgData.length) {
      return {
        currentProgram: {
          title: hu.liveTV,
          description: hu.liveDescription,
        },
        nextProgram: null,
        upcomingShows: [],
      };
    }

    try {
      console.log("📺 Loading EPG for channel:", channel.id);

      // Filter programs for channel
      const channelPrograms = epgData
        .filter((program) => program.channelId === channel.id)
        .sort((a, b) => a.start - b.start);

      console.log(
        "📺 Found",
        channelPrograms.length,
        "programs for channel",
        channel.id
      );

      if (channelPrograms.length > 0) {
        // Find current program based on time
        const now = Date.now();
        const currentProg = channelPrograms.find(
          (program) => now >= program.start && now <= program.end
        );

        if (currentProg) {
          const nextProg = channelPrograms.find(
            (program) => program.start > currentProg.end
          );
          const upcoming = channelPrograms
            .filter((program) => program.start > currentProg.end)
            .slice(0, 5);

          return {
            currentProgram: currentProg,
            nextProgram: nextProg || null,
            upcomingShows: upcoming,
          };
        } else {
          // No current program, find next upcoming
          const upcomingProg = channelPrograms.find(
            (program) => program.start > now
          );

          if (upcomingProg) {
            const upcoming = channelPrograms
              .filter((program) => program.start > now)
              .slice(0, 5);

            return {
              currentProgram: {
                title: hu.liveTV,
                description: hu.liveDescription,
              },
              nextProgram: upcomingProg,
              upcomingShows: upcoming,
            };
          } else {
            // Use first program as fallback
            const upcoming = channelPrograms.slice(1, 6);
            return {
              currentProgram: channelPrograms[0],
              nextProgram: channelPrograms[1] || null,
              upcomingShows: upcoming,
            };
          }
        }
      } else {
        console.log("📺 No EPG programs found for channel");
        return {
          currentProgram: {
            title: hu.liveTV,
            description: hu.liveDescription,
          },
          nextProgram: null,
          upcomingShows: [],
        };
      }
    } catch (err) {
      console.error("📺 Failed to load EPG:", err);
      return {
        currentProgram: {
          title: hu.liveTV,
          description: hu.liveDescription,
        },
        nextProgram: null,
        upcomingShows: [],
      };
    }
  }

  // Load current program from EPG
  function loadCurrentProgram() {
    const epgData = getChannelEpgData(selectedChannelIndex);
    currentProgram = epgData.currentProgram;
    nextProgram = epgData.nextProgram;
    upcomingShows = epgData.upcomingShows;
  }

  // Update preview EPG data
  function updatePreviewEpg() {
    if (previewChannelIndex !== null) {
      const epgData = getChannelEpgData(previewChannelIndex);
      previewProgram = epgData.currentProgram;
      previewUpcomingShows = epgData.upcomingShows;
    } else {
      previewProgram = null;
      previewUpcomingShows = [];
    }
  }

  // Refresh EPG data from server
  async function refreshEpgData() {
    try {
      console.log("📺 Refreshing EPG data...");
      const response = await fetch("/api/epg");
      const data = await response.json();

      if (data.success && Array.isArray(data.programs)) {
        epgData = data.programs;
        lastEpgRefresh = Date.now();
        console.log("📺 EPG refreshed with", epgData.length, "programs");

        // Update current program info
        loadCurrentProgram();
      }
    } catch (err) {
      console.error("📺 Failed to refresh EPG:", err);
    }
  }

  // Load and play the current selected channel
  async function loadCurrentChannel() {
    if (!selectedChannel) return;

    try {
      console.log("📺 Loading channel:", selectedChannel.name);

      // Set current channel info
      currentChannelInfo = selectedChannel;

      // Load EPG for this channel
      loadCurrentProgram();

      // Get stream URL
      const streamResponse = await fetch(
        `/api/stream?channel=${selectedChannel.id}`,
        {
          headers: {
            "X-Device-ID": deviceId,
          },
        }
      );

      const streamData = await streamResponse.json();

      if (streamData.success && streamData.streamUrl) {
        currentStreamUrl = streamData.streamUrl;
        await initializePlayer();
      } else {
        throw new Error("No stream URL available");
      }
    } catch (err) {
      console.error("📺 Failed to load channel:", err);
      error = `Failed to load channel: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  // Initialize DASH player
  async function initializePlayer() {
    if (!currentStreamUrl || !videoElement) {
      console.log("🎬 Waiting for video element or stream URL...");
      return;
    }

    console.log("🎬 Initializing player with URL:", currentStreamUrl);

    // Set loading state
    isVideoLoading = true;

    // Clean up previous player
    if (dashPlayer) {
      dashPlayer.reset();
    }

    const dashjs = (window as any).dashjs;
    if (!dashjs) {
      console.error("🎬 dash.js not loaded");
      isVideoLoading = false;
      return;
    }

    dashPlayer = dashjs.MediaPlayer().create();

    // Set up video element event listeners for loading states
    if (videoElement) {
      videoElement.addEventListener("loadstart", () => {
        isVideoLoading = true;
        isVideoBuffering = false;
        isConnectionLost = false;
      });

      videoElement.addEventListener("loadeddata", () => {
        isVideoLoading = false;
        isVideoBuffering = false;
        isConnectionLost = false;
      });

      videoElement.addEventListener("waiting", () => {
        isVideoBuffering = true;
      });

      videoElement.addEventListener("canplay", () => {
        isVideoBuffering = false;
        isConnectionLost = false;
      });

      videoElement.addEventListener("playing", () => {
        isVideoLoading = false;
        isVideoBuffering = false;
        isConnectionLost = false;
        playingChannelIndex = selectedChannelIndex; // Update which channel is actually playing
      });

      // Connection lost detection
      videoElement.addEventListener("error", () => {
        console.error("🎬 Video element error - connection likely lost");
        isConnectionLost = true;
        isVideoLoading = false;
        isVideoBuffering = false;
      });

      videoElement.addEventListener("stalled", () => {
        console.warn("🎬 Video stalled - possible connection issue");
        // Set connection lost after 10 seconds of stalling
        setTimeout(() => {
          if (videoElement?.readyState < 3) {
            isConnectionLost = true;
          }
        }, 10000);
      });
    }

    // Configure DRM before initializing
    const protectionData = {
      "com.widevine.alpha": {
        serverURL: `${window.location.origin}/api/drm-proxy`,
        httpRequestHeaders: {
          "Content-Type": "application/octet-stream",
          "X-Device-ID": deviceId,
        },
        withCredentials: false,
        priority: 0,
      },
    };

    dashPlayer.setProtectionData(protectionData);

    // Setup event listeners
    dashPlayer.on("error", (e: any) => {
      console.error("🎬 Player error:", e);

      // Check if it's a network-related error
      const errorCode = e.error?.code;
      const errorMessage = e.error?.message || "";

      if (
        errorCode === 25 ||
        errorCode === 4 ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout")
      ) {
        isConnectionLost = true;
        console.error("🎬 Network connection lost");
      } else {
        error = `Lejátszási hiba: ${errorMessage || "Ismeretlen hiba"}`;
      }

      isVideoLoading = false;
      isVideoBuffering = false;
    });

    dashPlayer.on("playbackStarted", () => {
      console.log("🎬 Video playback started for", currentChannelInfo?.name);
      isVideoLoading = false;
      isConnectionLost = false;
    });

    // Initialize the player
    dashPlayer.initialize(videoElement, currentStreamUrl, true);
  }

  // Show channel selector overlay
  function showSelector() {
    showChannelSelector = true;

    // If we're not already showing a preview, start previewing the currently playing channel
    if (previewChannelIndex === null) {
      previewChannelIndex = playingChannelIndex;
      selectedChannelIndex = playingChannelIndex;
      updatePreviewEpg();
    }

    // Auto-hide after 5 seconds of no interaction
    if (selectorTimeout) {
      clearTimeout(selectorTimeout);
    }
    selectorTimeout = setTimeout(() => {
      showChannelSelector = false;
      // Reset to playing channel when overlay disappears
      selectedChannelIndex = playingChannelIndex;
      previewChannelIndex = null;
      previewProgram = null;
      previewUpcomingShows = [];
    }, 5000);
  }

  // Change channel and reload video
  async function changeChannel(newIndex: number) {
    if (newIndex >= 0 && newIndex < channels.length) {
      selectedChannelIndex = newIndex;
      await loadCurrentChannel();
    }
  }

  // Navigate channels
  function navigateChannels(direction: number) {
    const newIndex = selectedChannelIndex + direction;
    if (newIndex >= 0 && newIndex < channels.length) {
      selectedChannelIndex = newIndex;
      previewChannelIndex = newIndex;

      // Update preview EPG data
      updatePreviewEpg();

      // Auto-scroll to keep selected channel visible
      if (showChannelSelector) {
        setTimeout(() => {
          const channelContainer = document.querySelector(
            ".channels-horizontal"
          );
          const selectedChannel = document.querySelector(
            ".channel-item.selected"
          );

          if (channelContainer && selectedChannel) {
            selectedChannel.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }, 50);
      }
    }
  }

  // Select current channel and start playing
  async function selectCurrentChannel() {
    showChannelSelector = false;
    if (selectorTimeout) {
      clearTimeout(selectorTimeout);
    }

    // Save selected channel to localStorage
    localStorage.setItem(
      "antiktv-selected-channel",
      selectedChannelIndex.toString()
    );

    await changeChannel(selectedChannelIndex);

    // Clear preview state
    previewChannelIndex = null;
    previewProgram = null;
    previewUpcomingShows = [];
  }

  // Setup keyboard navigation
  function setupKeyboardNavigation() {
    window.addEventListener("keydown", handleKeydown);
  }

  // Handle keyboard input
  function handleKeydown(event: KeyboardEvent) {
    // Map of number keys to channel indices
    const numberChannelMap: { [key: string]: number } = {
      "0": 9, // Channel 10 (0-indexed)
      "1": 0, // Channel 1
      "2": 1, // Channel 2
      "3": 2, // Channel 3
      "4": 3, // Channel 4
      "5": 4, // Channel 5
      "6": 5, // Channel 6
      "7": 6, // Channel 7
      "8": 7, // Channel 8
      "9": 8, // Channel 9
    };

    // Handle number key direct channel selection
    if (event.key in numberChannelMap) {
      event.preventDefault();
      const targetChannel = numberChannelMap[event.key];
      if (targetChannel < channels.length) {
        selectedChannelIndex = targetChannel;
        selectCurrentChannel();
      }
      return;
    }

    // Any other key shows the channel selector (except Enter when selector is not shown)
    if (!showChannelSelector && event.key !== "Enter") {
      showSelector();
    }

    switch (event.key) {
      // Directional navigation - left/right for channel selection
      case "ArrowLeft":
      case "ArrowUp": // Also allow up/down for channel navigation
        event.preventDefault();
        navigateChannels(-1);
        showSelector(); // Reset timeout
        break;
      case "ArrowRight":
      case "ArrowDown": // Also allow up/down for channel navigation
        event.preventDefault();
        navigateChannels(1);
        showSelector(); // Reset timeout
        break;

      // Enter key - select channel or show selector
      case "Enter":
        event.preventDefault();
        if (showChannelSelector) {
          selectCurrentChannel();
        } else {
          showSelector();
        }
        break;

      // Back/Escape - hide selector or go back
      case "Escape":
      case "Backspace": // Support back key from keymap (KEY_BACKSPACE)
        event.preventDefault();
        showChannelSelector = false;
        if (selectorTimeout) {
          clearTimeout(selectorTimeout);
        }
        // Reset to playing channel when going back
        selectedChannelIndex = playingChannelIndex;
        previewChannelIndex = null;
        previewProgram = null;
        previewUpcomingShows = [];
        break;

      // Page Up/Down for channel navigation (channel_up/channel_down from keymap)
      case "PageUp": // KEY_PAGEUP from keymap
        event.preventDefault();
        navigateChannels(-1);
        showSelector();
        break;
      case "PageDown": // KEY_PAGEDOWN from keymap
        event.preventDefault();
        navigateChannels(1);
        showSelector();
        break;

      // Play/Pause toggle (p key from keymap handles both play and pause)
      case "p":
      case "P": // KEY_P from keymap
      case " ": // Also support spacebar
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
  <title>{currentChannelInfo?.name || "AntikTV"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if loading}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p>{hu.loading}</p>
  </div>
{:else if error}
  <div class="error-screen">
    <h2>{hu.error}</h2>
    <p>{error}</p>
  </div>
{:else}
  <main class="tv-player">
    <!-- Main Video Player -->
    <div class="video-container">
      <video
        bind:this={videoElement}
        autoplay
        class="main-video"
        onclick={() => showSelector()}
      >
        <track kind="captions" src="" label="No captions available" />
      </video>

      <!-- Fallback content when no video is loaded -->
      {#if !currentStreamUrl}
        <div class="video-placeholder">
          <div class="placeholder-content">
            <h1>AntikTV</h1>
            <p>{hu.pressAnyKey}</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Connection Lost Indicator (center) -->
    {#if isConnectionLost}
      <div class="connection-lost-overlay">
        <div class="connection-lost-content">
          <div class="connection-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9L22.5 7.5C19.14 4.14 14.54 2.5 12 2.5S4.86 4.14 1.5 7.5L3 9C5.5 6.5 8.5 5 12 5S18.5 6.5 21 9ZM19 11L20.5 9.5C18.1 7.1 15.1 6 12 6S5.9 7.1 3.5 9.5L5 11C6.8 9.2 9.3 8 12 8S17.2 9.2 19 11ZM17 13L18.5 11.5C16.9 9.9 14.5 9 12 9S7.1 9.9 5.5 11.5L7 13C8.2 11.8 10 11 12 11S15.8 11.8 17 13Z"
                fill="currentColor"
              />
              <line
                x1="1"
                y1="1"
                x2="23"
                y2="23"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          <h2>{hu.connectionLost}</h2>
          <p>{hu.reconnecting}</p>
        </div>
      </div>
    {/if}

    <!-- Modern Loading Animation (center) -->
    {#if isVideoLoading || isVideoBuffering}
      <div class="loading-overlay">
        <div class="modern-loader">
          <div class="sk-wave">
            <div class="sk-rect sk-rect-1"></div>
            <div class="sk-rect sk-rect-2"></div>
            <div class="sk-rect sk-rect-3"></div>
            <div class="sk-rect sk-rect-4"></div>
            <div class="sk-rect sk-rect-5"></div>
          </div>
          <p>{isVideoLoading ? hu.loadingStream : hu.buffering}</p>
        </div>
      </div>
    {/if}

    <!-- TV Overlay with gradient -->
    <div class="tv-overlay" class:show={showChannelSelector}>
      <!-- Top section -->
      <div class="overlay-top">
        <!-- Progress Bar (absolutely positioned at very top) -->
        <div class="progress-bar-container">
          <div
            class="progress-bar"
            style="width: {(isPreviewMode ? previewProgram : currentProgram)
              ? ((Date.now() -
                  (isPreviewMode ? previewProgram : currentProgram).start) /
                  ((isPreviewMode ? previewProgram : currentProgram).end -
                    (isPreviewMode ? previewProgram : currentProgram).start)) *
                100
              : 0}%"
          ></div>
        </div>

        <!-- Currently playing (top left) -->
        <div class="now-playing">
          <!-- Show times (show preview times when previewing) -->
          {#if (isPreviewMode && previewProgram && previewProgram.start && previewProgram.end) || (currentProgram && currentProgram.start && currentProgram.end)}
            {@const displayProgram = isPreviewMode
              ? previewProgram
              : currentProgram}
            <h3 class="show-times">
              {new Date(displayProgram.start).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })} -
              {new Date(displayProgram.end).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </h3>
          {/if}

          <h1>
            {(isPreviewMode ? previewProgram : currentProgram)?.title ||
              hu.noProgramInfo}
          </h1>
          <p>
            {(isPreviewMode ? previewProgram : currentProgram)?.description ||
              hu.noDescription}
          </p>

          <!-- Upcoming shows list - show when overlay is visible -->
          {#if showChannelSelector && (isPreviewMode ? previewUpcomingShows : upcomingShows).length > 0}
            <div class="upcoming-shows">
              <h4>{hu.comingUp}</h4>
              <div class="upcoming-list">
                {#each isPreviewMode ? previewUpcomingShows : upcomingShows as show}
                  <div class="upcoming-item">
                    <span class="upcoming-time">
                      {new Date(show.start).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                    <span class="upcoming-title">{show.title}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Current time (top right) -->
        <div class="current-time">
          <h1>{currentTime}</h1>
        </div>
      </div>

      <!-- Bottom section - Channel Selector -->
      {#if showChannelSelector}
        <div class="overlay-bottom">
          <div class="channel-selector">
            <div class="channels-horizontal">
              {#each channels as channel, index}
                <button
                  class="channel-item"
                  class:selected={index === selectedChannelIndex}
                  onclick={() => {
                    selectedChannelIndex = index;
                    previewChannelIndex = index;
                    updatePreviewEpg();
                    showSelector();
                  }}
                >
                  {#if channel.logo}
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      class="channel-logo"
                    />
                  {/if}
                  <div class="channel-details">
                    <span class="channel-name">{channel.name}</span>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </main>
{/if}

<style>
  /* Global Font Styles */
  * {
    font-family:
      "Roboto",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .title {
    font-family:
      "Mona Sans",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

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

  .tv-player {
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

  .main-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
  }

  /* Video Placeholder */
  .video-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .placeholder-content {
    text-align: center;
    color: #fff;
  }

  .placeholder-content h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 20px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .placeholder-content p {
    font-size: 1.2rem;
    opacity: 0.8;
    margin: 0;
  }

  /* Modern Loading Animation */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }

  .modern-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .sk-wave {
    width: 90px;
    height: 60px;
    margin: auto;
    text-align: center;
    font-size: 1em;
  }

  .sk-rect {
    background-color: #6496ff;
    height: 100%;
    width: 0.5em;
    display: inline-block;
    margin: 0 2px;
    animation: sk-wave-stretch-delay 1.2s infinite ease-in-out;
  }

  .sk-rect-1 {
    animation-delay: -1.2s;
  }
  .sk-rect-2 {
    animation-delay: -1.1s;
  }
  .sk-rect-3 {
    animation-delay: -1s;
  }
  .sk-rect-4 {
    animation-delay: -0.9s;
  }
  .sk-rect-5 {
    animation-delay: -0.8s;
  }

  @keyframes sk-wave-stretch-delay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }

  .modern-loader p {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  /* Connection Lost Overlay */
  .connection-lost-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 25;
  }

  .connection-lost-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
    color: #fff;
  }

  .connection-icon {
    width: 80px;
    height: 80px;
    color: #ff6b6b;
    opacity: 0.8;
    animation: pulse 2s ease-in-out infinite;
  }

  .connection-lost-content h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
    color: #ff6b6b;
  }

  .connection-lost-content p {
    font-size: 1.2rem;
    margin: 0;
    opacity: 0.9;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Progress Bar */
  .progress-bar-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    z-index: 1;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #6496ff, #4a7fff);
    transition: width 1s ease;
  }

  /* TV Overlay System */
  .tv-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 15%,
      transparent 25%,
      transparent 75%,
      rgba(0, 0, 0, 0.6) 85%,
      rgba(0, 0, 0, 0.8) 100%
    );
    pointer-events: none;
    z-index: 10;
    animation: auto-hide 4s ease-in-out 3s forwards;
  }

  .tv-overlay:hover,
  .tv-overlay.show {
    animation: none;
    opacity: 1;
  }

  @keyframes auto-hide {
    to {
      opacity: 0;
    }
  }

  .overlay-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 40px;
    pointer-events: auto;
  }

  .overlay-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px 40px 40px;
    pointer-events: auto;
  }

  /* Now Playing Section (Top Left) */
  .now-playing {
    flex: 1;
    max-width: 60%;
    color: #fff;
  }

  .show-times {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 10px 0;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  .now-playing h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 15px 0;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
    line-height: 1.2;
  }

  .now-playing p {
    font-size: 1.1rem;
    line-height: 1.4;
    margin: 0 0 20px 0;
    opacity: 0.9;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  .upcoming-shows {
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .upcoming-shows h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  .upcoming-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .upcoming-item {
    display: flex;
    gap: 12px;
    align-items: baseline;
  }

  .upcoming-time {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    min-width: 60px;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  .upcoming-title {
    font-size: 0.95rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  /* Current Time Section (Top Right) */
  .current-time {
    display: flex;
    align-items: center;
    color: #fff;
    flex-shrink: 0;
  }

  .current-time h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
    font-family:
      "Mona Sans",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .next-program {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .next-program h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  .next-description {
    font-size: 0.95rem;
    line-height: 1.3;
    margin: 0;
    opacity: 0.75;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  }

  /* Channel Info Section (Top Right) */
  .channel-info {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #fff;
    flex-shrink: 0;
  }

  .channel-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .channel-text h2 {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0 0 5px 0;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9);
  }

  /* Channel Selector (Bottom) */
  .channel-selector {
    width: 100%;
    overflow: visible;
  }

  .channels-horizontal {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    overflow-y: visible;
    padding: 20px 0 15px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  .channels-horizontal::-webkit-scrollbar {
    height: 6px;
  }

  .channels-horizontal::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .channels-horizontal::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .channels-horizontal::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .channel-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 25px 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 160px;
    flex-shrink: 0;
    backdrop-filter: blur(10px);
    overflow: visible;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .channel-item:hover {
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
  }

  .channel-item.selected {
    border-color: #6496ff;
    box-shadow:
      0 0 25px rgba(100, 150, 255, 0.4),
      0 12px 48px rgba(0, 0, 0, 0.5);
    transform: translateY(-8px) scale(1.05);
  }

  .channel-item .channel-logo {
    width: 90px;
    height: 90px;
  }

  .channel-details {
    text-align: center;
    overflow: visible;
  }

  .channel-name {
    display: block;
    font-family:
      "Mona Sans",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0;
    text-align: center;
    line-height: 1.3;
    overflow: visible;
    white-space: nowrap;
  }

  .controls-hint {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    margin-top: 10px;
  }

  .controls-hint p {
    margin: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .overlay-top {
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }

    .now-playing {
      max-width: 100%;
    }

    .now-playing h1 {
      font-size: 1.8rem;
    }

    .now-playing p {
      font-size: 1rem;
    }

    .channel-info {
      align-self: flex-end;
    }

    .channel-logo {
      width: 40px;
      height: 40px;
    }

    .channel-text h2 {
      font-size: 1.2rem;
    }

    .overlay-bottom {
      padding: 20px;
    }

    .channels-horizontal {
      gap: 15px;
      padding: 15px 0 10px 0;
    }

    .channel-item {
      min-width: 140px;
      padding: 20px 15px;
      gap: 12px;
    }

    .channel-item .channel-logo {
      width: 75px;
      height: 75px;
    }

    .channel-name {
      font-size: 1rem;
    }
  }
</style>
