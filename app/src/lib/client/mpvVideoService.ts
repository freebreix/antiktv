/**
 * MPV Video Service for Tauri
 * Provides a unified interface for video playback using MPV through Tauri commands
 */

export class MPVVideoService {
  private isTauri: boolean = false;
  private currentStreamUrl: string | null = null;
  private currentStatus: any = {
    playing: false,
    paused: false,
    loading: false,
    buffering: false,
    position: 0,
    duration: 0,
    error: null
  };
  private statusCallbacks: Set<(status: any) => void> = new Set();
  private positionCallbacks: Set<(position: number) => void> = new Set();

  constructor() {
    // Check if we're running in Tauri (multiple detection methods)
    this.isTauri = typeof window !== 'undefined' && (
      '__TAURI__' in window || 
      '__TAURI_INTERNALS__' in window ||
      'isTauri' in window ||
      // Check for Tauri-specific user agent or other indicators
      (typeof navigator !== 'undefined' && navigator.userAgent.includes('Tauri')) ||
      // Check if we can import Tauri API (this is the most reliable)
      this.detectTauriAsync()
    );
    
    if (this.isTauri) {
      console.log('🦀 Tauri detected, setting up event listeners...');
      this.setupEventListeners();
    } else {
      console.warn('🦀 Tauri not detected initially. Will try async detection...');
      // Try async detection
      this.detectAndSetup();
    }
  }

  private detectTauriAsync(): boolean {
    // This is a synchronous check, but we'll also do async
    try {
      // In Tauri, there should be some global indication
      return false; // We'll rely on async detection
    } catch {
      return false;
    }
  }

  private async detectAndSetup(): Promise<void> {
    try {
      // Try to import Tauri API - this is the most reliable method
      const { invoke } = await import('@tauri-apps/api/core');
      console.log('🦀 Tauri API import successful - Tauri detected!');
      this.isTauri = true;
      
      // Initialize embedded MPV
      try {
        await invoke('initialize_mpv') as boolean;
        console.log('🦀 MPV initialized successfully');
      } catch (error) {
        console.error('🦀 Failed to initialize MPV:', error);
      }
      
      this.setupEventListeners();
    } catch (error) {
      console.warn('🦀 Tauri API import failed:', error);
      this.isTauri = false;
    }
  }

  private async setupEventListeners() {
    if (!this.isTauri) return;

    try {
      // Import Tauri API dynamically
      const { listen } = await import('@tauri-apps/api/event');
      
      // Listen for MPV status changes
      await listen('mpv-status', (event: any) => {
        console.log('📺 MPV Status:', event.payload);
        
        switch (event.payload.status) {
          case 'started':
            this.currentStatus = {
              ...this.currentStatus,
              playing: true,
              paused: false,
              loading: false,
              buffering: false,
              error: null
            };
            break;
          case 'stopped':
            this.currentStatus = {
              ...this.currentStatus,
              playing: false,
              paused: false,
              loading: false,
              buffering: false
            };
            break;
          case 'paused':
            this.currentStatus = {
              ...this.currentStatus,
              playing: false,
              paused: true,
              loading: false,
              buffering: false
            };
            break;
          case 'playing':
            this.currentStatus = {
              ...this.currentStatus,
              playing: true,
              paused: false,
              loading: false,
              buffering: false,
              error: null
            };
            break;
          case 'error':
            this.currentStatus = {
              ...this.currentStatus,
              playing: false,
              loading: false,
              buffering: false,
              error: event.payload.error || 'Unknown error'
            };
            break;
        }

        this.notifyStatusChange();
      });

      // Listen for time position updates
      await listen('mpv-timeposition', (event: any) => {
        this.currentStatus.position = event.payload.position;
        this.notifyPositionChange(event.payload.position);
      });

      // Listen for seek events
      await listen('mpv-seek', (event: any) => {
        this.currentStatus.position = event.payload.position;
        this.notifyPositionChange(event.payload.position);
      });
    } catch (error) {
      console.error('Failed to setup Tauri event listeners:', error);
    }
  }

