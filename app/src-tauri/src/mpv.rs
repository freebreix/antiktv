use std::sync::{Arc, Mutex};
use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};
use tokio::time::{sleep, Duration};
use libmpv::Mpv;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MPVStatus {
    pub status: String,
    pub error: Option<String>,
    pub position: Option<f64>,
    pub duration: Option<f64>,
}

pub struct MPVPlayer {
    mpv: Arc<Mutex<Option<Mpv>>>,
    app_handle: AppHandle,
    current_url: Arc<Mutex<Option<String>>>,
}

// Manual Debug implementation since Mpv doesn't implement Debug
impl std::fmt::Debug for MPVPlayer {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("MPVPlayer")
            .field("current_url", &self.current_url)
            .finish()
    }
}

impl MPVPlayer {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            mpv: Arc::new(Mutex::new(None)),
            app_handle,
            current_url: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn initialize_embedded(&self, window_label: &str) -> Result<bool> {
        log::info!("Initializing embedded MPV player for window: {}", window_label);
        
        // Get the window handle for embedding
        #[cfg(target_os = "windows")]
        let window_handle = {
            if let Some(window) = self.app_handle.get_webview_window(window_label) {
                match window.hwnd() {
                    Ok(handle) => Some(handle.0 as i64),
                    Err(e) => {
                        log::warn!("Could not get window handle for embedding: {}", e);
                        None
                    }
                }
            } else {
                log::warn!("Could not find window: {}", window_label);
                None
            }
        };
        
        #[cfg(not(target_os = "windows"))]
        let window_handle: Option<i64> = None;

        // Initialize libmpv
        let mpv = Mpv::new().map_err(|e| anyhow!("Failed to create MPV instance: {}", e))?;
        
        // Set MPV options for embedding and performance
        mpv.set_property("hwdec", "auto").map_err(|e| anyhow!("Failed to set hwdec: {}", e))?;
        mpv.set_property("vo", "gpu").map_err(|e| anyhow!("Failed to set video output: {}", e))?;
        mpv.set_property("keep-open", "yes").map_err(|e| anyhow!("Failed to set keep-open: {}", e))?;
        
        // Try to embed in window if we have a handle
        if let Some(hwnd) = window_handle {
            mpv.set_property("wid", hwnd).map_err(|e| anyhow!("Failed to set window ID: {}", e))?;
            log::info!("MPV embedded in window with handle: {}", hwnd);
        } else {
            // Fallback: positioned window
            mpv.set_property("geometry", "800x450+100+100").map_err(|e| anyhow!("Failed to set geometry: {}", e))?;
            mpv.set_property("title", "AntikTV Player").map_err(|e| anyhow!("Failed to set title: {}", e))?;
            log::info!("MPV using positioned window as fallback");
        }
        
        // Store the MPV instance
        {
            let mut mpv_guard = self.mpv.lock().unwrap();
            *mpv_guard = Some(mpv);
        }
        
        log::info!("MPV initialized successfully");
        Ok(true)
    }

    pub async fn load_stream(&self, stream_url: String) -> Result<bool> {
        log::info!("Loading stream: {}", stream_url);
        
        // Store the current URL
        {
            let mut current_url = self.current_url.lock().unwrap();
            *current_url = Some(stream_url.clone());
        }
        
        // Load the stream
        let result = {
            let mpv_guard = self.mpv.lock().unwrap();
            if let Some(ref mpv) = *mpv_guard {
                mpv.command("loadfile", &[&stream_url]).map_err(|e| anyhow!("Failed to load stream: {}", e))
            } else {
                Err(anyhow!("MPV not initialized. Call initialize_embedded first."))
            }
        };
        
        match result {
            Ok(_) => {
                // Emit status update
                let status = MPVStatus {
                    status: "loading".to_string(),
                    error: None,
                    position: Some(0.0),
                    duration: None,
                };
                
                if let Err(e) = self.app_handle.emit("mpv-status", &status) {
                    log::error!("Failed to emit MPV status: {}", e);
                }
                
                // Wait a moment and then emit playing status
                tokio::spawn({
                    let app_handle = self.app_handle.clone();
                    async move {
                        sleep(Duration::from_millis(2000)).await;
                        let playing_status = MPVStatus {
                            status: "playing".to_string(),
                            error: None,
                            position: Some(0.0),
                            duration: None,
                        };
                        let _ = app_handle.emit("mpv-status", &playing_status);
                    }
                });
                
                Ok(true)
            },
            Err(e) => {
                log::error!("{}", e);
                
                let status = MPVStatus {
                    status: "error".to_string(),
                    error: Some(e.to_string()),
                    position: None,
                    duration: None,
                };
                
                if let Err(emit_err) = self.app_handle.emit("mpv-status", &status) {
                    log::error!("Failed to emit MPV error status: {}", emit_err);
                }
                
                Err(e)
            }
        }
    }

