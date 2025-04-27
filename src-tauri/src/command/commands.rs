use crate::command::event::{ProgressEvent, StreamMessageResponse};
use crate::llm::prompt::CHAT_TITLE_PROMPT;
use crate::llm::{prompt, ChainChannel};
use crate::model::chat::ChatMessage;
use crate::service::{chat, model};
use crate::states::SqlPoolContext;
use futures::StreamExt;
use langchain_rust::chain::LLMChainBuilder;
use langchain_rust::document_loaders::{Loader, TextLoader};
use langchain_rust::language_models::llm::LLM;
use langchain_rust::prompt::{HumanMessagePromptTemplate, SystemMessagePromptTemplate};
use langchain_rust::schemas::Document;
use langchain_rust::text_splitter::{SplitterOptions, TokenSplitter};
use langchain_rust::vectorstore::sqlite_vec::{SqliteFilter, SqliteOptions, StoreBuilder};
use langchain_rust::vectorstore::VectorStore;
use langchain_rust::{fmt_template, message_formatter, prompt_args, template_fstring};
use serde_json::json;
use std::collections::HashMap;
use tauri::ipc::Channel;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub async fn init_vec_db(state: State<'_, SqlPoolContext>) -> Result<(), ()> {
    let embedding_model = model::get_active_embedding_model(&state.pool).await;
    let store = StoreBuilder::new()
        .embedder(embedding_model)
        .connection_url(&state.db_path)
        .vector_dimensions(768)
        .build()
        .await
        .unwrap();
    store.initialize().await.unwrap();
    Ok(())
}

#[tauri::command]
pub async fn generate_chat_title(
    state: State<'_, SqlPoolContext>,
    chat_id: String,
    messages: Vec<ChatMessage>,
) -> Result<String, ()> {
    let chat = chat::get_chat_settings(&state.pool, &chat_id).await;

    let (chat_model, _) = model::get_model_from_chat_settings(&state.pool, &chat.settings).await;

    let chat_model = chat_model.expect("There must be at least one llm model");

    // TODO 使用更兼容的方案生成聊天标题，例如一个小的模型，足以胜任该工作
    let open_ai = model::build_open_ai_model(chat_model);

    let result = open_ai
        .invoke(
            CHAT_TITLE_PROMPT
                .replace(
                    "{}",
                    messages
                        .into_iter()
                        .map(|message| message.content)
                        .collect::<Vec<String>>()
                        .join(";\n")
                        .as_str(),
                )
                .as_str(),
        )
        .await
        .unwrap();

    Ok(result)
}

#[tauri::command]
pub async fn send_chat_message(
    state: State<'_, SqlPoolContext>,
    chat_id: String,
    message: ChatMessage,
    on_event: Channel<StreamMessageResponse>,
) -> Result<(), ()> {
    let chat = chat::get_chat_settings(&state.pool, &chat_id).await;

    let (chat_model, embedding_model) =
        model::get_model_from_chat_settings(&state.pool, &chat.settings).await;

    let chat_model = chat_model.expect("There must be at least one llm model");

    let open_ai = model::build_open_ai_model(chat_model);

    let chat_history: Vec<ChatMessage> = chat::get_chat_history(&state.pool, &chat_id).await;
    let chain = LLMChainBuilder::new()
        .llm(open_ai)
        .prompt(message_formatter![
            fmt_template!(SystemMessagePromptTemplate::new(template_fstring!(
                prompt::CHAT_PROMPT,
                "documents",
                "chat_history"
            ))),
            fmt_template!(HumanMessagePromptTemplate::new(template_fstring!(
                "{input}", "input"
            ))),
        ])
        .build()
        .unwrap();

    let embedder = match embedding_model {
        Some(model) => Some(model::build_embedding_model(model)),
        _ => None,
    };

    let mut documents: Vec<String> = vec![];
    if let Some(knowledge_base) = chat.settings.knowledge_base {
        if !knowledge_base.is_empty() && embedder.is_some() {
            // 添加空数组检查
            let store = StoreBuilder::new()
                .embedder(embedder.unwrap())
                .connection_url(&state.db_path)
                .vector_dimensions(768)
                .build()
                .await
                .unwrap();
            let options = SqliteOptions::default()
                .with_filters(SqliteFilter::In("kb_id".to_string(), knowledge_base));
            let result = store
                .similarity_search(&message.content, 2, &options)
                .await
                .unwrap();
            documents = result.iter().map(|doc| doc.page_content.clone()).collect();
        }
    }

    chain
        .stream_channel(
            prompt_args! {
                "chat_history" => chat_history,
                "input" => message.content.clone(),
                "documents" => documents
            },
            on_event,
        )
        .await;
    Ok(())
}

#[tauri::command]
pub fn uuid() -> String {
    Uuid::new_v4().to_string()
}
