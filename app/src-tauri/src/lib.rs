mod mpv;
mod commands;

use commands::*;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      
      Ok(())
    })
    .manage(MPVPlayerState::new(Mutex::new(None)))
    .invoke_handler(tauri::generate_handler![
      initialize_mpv,
      load_stream,
      play,
      pause,
      stop,
      set_volume,
      get_status,
      get_current_url
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
