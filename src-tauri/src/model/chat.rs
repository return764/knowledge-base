use langchain_rust::schemas::{Message, MessageType as RawMessageType};
use serde::{Deserialize, Serialize};
use sqlx::{Database, Decode, FromRow, Sqlite, Type};

#[derive(Clone, FromRow, Deserialize, Serialize, Debug)]
pub struct ChatMessage {
    pub content: String,
    role: MessageType,
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

#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct MessageType(RawMessageType);

impl Type<Sqlite> for MessageType {
    fn type_info() -> <Sqlite as Database>::TypeInfo {
        <String as Type<Sqlite>>::type_info()
    }
}

impl<'r, DB: Database> Decode<'r, DB> for MessageType
where
    &'r str: Decode<'r, DB>,
{
    fn decode(
        value: <DB as Database>::ValueRef<'r>,
    ) -> Result<MessageType, sqlx::error::BoxDynError> {
        let value = <&str as Decode<DB>>::decode(value)?;
        match value {
            "system" => Ok(MessageType(RawMessageType::SystemMessage)),
            "ai" => Ok(MessageType(RawMessageType::AIMessage)),
            "human" => Ok(MessageType(RawMessageType::HumanMessage)),
            "tool" => Ok(MessageType(RawMessageType::ToolMessage)),
            _ => Err("Invalid type".into()),
        }
    }
}

impl Into<RawMessageType> for MessageType {
    fn into(self) -> RawMessageType {
        self.0
    }
}

#[derive(Clone, Deserialize, FromRow, Debug)]
pub struct Chat {
    id: String,
    name: String,
    prompts: String,
    pub settings: ChatSettings,
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
            chat_model: Some(String::new()),
        }
    }
}

impl Type<Sqlite> for ChatSettings {
    fn type_info() -> <Sqlite as Database>::TypeInfo {
        <String as Type<Sqlite>>::type_info()
    }
}

impl<'r, DB: Database> Decode<'r, DB> for ChatSettings
where
    &'r str: Decode<'r, DB>,
{
    fn decode(
        value: <DB as Database>::ValueRef<'r>,
    ) -> Result<ChatSettings, sqlx::error::BoxDynError> {
        let value = <&str as Decode<DB>>::decode(value)?;
        if value.len() == 0 {
            return Ok(ChatSettings::default());
        }
        let settings: ChatSettings = serde_json::from_str(value)?;
        Ok(settings)
    }
}