    pub async fn play(&self) -> Result<bool> {
        log::info!("MPV play command");
        
        let result = {
            let mpv_guard = self.mpv.lock().unwrap();
            if let Some(ref mpv) = *mpv_guard {
                mpv.set_property("pause", false).map_err(|e| anyhow!("Failed to play: {}", e))
            } else {
                Err(anyhow!("MPV not initialized"))
            }
        };
        
        match result {
            Ok(_) => {
                let status = MPVStatus {
                    status: "playing".to_string(),
                    error: None,
                    position: None,
                    duration: None,
                };
                
                if let Err(e) = self.app_handle.emit("mpv-status", &status) {
                    log::error!("Failed to emit MPV play status: {}", e);
                }
                
                Ok(true)
            },
            Err(e) => Err(e)
        }
    }

    pub async fn pause(&self) -> Result<bool> {
        log::info!("MPV pause command");
        
        let result = {
            let mpv_guard = self.mpv.lock().unwrap();
            if let Some(ref mpv) = *mpv_guard {
                mpv.set_property("pause", true).map_err(|e| anyhow!("Failed to pause: {}", e))
            } else {
                Err(anyhow!("MPV not initialized"))
            }
        };
        
        match result {
            Ok(_) => {
                let status = MPVStatus {
                    status: "paused".to_string(),
                    error: None,
                    position: None,
                    duration: None,
                };
                
                if let Err(e) = self.app_handle.emit("mpv-status", &status) {
                    log::error!("Failed to emit MPV pause status: {}", e);
                }
                
                Ok(true)
            },
            Err(e) => Err(e)
        }
    }

    pub async fn stop(&self) -> Result<bool> {
        log::info!("MPV stop command");
        
        let result = {
            let mpv_guard = self.mpv.lock().unwrap();
            if let Some(ref mpv) = *mpv_guard {
                mpv.command("stop", &[]).map_err(|e| anyhow!("Failed to stop: {}", e))
            } else {
                Err(anyhow!("MPV not initialized"))
            }
        };
        
        match result {
            Ok(_) => {
                let status = MPVStatus {
                    status: "stopped".to_string(),
                    error: None,
                    position: Some(0.0),
                    duration: None,
                };
                
                if let Err(e) = self.app_handle.emit("mpv-status", &status) {
                    log::error!("Failed to emit MPV stop status: {}", e);
                }
                
                Ok(true)
            },
            Err(e) => Err(e)
        }
    }

    pub async fn set_volume(&self, volume: f64) -> Result<bool> {
        log::info!("Setting volume to: {}", volume);
        
        let result = {
            let mpv_guard = self.mpv.lock().unwrap();
            if let Some(ref mpv) = *mpv_guard {
                mpv.set_property("volume", volume).map_err(|e| anyhow!("Failed to set volume: {}", e))
            } else {
                Err(anyhow!("MPV not initialized"))
            }
        };
        
        result.map(|_| true)
    }

    pub async fn get_status(&self) -> Result<MPVStatus> {
        let result = {
            let mpv_guard = self.mpv.lock().unwrap();
            if let Some(ref mpv) = *mpv_guard {
                let paused: bool = mpv.get_property("pause").unwrap_or(false);
                let position: f64 = mpv.get_property("time-pos").unwrap_or(0.0);
                let duration: f64 = mpv.get_property("duration").unwrap_or(0.0);
                
                let status_str = if paused { "paused" } else { "playing" };
                
                Ok(MPVStatus {
                    status: status_str.to_string(),
                    error: None,
                    position: Some(position),
                    duration: Some(duration),
                })
            } else {
                Ok(MPVStatus {
                    status: "stopped".to_string(),
                    error: None,
                    position: Some(0.0),
                    duration: Some(0.0),
                })
            }
        };
        
        result
    }

    pub async fn get_current_url(&self) -> Result<Option<String>> {
        let current_url = self.current_url.lock().unwrap();
        Ok(current_url.clone())
    }
}
