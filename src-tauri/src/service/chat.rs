use uuid::Uuid;
use sqlx::{Pool, Sqlite};
use langchain_rust::schemas::MessageType;
use crate::model::{chat::Chat, KnowledgeBase};
use crate::model::chat::ChatMessage;

pub async fn get_chat_history(pool: &Pool<Sqlite>, chat_id: &String) -> Vec<ChatMessage> {
    sqlx::query_as("SELECT content, role FROM chat_history WHERE chat_id = $1")
        .bind(chat_id)
        .fetch_all(pool)
        .await.unwrap()
}

pub async fn add_chat_history(pool: &Pool<Sqlite>, chat_id: &String, content: String, message_type: MessageType) {
    sqlx::query("INSERT INTO chat_history (id, chat_id, content, role) VALUES ($1, $2, $3, $4)")
        .bind(Uuid::new_v4().to_string())
        .bind(chat_id)
        .bind(content)
        .bind(message_type.to_string())
        .execute(pool)
        .await.unwrap();
}

pub async fn get_chat_settings(pool: &Pool<Sqlite>, chat_id: &String) -> Chat {
    sqlx::query_as("SELECT id, name, prompts, settings FROM chat WHERE id = $1")
        .bind(chat_id)
        .fetch_one(pool)
        .await.unwrap()
}


pub async fn get_knowledge_bases(pool: &Pool<Sqlite>, kb_ids: &Vec<String>) -> Vec<KnowledgeBase> {
    let ids_str = kb_ids.iter()
        .map(|id| format!("'{}'", id))
        .collect::<Vec<String>>()
        .join(",");

    sqlx::query_as(
        &format!("SELECT id, name, description, embedding_model_id FROM knowledge_base WHERE id IN ({})", ids_str)
    )
    .fetch_all(pool)
    .await
    .unwrap()
}

pub async fn get_knowledge_base(pool: &Pool<Sqlite>, kb_id: &String) -> KnowledgeBase {
    sqlx::query_as(
        "SELECT id, name, description, embedding_model_id FROM knowledge_base WHERE id = $1"
    )
        .bind(kb_id)
        .fetch_one(pool)
        .await
        .unwrap()
}
