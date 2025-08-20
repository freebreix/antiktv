<script lang="ts">
  import { onMount } from "svelte";
  import MPVPlayer from "$lib/components/MPVPlayer.svelte";
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

  // Video player state
  let mpvPlayer: any = null;
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
  let channelChangeTimeout: number | null = null; // Debounce timeout for Page Up/Down
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

  onMount(() => {
    const initialize = async () => {
      try {
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
      if (channelChangeTimeout) {
        clearTimeout(channelChangeTimeout);
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
        `/api/stream?channel=${selectedChannel.id}`
      );

      const streamData = await streamResponse.json();

      if (streamData.success && streamData.streamUrl) {
        currentStreamUrl = streamData.streamUrl;
        // MPV player will automatically load and play the stream via reactive effects
      } else {
        throw new Error("No stream URL available");
      }
    } catch (err) {
      console.error("📺 Failed to load channel:", err);
      error = `Failed to load channel: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  // Handle MPV player status changes
  function handleMPVStatusChange(status: any) {
    isVideoLoading = status.loading;
    isVideoBuffering = status.buffering;
    isConnectionLost = !!status.error;

    if (status.playing && !status.paused) {
      playingChannelIndex = selectedChannelIndex;
    }
  }

  // Handle MPV player errors
  function handleMPVError(errorMessage: string) {
    error = `Lejátszási hiba: ${errorMessage}`;
    isConnectionLost = true;
  }

  // Reset the selector auto-hide timeout
  function resetSelectorTimeout() {
    if (selectorTimeout) {
      clearTimeout(selectorTimeout);
    }
    selectorTimeout = setTimeout(() => {
      showChannelSelector = false;
      selectedChannelIndex = playingChannelIndex;
      previewChannelIndex = null;
      previewProgram = null;
      previewUpcomingShows = [];
    }, 5000);
  }

  // Scroll to the currently selected channel
  function scrollToSelectedChannel(instant = true) {
    setTimeout(() => {
      const channelContainer = document.querySelector(".channels-horizontal");
      const selectedChannel = document.querySelector(".channel-item.selected");

      if (channelContainer && selectedChannel) {
        selectedChannel.scrollIntoView({
          behavior: instant ? "instant" : "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 10);
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

    // Scroll to selected channel when showing
    scrollToSelectedChannel();

    // Set auto-hide timeout
    resetSelectorTimeout();
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

      // Scroll to the newly selected channel if selector is visible
      if (showChannelSelector) {
        scrollToSelectedChannel(false);
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

  // Debounced channel change for Page Up/Down (2 second delay)
  function debouncedChannelChange() {
    if (channelChangeTimeout) {
      clearTimeout(channelChangeTimeout);
    }

    channelChangeTimeout = setTimeout(async () => {
      await selectCurrentChannel();
      channelChangeTimeout = null;
    }, 2000);
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
      if (targetChannel !== undefined && targetChannel < channels.length) {
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
        if (showChannelSelector) {
          resetSelectorTimeout();
        } else {
          showSelector();
        }
        break;
      case "ArrowRight":
      case "ArrowDown": // Also allow up/down for channel navigation
        event.preventDefault();
        navigateChannels(1);
        if (showChannelSelector) {
          resetSelectorTimeout();
        } else {
          showSelector();
        }
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
        if (selectedChannelIndex > 0) {
          selectedChannelIndex = selectedChannelIndex - 1;
          previewChannelIndex = selectedChannelIndex;
          updatePreviewEpg();
          if (!showChannelSelector) {
            showSelector();
          } else {
            scrollToSelectedChannel();
            resetSelectorTimeout();
          }
          debouncedChannelChange();
        }
        break;
      case "PageDown": // KEY_PAGEDOWN from keymap
        event.preventDefault();
        if (selectedChannelIndex < channels.length - 1) {
          selectedChannelIndex = selectedChannelIndex + 1;
          previewChannelIndex = selectedChannelIndex;
          updatePreviewEpg();
          if (!showChannelSelector) {
            showSelector();
          } else {
            scrollToSelectedChannel();
            resetSelectorTimeout();
          }
          debouncedChannelChange();
        }
        break;

      // Play/Pause toggle (p key from keymap handles both play and pause)
      case "p":
      case "P": // KEY_P from keymap
      case " ": // Also support spacebar
        event.preventDefault();
        if (mpvPlayer) {
          mpvPlayer.togglePlayPause();
        }
        break;
    }
  }
</script>

<svelte:head>
  <title>{currentChannelInfo?.name || "AntikTV"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
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
      <MPVPlayer
        bind:this={mpvPlayer}
        streamUrl={currentStreamUrl}
        autoplay={true}
        onStatusChange={handleMPVStatusChange}
        onError={handleMPVError}
        onLoadStart={() => {
          isVideoLoading = true;
        }}
        onCanPlay={() => {
          isVideoLoading = false;
          isVideoBuffering = false;
        }}
        onPlaying={() => {
          isVideoLoading = false;
          isVideoBuffering = false;
          playingChannelIndex = selectedChannelIndex;
        }}
        onWaiting={() => {
          isVideoBuffering = true;
        }}
      >
        <!-- Click handler for showing selector -->
        <div
          class="video-click-overlay"
          onclick={() => showSelector()}
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 10;"
        />
      </MPVPlayer>

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
      <div class="overlay-bottom" class:show={showChannelSelector}>
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
    </div>
  </main>
{/if}
