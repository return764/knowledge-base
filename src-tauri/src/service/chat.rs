use uuid::Uuid;
use sqlx::{Pool, Sqlite};
use langchain_rust::schemas::MessageType;


pub async fn add_chat_history(pool: &Pool<Sqlite>, chat_id: &String, content: String, message_type: MessageType) {
    sqlx::query("INSERT INTO chat_history (id, chat_id, content, role) VALUES ($1, $2, $3, $4)")
        .bind(Uuid::new_v4().to_string())
        .bind(chat_id)
        .bind(content)
        .bind(message_type.to_string())
        .execute(pool)
        .await.unwrap();
}