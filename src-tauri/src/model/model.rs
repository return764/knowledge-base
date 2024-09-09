use langchain_rust::schemas::{Message, MessageType};
use serde::Deserialize;
use sqlx::{FromRow};

#[derive(Clone, FromRow, Deserialize, Debug)]
pub struct ChatMessage {
    content: String,
    role: MessageType
}

impl From<&ChatMessage> for Message {
    fn from(value: &ChatMessage) -> Self {
        Message {
            content: value.content.clone(),
            message_type: value.role.clone().into(),
            id: None,
            tool_calls: None,
            images: None,
        }
    }
}
