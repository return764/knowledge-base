use tauri_plugin_sql::{Migration, MigrationKind};

pub fn init() -> Vec<Migration> {
    return vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE knowledge_base (id INTEGER PRIMARY KEY, name TEXT UNIQUE, created_at DATETIME DEFAULT current_timestamp);",
            kind: MigrationKind::Up,
        }
    ];
}
