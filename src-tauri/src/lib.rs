mod command;
mod model;
mod service;
mod sql;
mod states;

use command::commands::init_vec_db;
use states::SqlPoolContext;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tokio::runtime::Runtime;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // {
    //     use sqlite_vec::sqlite3_vec_init;
    //     use libsqlite3_sys::{sqlite3_api_routines, sqlite3_auto_extension, sqlite3};
    //     use std::os::raw::c_char;
    //
    //     unsafe {
    //         let vec_vector_init = sqlite3_vec_init as *const ();
    //         let vec_vector_init_correct: extern "C" fn(
    //             db: *mut sqlite3,
    //             pzErrMsg: *mut *const c_char,
    //             pThunk: *const sqlite3_api_routines,
    //         ) -> i32 = std::mem::transmute(vec_vector_init);
    //         sqlite3_auto_extension(Some(vec_vector_init_correct));
    //     }
    // }

    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            init_vec_db
        ])
        .plugin(
            tauri_plugin_sqlite::Builder::default()
                .add_migrations("sqlite:knowledge_keeper.db", sql::migration::init())
                .build(),
        )
        .setup(|app| {
            let db_path = &format!(
                "sqlite:{}/knowledge_keeper.db",
                app.path().app_config_dir().unwrap().to_str().unwrap()
            );
            let sqlconext = Runtime::new()
                .unwrap()
                .block_on(SqlPoolContext::new(db_path));
            app.manage(sqlconext);

            let mut win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .resizable(true)
                .fullscreen(false)
                .min_inner_size(400.0, 300.0)
                .inner_size(800.0, 600.0);

            #[cfg(target_os = "macos")]
            {
                win_builder = win_builder.hidden_title(true);
            }

            #[cfg(target_os = "windows")]
            {
                win_builder = win_builder.decorations(false);
            }

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
                    style_mask.set(NSWindowStyleMask::NSFullSizeContentViewWindowMask, true);
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
