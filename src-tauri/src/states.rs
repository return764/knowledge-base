use std::str::FromStr;
use langchain_rust::embedding::OllamaEmbedder;
use langchain_rust::vectorstore::sqlite_vec::{Store, StoreBuilder};
use sqlx::{Pool, Sqlite};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};



pub struct SqlPoolContext {
    pub pool: Pool<Sqlite>,
    pub store: Store
}


impl SqlPoolContext {
    pub async fn new(db_path: &str) -> Self {
        let pool = SqlitePoolOptions::new()
        .connect_with(
            SqliteConnectOptions::from_str(db_path).unwrap()
            .create_if_missing(true)
            .extension("vec0")
        ).await.unwrap();

        let ollama = OllamaEmbedder::default().with_model("nomic-embed-text");
        let store = StoreBuilder::new()
            .embedder(ollama)
            .connection_url(db_path)
            .vector_dimensions(768)
            .build()
            .await.unwrap();
        store.initialize().await.unwrap();

        SqlPoolContext {
            pool: pool,
            store: store
        }
    }
}