  private notifyStatusChange() {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(this.currentStatus);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  private notifyPositionChange(position: number) {
    this.positionCallbacks.forEach(callback => {
      try {
        callback(position);
      } catch (error) {
        console.error('Error in position callback:', error);
      }
    });
  }

  /**
   * Load and play a stream URL
   */
  async loadStream(streamUrl: string): Promise<boolean> {
    if (!this.isTauri) {
      console.error('MPV service not available - not running in Tauri');
      return false;
    }

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      
      console.log('📺 Loading stream:', streamUrl);
      
      this.currentStreamUrl = streamUrl;
      this.currentStatus.loading = true;
      this.currentStatus.error = null;
      this.notifyStatusChange();

      const result = await invoke('load_stream', { streamUrl }) as boolean;
      
      if (result) {
        console.log('📺 Stream loaded successfully');
        return true;
      } else {
        console.error('📺 Failed to load stream');
        this.currentStatus.loading = false;
        this.currentStatus.error = 'Failed to load stream';
        this.notifyStatusChange();
        return false;
      }
    } catch (error) {
      console.error('📺 Error loading stream:', error);
      this.currentStatus.loading = false;
      this.currentStatus.error = error instanceof Error ? error.message : String(error);
      this.notifyStatusChange();
      return false;
    }
  }

  /**
   * Play/resume playback
   */
  async play(): Promise<boolean> {
    if (!this.isTauri) return false;

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('play') as boolean;
      return result;
    } catch (error) {
      console.error('📺 Error playing:', error);
      return false;
    }
  }

  /**
   * Pause playback
   */
  async pause(): Promise<boolean> {
    if (!this.isTauri) return false;

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('pause') as boolean;
      return result;
    } catch (error) {
      console.error('📺 Error pausing:', error);
      return false;
    }
  }

  /**
   * Stop playback
   */
  async stop(): Promise<boolean> {
    if (!this.isTauri) return false;

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('stop') as boolean;
      this.currentStreamUrl = null;
      return result;
    } catch (error) {
      console.error('📺 Error stopping:', error);
      return false;
    }
  }

  /**
   * Set volume (0-100)
   */
  async setVolume(volume: number): Promise<boolean> {
    if (!this.isTauri) return false;

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const clampedVolume = Math.max(0, Math.min(100, volume));
      const result = await invoke('set_volume', { volume: clampedVolume }) as boolean;
      return result;
    } catch (error) {
      console.error('📺 Error setting volume:', error);
      return false;
    }
  }

  /**
   * Get current playback status
   */
  async getStatus(): Promise<any> {
    if (!this.isTauri) {
      return this.currentStatus;
    }

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('get_status') as any;
      if (result) {
        this.currentStatus = {
          ...this.currentStatus,
          ...result
        };
      }
      return this.currentStatus;
    } catch (error) {
      console.error('📺 Error getting status:', error);
      return this.currentStatus;
    }
  }

  /**
   * Subscribe to status changes
   */
  onStatusChange(callback: (status: any) => void): () => void {
    this.statusCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to position changes
   */
  onPositionChange(callback: (position: number) => void): () => void {
    this.positionCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.positionCallbacks.delete(callback);
    };
  }

  /**
   * Toggle play/pause
   */
  async togglePlayPause(): Promise<boolean> {
    if (this.currentStatus.playing) {
      return await this.pause();
    } else {
      return await this.play();
    }
  }

  /**
   * Check if we're running in Tauri with MPV support
   */
  isSupported(): boolean {
    console.log('🔍 MPV Support Check:', {
      isTauri: this.isTauri,
      hasWindow: typeof window !== 'undefined',
      windowKeys: typeof window !== 'undefined' ? Object.keys(window).filter(k => k.includes('TAURI')).slice(0, 5) : [],
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'No navigator'
    });
    return this.isTauri;
  }

  /**
   * Get current stream URL
   */
  getCurrentStreamUrl(): string | null {
    return this.currentStreamUrl;
  }

  /**
   * Debug function to test Tauri connection
   */
  async testTauriConnection(): Promise<void> {
    console.log('🧪 Testing Tauri connection...');
    console.log('Initial isTauri state:', this.isTauri);
    console.log('Available window properties:', Object.keys(window).filter(k => k.includes('TAURI') || k.includes('tauri')));
    
    // Try async detection first
    await this.detectAndSetup();
    console.log('After async detection, isTauri:', this.isTauri);
    
    if (!this.isTauri) {
      console.error('❌ Tauri not detected even after async test');
      return;
    }

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      console.log('✅ Tauri API imported successfully');
      
      // Test a simple command
      const status = await invoke('get_status') as any;
      console.log('✅ Tauri command executed successfully:', status);
      
    } catch (error) {
      console.error('❌ Tauri connection test failed:', error);
    }
  }

  /**
   * Cleanup - remove all listeners
   */
  cleanup() {
    this.statusCallbacks.clear();
    this.positionCallbacks.clear();
  }
}

// Export singleton instance
export const mpvVideoService = new MPVVideoService();

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).mpvVideoService = mpvVideoService;
}
