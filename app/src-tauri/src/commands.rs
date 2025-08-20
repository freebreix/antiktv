use crate::mpv::{MPVPlayer, MPVStatus};
use std::sync::Arc;
use tauri::{AppHandle, State};
use std::sync::Mutex;

// Global MPV player instance
pub type MPVPlayerState = Arc<Mutex<Option<Arc<MPVPlayer>>>>;

#[tauri::command]
pub async fn initialize_mpv(app: AppHandle, state: State<'_, MPVPlayerState>) -> Result<bool, String> {
    let mpv_player = Arc::new(MPVPlayer::new(app));
    
    // Initialize embedded MPV with main window
    match mpv_player.initialize_embedded("main").await {
        Ok(_) => {
            let mut player_state = state.lock().unwrap();
            *player_state = Some(mpv_player);
            Ok(true)
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
pub async fn load_stream(stream_url: String, state: State<'_, MPVPlayerState>) -> Result<bool, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized. Call initialize_mpv first.".to_string());
        }
    };
    
    mpv_player.load_stream(stream_url)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn play(state: State<'_, MPVPlayerState>) -> Result<bool, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized".to_string());
        }
    };
    
    mpv_player.play()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn pause(state: State<'_, MPVPlayerState>) -> Result<bool, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized".to_string());
        }
    };
    
    mpv_player.pause()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn stop(state: State<'_, MPVPlayerState>) -> Result<bool, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized".to_string());
        }
    };
    
    mpv_player.stop()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_volume(volume: f64, state: State<'_, MPVPlayerState>) -> Result<bool, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized".to_string());
        }
    };
    
    mpv_player.set_volume(volume)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_status(state: State<'_, MPVPlayerState>) -> Result<MPVStatus, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized".to_string());
        }
    };
    
    mpv_player.get_status()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_current_url(state: State<'_, MPVPlayerState>) -> Result<Option<String>, String> {
    let mpv_player = {
        let player_guard = state.lock().unwrap();
        if let Some(ref player) = *player_guard {
            player.clone()
        } else {
            return Err("MPV not initialized".to_string());
        }
    };
    
    mpv_player.get_current_url()
        .await
        .map_err(|e| e.to_string())
}
