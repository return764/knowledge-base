use langchain_rust::embedding::openai::OpenAiEmbedder;
use langchain_rust::llm::{OpenAI, OpenAIConfig};
use sqlx::{Pool, Sqlite};
use crate::model::chat::ChatSettings;
use crate::model::{Model};
use crate::service::chat;

pub async fn get_model_from_chat_settings(pool: &Pool<Sqlite>, chat_settings: &ChatSettings) -> (Option<Model>, Option<Model>) {
    let chat_model = match chat_settings.chat_model.as_ref() {
        Some(model_id) => get_model(&pool, &model_id).await,
        _ => None
    };

    let knowledge_bases = match chat_settings.knowledge_base.as_ref() {
        Some(kb_ids) => Some(chat::get_knowledge_bases(&pool, kb_ids).await),
        _ => None
    };

    let embedding_model = match knowledge_bases {
        Some(kbs) if !kbs.is_empty() => get_model(&pool, kbs.first().unwrap().embedding_model_id.as_ref().unwrap()).await,
        _ => None
    };

    (chat_model, embedding_model)
}

pub async fn get_model(pool: &Pool<Sqlite>, model_id: &String) -> Option<Model> {
    sqlx::query_as("SELECT m.id, m.name, m.type, m.active, mp.url, mp.api_key, mp.name as provider FROM model m LEFT JOIN model_provider mp ON m.provider_id = mp.id WHERE m.id = $1")
        .bind(model_id)
        .fetch_optional(pool)
        .await.unwrap()
}

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
        .with_config(OpenAIConfig::new()
            .with_api_key(model.api_key)
            .with_api_base(model.url))
}

pub fn build_open_ai_model(model: Model) -> OpenAI<OpenAIConfig> {
    assert_eq!(model.r#type, "llm");

    OpenAI::default()
        .with_model(model.name)
        .with_config(OpenAIConfig::new()
            .with_api_key(model.api_key)
            .with_api_base(model.url))
}
