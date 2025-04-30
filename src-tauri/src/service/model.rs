use crate::model::Model;
use langchain_rust::embedding::openai::OpenAiEmbedder;
use langchain_rust::llm::OpenAIConfig;
use sqlx::{Pool, Sqlite};

pub async fn get_active_embedding_model(pool: &Pool<Sqlite>) -> OpenAiEmbedder<OpenAIConfig> {
    let model = sqlx::query_as("SELECT m.id, m.name, m.type, m.active, mp.url, mp.api_key, mp.name as provider FROM model m LEFT JOIN model_provider mp ON m.provider_id = mp.id  WHERE type = 'embedding' AND active = 1 LIMIT 1")
        .fetch_one(pool)
        .await.unwrap();

    build_embedding_model(model)
}

pub fn build_embedding_model(model: Model) -> OpenAiEmbedder<OpenAIConfig> {
    assert_eq!(model.r#type, "embedding");

    OpenAiEmbedder::default()
        .with_model(model.name)
        .with_config(
            OpenAIConfig::new()
                .with_api_key(model.api_key)
                .with_api_base(model.url),
        )
}