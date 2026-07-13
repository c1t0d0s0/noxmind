use std::fs;

#[derive(serde::Serialize)]
pub struct OpenResult {
    path: String,
    content: String,
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
#[tauri::command]
async fn save_file_dialog(data: String) -> Result<Option<String>, String> {
    let file_path = rfd::AsyncFileDialog::new()
        .add_filter("JSON Mindmap", &["json"])
        .set_file_name("noxmind_mindmap.json")
        .save_file()
        .await;

    if let Some(file_handle) = file_path {
        let path = file_handle.path();
        fs::write(path, data).map_err(|e| e.to_string())?;
        Ok(Some(path.to_string_lossy().to_string()))
    } else {
        Ok(None)
    }
}

#[cfg(any(target_os = "android", target_os = "ios"))]
#[tauri::command]
async fn save_file_dialog(_data: String) -> Result<Option<String>, String> {
    Err("File dialogs are not supported on mobile".into())
}

#[tauri::command]
fn save_file(path: String, data: String) -> Result<(), String> {
    fs::write(&path, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
#[tauri::command]
async fn open_file_dialog() -> Result<Option<OpenResult>, String> {
    let file_path = rfd::AsyncFileDialog::new()
        .add_filter("Mindmap Files (*.json, *.mm, *.xmind)", &["json", "mm", "xmind"])
        .add_filter("JSON Mindmap (*.json)", &["json"])
        .add_filter("FreeMind Mindmap (*.mm)", &["mm"])
        .add_filter("XMind Mindmap (*.xmind)", &["xmind"])
        .pick_file()
        .await;

    if let Some(file_handle) = file_path {
        let path = file_handle.path();
        let path_str = path.to_string_lossy().to_string();
        let content = if path_str.to_lowercase().ends_with(".xmind") {
            let bytes = fs::read(path).map_err(|e| e.to_string())?;
            base64_encode(&bytes)
        } else {
            fs::read_to_string(path).map_err(|e| e.to_string())?
        };
        Ok(Some(OpenResult {
            path: path_str,
            content,
        }))
    } else {
        Ok(None)
    }
}

#[cfg(any(target_os = "android", target_os = "ios"))]
#[tauri::command]
async fn open_file_dialog() -> Result<Option<OpenResult>, String> {
    Err("File dialogs are not supported on mobile".into())
}

fn base64_encode(bytes: &[u8]) -> String {
    const CHARSET: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut result = String::with_capacity((bytes.len() + 2) / 3 * 4);
    for chunk in bytes.chunks(3) {
        match chunk.len() {
            3 => {
                let b0 = chunk[0] as usize;
                let b1 = chunk[1] as usize;
                let b2 = chunk[2] as usize;
                result.push(CHARSET[b0 >> 2] as char);
                result.push(CHARSET[((b0 & 0x03) << 4) | (b1 >> 4)] as char);
                result.push(CHARSET[((b1 & 0x0f) << 2) | (b2 >> 6)] as char);
                result.push(CHARSET[b2 & 0x3f] as char);
            }
            2 => {
                let b0 = chunk[0] as usize;
                let b1 = chunk[1] as usize;
                result.push(CHARSET[b0 >> 2] as char);
                result.push(CHARSET[((b0 & 0x03) << 4) | (b1 >> 4)] as char);
                result.push(CHARSET[(b1 & 0x0f) << 2] as char);
                result.push('=');
            }
            1 => {
                let b0 = chunk[0] as usize;
                result.push(CHARSET[b0 >> 2] as char);
                result.push(CHARSET[(b0 & 0x03) << 4] as char);
                result.push('=');
                result.push('=');
            }
            _ => unreachable!(),
        }
    }
    result
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      save_file_dialog,
      save_file,
      open_file_dialog
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
