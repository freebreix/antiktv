// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;

// MPV player state management
#[derive(Default)]
struct AppState {
    mpv_process: std::sync::Mutex<Option<std::process::Child>>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn load_stream(stream_url: String, app_handle: tauri::AppHandle) -> Result<bool, String> {
    println!("Loading stream: {}", stream_url);
    
    // Kill existing MPV process if running
    let state = app_handle.state::<AppState>();
    if let Ok(mut mpv_guard) = state.mpv_process.lock() {
        if let Some(mut child) = mpv_guard.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }

    // Start new MPV process
    match Command::new("mpv")
        .arg("--no-terminal")
        .arg("--really-quiet")
        .arg("--force-window=yes")
        .arg("--keep-open=yes")
        .arg("--wid=0") // This would need to be set to the actual window handle
        .arg(&stream_url)
        .spawn()
    {
        Ok(child) => {
            if let Ok(mut mpv_guard) = state.mpv_process.lock() {
                *mpv_guard = Some(child);
            }
            
            // Emit status event
            app_handle.emit("mpv-status", serde_json::json!({
                "status": "started"
            })).unwrap();
            
            Ok(true)
        }
        Err(e) => {
            eprintln!("Failed to start MPV: {}", e);
            Err(format!("Failed to start MPV: {}", e))
        }
    }
}

#[tauri::command]
async fn play(app_handle: tauri::AppHandle) -> Result<bool, String> {
    println!("Play command");
    // In a real implementation, you would send IPC commands to MPV
    // For now, just emit a status event
    app_handle.emit("mpv-status", serde_json::json!({
        "status": "playing"
    })).unwrap();
    Ok(true)
}

#[tauri::command]
async fn pause(app_handle: tauri::AppHandle) -> Result<bool, String> {
    println!("Pause command");
    // In a real implementation, you would send IPC commands to MPV
    app_handle.emit("mpv-status", serde_json::json!({
        "status": "paused"
    })).unwrap();
    Ok(true)
}

#[tauri::command]
async fn stop(app_handle: tauri::AppHandle) -> Result<bool, String> {
    println!("Stop command");
    
    let state = app_handle.state::<AppState>();
    if let Ok(mut mpv_guard) = state.mpv_process.lock() {
        if let Some(mut child) = mpv_guard.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }
    
    app_handle.emit("mpv-status", serde_json::json!({
        "status": "stopped"
    })).unwrap();
    Ok(true)
}

#[tauri::command]
async fn set_volume(volume: f64, app_handle: tauri::AppHandle) -> Result<bool, String> {
    println!("Set volume: {}", volume);
    // In a real implementation, you would send volume commands to MPV
    Ok(true)
}

#[tauri::command]
async fn get_status() -> Result<serde_json::Value, String> {
    // In a real implementation, you would query MPV for current status
    Ok(serde_json::json!({
        "playing": false,
        "paused": false,
        "position": 0,
        "duration": 0
    }))
}

fn main() {
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            load_stream,
            play,
            pause,
            stop,
            set_volume,
            get_status
        ])
        .setup(|app| {
            let _window = app.get_webview_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
