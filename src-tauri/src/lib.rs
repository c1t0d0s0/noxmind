use std::fs;

#[derive(serde::Serialize)]
pub struct OpenResult {
    path: String,
    content: String,
}

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

#[tauri::command]
fn save_file(path: String, data: String) -> Result<(), String> {
    fs::write(&path, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn open_file_dialog() -> Result<Option<OpenResult>, String> {
    let file_path = rfd::AsyncFileDialog::new()
        .add_filter("Mindmap Files (*.json, *.mm)", &["json", "mm"])
        .add_filter("JSON Mindmap (*.json)", &["json"])
        .add_filter("FreeMind Mindmap (*.mm)", &["mm"])
        .pick_file()
        .await;

    if let Some(file_handle) = file_path {
        let path = file_handle.path();
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        Ok(Some(OpenResult {
            path: path.to_string_lossy().to_string(),
            content,
        }))
    } else {
        Ok(None)
    }
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
