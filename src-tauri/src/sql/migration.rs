use tauri_plugin_sql::{Migration, MigrationKind};

pub fn init() -> Vec<Migration> {
    return vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE knowledge_base (\
                id TEXT PRIMARY KEY,\
                name TEXT UNIQUE NOT NULL,\
                description TEXT,\
                embedder_model_id TEXT,\
                language_model_id TEXT,\
                created_at DATETIME DEFAULT current_timestamp\
              );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_dataset_tables",
            sql: "CREATE TABLE dataset (\
                id TEXT PRIMARY KEY,\
                name TEXT NOT NULL,\
                kb_id TEXT NOT NULL,\
                count INTEGER DEFAULT 0,\
                active INTEGER CHECK(active IN (0, 1)) DEFAULT 1,\
                created_at DATETIME DEFAULT current_timestamp\
              );",
            kind: MigrationKind::Up,
        }
    ];
}
