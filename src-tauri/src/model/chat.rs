use langchain_rust::schemas::{Message, MessageType};
use serde::Deserialize;
use sqlx::{Database, Decode, FromRow, Sqlite, Type};

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

#[derive(Clone, Deserialize, FromRow, Debug)]
pub struct Chat {
    id: String,
    name: String,
    prompts: String,
    pub settings: ChatSettings
}

#[derive(Clone, Deserialize, FromRow, Debug)]
pub struct ChatSettings {
    pub knowledge_base: Option<Vec<String>>,
    pub chat_model: Option<String>,
}

impl Default for ChatSettings {
    fn default() -> Self {
        Self {
            knowledge_base: Some(Vec::new()),
            chat_model: Some(String::new())
        }
    }
}

impl Type<Sqlite> for ChatSettings {
    fn type_info() -> <Sqlite as Database>::TypeInfo {
        <String as Type<Sqlite>>::type_info()
    }
}

impl<'r,DB: Database> Decode<'r, DB> for ChatSettings
where &'r str: Decode<'r, DB> {
    fn decode(value: <DB as sqlx::database::HasValueRef<'r>>::ValueRef) -> Result<ChatSettings, sqlx::error::BoxDynError> {
        let value = <&str as Decode<DB>>::decode(value)?;
        if value.len() == 0 {
            return Ok(ChatSettings::default());
        }
        let settings: ChatSettings = serde_json::from_str(value)?;
        Ok(settings)
    }
}
