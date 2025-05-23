use tauri_plugin_sqlite::{Migration, MigrationKind};

pub fn init() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE knowledge_base (\
                id TEXT PRIMARY KEY,\
                name TEXT UNIQUE NOT NULL,\
                description TEXT,\
                embedding_model_id TEXT,\
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
        },
        Migration {
            version: 3,
            description: "create_chat_table",
            sql: "CREATE TABLE chat (\
                id TEXT PRIMARY KEY,\
                name TEXT NOT NULL,\
                prompts TEXT,\
                created_at DATETIME DEFAULT current_timestamp\
              );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_chat_history_table",
            sql: "CREATE TABLE chat_history (\
                id TEXT PRIMARY KEY,\
                chat_id TEXT NOT NULL,\
                content TEXT,\
                role TEXT NOT NULL,\
                status TEXT NOT NULL,
                created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S.%f', 'now'))\
              );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_preferences_table",
            sql: "CREATE TABLE preferences (\
                id TEXT PRIMARY KEY,\
                key TEXT UNIQUE NOT NULL,\
                type TEXT CHECK(type IN ('select', 'input', 'checkbox')) NOT NULL DEFAULT 'input',\
                value BLOB,\
                created_at DATETIME DEFAULT current_timestamp\
              );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_model_table",
            sql: "CREATE TABLE model (\
              id TEXT PRIMARY KEY,\
              name TEXT NOT NULL,\
              provider_id TEXT NOT NULL,\
              type TEXT NOT NULL,\
              active INTEGER CHECK(active IN (0, 1)) DEFAULT 0,\
              created_at DATETIME DEFAULT current_timestamp\
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "create_model_provider_table",
            sql: "CREATE TABLE model_provider (\
              id TEXT PRIMARY KEY,\
              name TEXT NOT NULL,\
              url TEXT NOT NULL,\
              api_key TEXT NOT NULL,\
              created_at DATETIME DEFAULT current_timestamp\
            );",
            kind: MigrationKind::Up,
        },
        Migration {
          version: 8,
          description: "create_chat_settings_table",
          sql: "CREATE TABLE chat_settings (\
            id TEXT PRIMARY KEY,\
            kb_ids TEXT NULL,\
            chat_model_id TEXT NOT NULL,\
            created_at DATETIME DEFAULT current_timestamp\
          );",
          kind: MigrationKind::Up,
      }
    ]
}
