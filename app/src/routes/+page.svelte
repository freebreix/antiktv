<script lang="ts">
  import { onMount } from "svelte";

  let videoElement: HTMLVideoElement;
  let loading = $state(true);
  let error = $state<string | null>(null);
  let streamUrl = $state<string | null>(null);
  let channelName = $state<string>("");
  let dashPlayer: any = null;
  let playerInitializing = $state(false);
  let playerInitialized = $state(false);

  onMount(async () => {
    try {
      // Load dash.js library
      await loadDashJS();

      // Get RTL stream URL from our test endpoint
      const response = await fetch("/api/test");
      const data = await response.json();

      if (data.success) {
        const rtlTest = data.results.tests.find(
          (test: any) => test.name === "RTL Channel Stream"
        );
        if (rtlTest && rtlTest.data?.stream?.url) {
          streamUrl = rtlTest.data.stream.url;
          channelName = rtlTest.data.channel.name;
          console.log("🎬 Loading RTL stream:", streamUrl);
        } else {
          error = "RTL channel stream not available";
        }
      } else {
        error = "Failed to get stream information";
      }
    } catch (err) {
      error = `Failed to load stream: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      loading = false;
    }
  });

  // Effect to initialize player once both streamUrl and videoElement are available
  $effect(() => {
    if (
      streamUrl &&
      videoElement &&
      !loading &&
      !error &&
      !playerInitializing &&
      !playerInitialized
    ) {
      console.log("🎬 About to call loadPlayer()...");
      console.log(
        "🎬 Effect - streamUrl:",
        !!streamUrl,
        "videoElement:",
        !!videoElement,
        "loading:",
        loading,
        "error:",
        !!error,
        "playerInitializing:",
        playerInitializing,
        "playerInitialized:",
        playerInitialized
      );

      playerInitializing = true;
      loadPlayer()
        .then(() => {
          console.log("🎬 loadPlayer() completed");
          playerInitializing = false;
          playerInitialized = true;
        })
        .catch((err) => {
          console.error("🎬 loadPlayer() failed:", err);
          playerInitializing = false;
          error = `Player initialization failed: ${err instanceof Error ? err.message : String(err)}`;
        });
    } else {
      console.log(
        "🎬 Effect - Not ready yet - streamUrl:",
        !!streamUrl,
        "videoElement:",
        !!videoElement,
        "loading:",
        loading,
        "error:",
        !!error,
        "playerInitializing:",
        playerInitializing,
        "playerInitialized:",
        playerInitialized
      );
    }
  });

  // Debug effect to track videoElement changes
  $effect(() => {
    console.log("🎬 VideoElement state changed:", !!videoElement);
  });

  async function loadDashJS() {
    console.log("🎬 Loading dash.js library...");
    return new Promise((resolve, reject) => {
      if ((window as any).dashjs) {
        console.log("🎬 ✅ dash.js already loaded");
        resolve(true);
        return;
      }

      console.log("🎬 📥 Loading dash.js from CDN...");
      const script = document.createElement("script");
      script.src = "https://cdn.dashjs.org/latest/dash.all.min.js";
      script.onload = () => {
        console.log("🎬 ✅ dash.js loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("🎬 ❌ Failed to load dash.js");
        reject(new Error("Failed to load dash.js"));
      };
      document.head.appendChild(script);
    });
  }

  async function loadPlayer() {
    console.log("🎬 loadPlayer called");
    console.log("🎬 streamUrl:", streamUrl);
    console.log("🎬 videoElement:", videoElement);
    console.log("🎬 videoElement type:", typeof videoElement);
    console.log(
      "🎬 videoElement instanceof HTMLVideoElement:",
      videoElement instanceof HTMLVideoElement
    );

    if (!streamUrl || !videoElement) {
      console.error(
        "🎬 ❌ Missing requirements - streamUrl:",
        !!streamUrl,
        "videoElement:",
        !!videoElement
      );
      return;
    }

    // Wait a bit to ensure video element is fully ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      console.log("🎬 Initializing DASH player with DRM for:", streamUrl);

      // Create dash.js player
      const dashjs = (window as any).dashjs;
      console.log("🎬 dashjs available:", !!dashjs);

      if (dashjs) {
        console.log("🎬 Creating MediaPlayer...");
        dashPlayer = dashjs.MediaPlayer().create();
        console.log("🎬 MediaPlayer created:", !!dashPlayer);

        // Enable debug logging (check if method exists)
        console.log("🎬 Enabling debug logging...");
        try {
          if (
            dashPlayer.getDebug &&
            dashPlayer.getDebug().setLogToBrowserConsole
          ) {
            dashPlayer.getDebug().setLogToBrowserConsole(true);
          } else {
            console.log(
              "🎬 Debug logging method not available in this dash.js version"
            );
          }
        } catch (debugError) {
          console.log("🎬 Could not enable debug logging:", debugError.message);
        }

        // Set up DRM event listeners
        console.log("🎬 Setting up DRM event listeners...");
        console.log(
          "🎬 Available events:",
          Object.keys(dashjs.MediaPlayer.events || {})
        );

        try {
          dashPlayer.on("protectioncreated", (e: any) => {
            console.log("🔐 ✅ DRM Protection created:", e);
          });

          dashPlayer.on("protectiondestroyed", (e: any) => {
            console.log("🔐 DRM Protection destroyed:", e);
          });

          dashPlayer.on("keyError", (e: any) => {
            console.error("🔐 ❌ DRM Key error:", e);
            error = `DRM Key error: ${e.error || "Failed to get license"}`;
          });

          dashPlayer.on("keyMessage", (e: any) => {
            console.log("🔐 📄 DRM Key message:", e);
            console.log("🔐 Key message details:", {
              messageType: e.messageType,
              sessionToken: e.sessionToken,
              message: e.message ? "Present" : "Missing",
            });
          });

          dashPlayer.on("keyAdded", (e: any) => {
            console.log("🔐 ✅ DRM Key added successfully:", e);
          });

          dashPlayer.on("keySessionCreated", (e: any) => {
            console.log("🔐 📝 DRM Key session created:", e);
          });

          dashPlayer.on("keySessionClosed", (e: any) => {
            console.log("🔐 📝 DRM Key session closed:", e);
          });

          dashPlayer.on("licenseRequestComplete", (e: any) => {
            console.log("🔐 📡 License request completed:", e);
          });

          dashPlayer.on("playbackStarted", () => {
            console.log("🎬 ✅ DASH stream with DRM started successfully");
          });

          dashPlayer.on("error", (e: any) => {
            console.error("🎬 ❌ DASH player error:", e);
            error = `DASH player error: ${e.error || "Unknown error"}`;
          });

          dashPlayer.on("streamInitialized", () => {
            console.log("🎬 📺 Stream initialized");
          });

          dashPlayer.on("manifestLoaded", () => {
            console.log("🎬 📄 Manifest loaded");
          });

          console.log("🎬 ✅ Event listeners set up successfully");
        } catch (eventError) {
          console.error("🎬 Event listener setup error:", eventError);
          // Continue without events if they fail
        }

        // Initialize player with the video element and stream URL FIRST
        console.log(
          "🎬 Initializing player with video element and stream URL..."
        );
        dashPlayer.initialize(videoElement, streamUrl, true);
        console.log(
          "🎬 DASH player initialized, now setting up DRM protection..."
        );

        // Configure DRM protection AFTER initializing (as per official examples)
        const protectionData = {
          "com.widevine.alpha": {
            serverURL: "http://localhost:5173/api/drm-proxy", // Use full URL to our proxy
            httpRequestHeaders: {
              "Content-Type": "application/octet-stream",
            },
            withCredentials: false,
            priority: 0,
          },
        };

        console.log("🔐 Setting up DRM protection:", protectionData);
        dashPlayer.setProtectionData(protectionData);
        console.log("🎬 DASH player with DRM setup completed");
      } else {
        console.error("🎬 ❌ dash.js not available, cannot play DRM content");
        error = "dash.js library required for DRM content";
      }
    } catch (playError) {
      console.error("🎬 Playback error:", playError);
      error = `Playback failed: ${playError instanceof Error ? playError.message : String(playError)}`;
    }
  }

  function retry() {
    error = null;
    loading = true;
    playerInitializing = false;
    playerInitialized = false;
    dashPlayer = null;
    window.location.reload();
  }
</script>

<svelte:head>
  <title>AntikTV - {channelName || "RTL"}</title>
</svelte:head>

<main class="player-container">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading RTL stream...</p>
    </div>
  {:else if error}
    <div class="error">
      <h2>❌ Stream Error</h2>
      <p>{error}</p>
      <button onclick={retry}>Retry</button>
    </div>
  {:else}
    <div class="video-wrapper">
      <h1 class="channel-title">📺 {channelName}</h1>
      <video
        bind:this={videoElement}
        controls
        autoplay
        muted
        class="main-video"
        poster="/favicon.png"
        onloadedmetadata={() => console.log("🎬 Video element loaded metadata")}
        oncanplay={() => console.log("🎬 Video element can play")}
        onerror={(e) => console.error("🎬 Video element error:", e)}
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
      <div class="stream-info">
        <small>Stream: {streamUrl}</small>
        <br />
        <small
          >Video Element: {videoElement ? "✅ Ready" : "❌ Not Ready"}</small
        >
        <br />
        <small
          >DASH Player: {dashPlayer
            ? "✅ Initialized"
            : "❌ Not Initialized"}</small
        >
      </div>
    </div>
  {/if}
</main>

<style>
  .player-container {
    min-height: 100vh;
    background: #000;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  }

  .loading {
    text-align: center;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #333;
    border-top: 3px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error {
    text-align: center;
    background: #2a1f1f;
    padding: 40px;
    border-radius: 10px;
    border: 2px solid #ff4444;
  }

  .error h2 {
    margin-top: 0;
    color: #ff6666;
  }

  .error button {
    background: #ff4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }

  .error button:hover {
    background: #ff6666;
  }

  .video-wrapper {
    width: 100%;
    max-width: 1200px;
  }

  .channel-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .main-video {
    width: 100%;
    height: auto;
    min-height: 400px;
    background: #111;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .stream-info {
    text-align: center;
    margin-top: 10px;
    opacity: 0.7;
  }

  .stream-info small {
    font-size: 0.8rem;
    word-break: break-all;
  }

  @media (max-width: 768px) {
    .player-container {
      padding: 10px;
    }

    .channel-title {
      font-size: 1.5rem;
    }

    .main-video {
      min-height: 250px;
    }
  }
</style>
