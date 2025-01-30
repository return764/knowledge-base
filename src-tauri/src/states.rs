use std::str::FromStr;
use langchain_rust::embedding::openai::OpenAiEmbedder;
use langchain_rust::llm::OpenAIConfig;
use langchain_rust::vectorstore::sqlite_vec::{Store, StoreBuilder};
use sqlx::{Pool, Sqlite};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};



pub struct SqlPoolContext {
    pub pool: Pool<Sqlite>,
    pub db_path: String
}


impl SqlPoolContext {
    pub async fn new(db_path: &str) -> Self {
        let pool = SqlitePoolOptions::new()
        .connect_with(
            SqliteConnectOptions::from_str(db_path).unwrap()
            .create_if_missing(true)
            .extension("vec0")
        ).await.unwrap();

        let embedder = OpenAiEmbedder::default()
            .with_model("nomic-embed-text")
            .with_config(OpenAIConfig::new()
                .with_api_base("http://localhost:11434/v1"));
        let store = StoreBuilder::new()
            .embedder(embedder)
            .connection_url(db_path)
            .vector_dimensions(768)
            .build()
            .await.unwrap();
        store.initialize().await.unwrap();

        SqlPoolContext {
            pool,
            db_path: db_path.to_string()
        }
    }
}
