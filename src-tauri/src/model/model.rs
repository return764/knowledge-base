use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Model {
    pub id: String,
    pub url: String,
    pub name: String,
    pub r#type: String, // 使用type_因为type是Rust关键字
    pub api_key: String,
    pub active: bool   // SQLite的INTEGER 0/1 映射到Rust的bool
}

impl Model {
    pub fn new(
        id: String,
        url: String,
        name: String,
        r#type: String,
        api_key: String,
        active: bool,
    ) -> Self {
        Self {
            id,
            url,
            name,
            r#type,
            api_key,
            active,
        }
    }
}
