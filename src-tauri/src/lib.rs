mod sql;
use tauri::{WebviewUrl, WebviewWindowBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:knowledge_keeper.db", sql::migration::init()).build())
        .setup(|app| {
            let win_builder =
                WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                    .hidden_title(true)
                    .resizable(true)
                    .fullscreen(false)
                    .min_inner_size(400.0, 300.0)
                    .inner_size(800.0, 600.0);

            // // 仅在 macOS 时设置透明标题栏
            // #[cfg(target_os = "macos")]
            // let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

            let window = win_builder.build().unwrap();

            // 仅在构建 macOS 时设置标题栏透明
            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSWindow, NSWindowStyleMask, NSWindowTitleVisibility};
                use cocoa::base::{id, YES};

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    let mut style_mask = ns_window.styleMask();
                    style_mask.set(
                        NSWindowStyleMask::NSFullSizeContentViewWindowMask,
                        true,
                    );
                    ns_window.setStyleMask_(style_mask);
                    ns_window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
                    ns_window.setTitlebarAppearsTransparent_(YES);
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
