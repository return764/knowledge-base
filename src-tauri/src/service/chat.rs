use uuid::Uuid;
use sqlx::{Pool, Sqlite};
use langchain_rust::schemas::MessageType;
use crate::model::chat::Chat;


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
    return sqlx::query_as("SELECT id, name, prompts, settings FROM chat WHERE id = $1")
        .bind(chat_id)
        .fetch_one(pool)
        .await.unwrap();
}