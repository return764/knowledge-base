use std::collections::HashMap;
use langchain_rust::chain::{Chain, LLMChainBuilder};
use langchain_rust::document_loaders::{Loader, TextLoader};
use langchain_rust::embedding::OllamaEmbedder;
use langchain_rust::llm::client::Ollama;
use langchain_rust::text_splitter::{SplitterOptions, TokenSplitter};
use langchain_rust::{fmt_message, fmt_placeholder, fmt_template, message_formatter, prompt_args, template_fstring};
use langchain_rust::prompt::HumanMessagePromptTemplate;
use langchain_rust::schemas::{Document, Message, MessageType};
use langchain_rust::vectorstore::sqlite_vec::StoreBuilder;
use langchain_rust::vectorstore::{VecStoreOptions, VectorStore};
use serde_json::json;
use tauri::ipc::Channel;
use tauri::{Manager, State};
use uuid::Uuid;
use crate::states::SqlPoolContext;
use futures::StreamExt;
use crate::command::event::{ProgressEvent, StreamMessageResponse};
use crate::model::chat::ChatMessage;
use crate::service::chat;

#[tauri::command]
pub async fn send_chat_message(state: State<'_, SqlPoolContext>,
                               chat_id: String,
                               messages: Vec<ChatMessage>,
                               on_event: Channel<StreamMessageResponse>) -> Result<(), ()> {
    let ollama = Ollama::default().with_model("llama3");

    let messages_normalize: Vec<Message> = messages.iter().map(|m| m.into()).collect();
    let chain = LLMChainBuilder::new()
        .llm(ollama.clone())
        .prompt(
            message_formatter![
                fmt_message!(Message::new_system_message("你是知识库助手，请用中文回复问题，不要使用emoji")),
                fmt_placeholder!("chat_history"),
                fmt_template!(HumanMessagePromptTemplate::new(template_fstring!(
                "{input}", "input"
            ))),
        ])
        .build()
        .unwrap();
    let (input, chat_history) = messages_normalize.split_last().unwrap();

    let mut stream = match chain.stream(prompt_args! {
        "chat_history" => chat_history,
        "input" => input.content.clone()
    }).await {
        Ok(stream) => stream,
        Err(e) => {
            on_event.send(StreamMessageResponse::Error {
                message: format!("Error: {}", e),
            }).unwrap();
            return Ok(());
        }
    };

    let mut complete_ai_message = String::new();
    while let Some(result) = stream.next().await {
        match result {
            Ok(value) => {
                complete_ai_message.push_str(&value.content);
                on_event.send(StreamMessageResponse::AppendMessage {
                    content: value.content,
                }).unwrap();
            },
            Err(e) => {
                on_event.send(StreamMessageResponse::Error {
                    message: format!("Error invoking LLMChain: {:?}", e),
                }).unwrap();
                panic!("Error invoking LLMChain: {:?}", e)
            },
        }
    }
    on_event.send(StreamMessageResponse::Done).unwrap();
    chat::add_chat_history(&state.pool, &chat_id, input.content.clone(), MessageType::HumanMessage).await;
    chat::add_chat_history(&state.pool, &chat_id, complete_ai_message.clone(), MessageType::AIMessage).await;
    Ok(())
}

#[tauri::command]
pub fn uuid() -> String {
    Uuid::new_v4().to_string()
}

#[tauri::command]
pub async fn import_text(app: tauri::AppHandle,
                         text: String,
                         kb_id: String,
                         dataset_id: String,
                         on_event: Channel<ProgressEvent>) -> Result<(), String> {
    // 这个方法应该有输入数据集的名称，大文本
    // 创建数据集
    // 对大文本进行分词，512个字符为一个单元，分批进入embed模型进行训练
    // 将训练之后的vec保存到数据库中，其中包括文本/文件，数据集的id，向量，
    let ollama = OllamaEmbedder::default().with_model("nomic-embed-text");
    let store = StoreBuilder::new()
        .embedder(ollama)
        .connection_url(format!("sqlite:{}/knowledge_keeper.db", app.path().app_config_dir().unwrap().to_str().unwrap()))
        .table(format!("kb_{}", kb_id.replace('-',"").to_string()).as_str())
        .vector_dimensions(768)
        .build()
        .await.map_err(|e| e.to_string())?;
    store.initialize().await.map_err(|e| e.to_string())?;

    let text_loader = TextLoader::new(&text);
    let splitter = TokenSplitter::new(SplitterOptions::default());
    let mut doc_stream = text_loader.load_and_split(splitter).await.unwrap();
    let mut documents: Vec<Document> = vec![];
    while let Some(doc) = doc_stream.next().await {
        match doc {
            Ok(value) => {
                documents.push(value);
            },
            Err(e) => {
                println!("Error when split documents: {:?}", e)
            },
        }
    }

    let count = documents.len();

    sqlx::query(&format!("UPDATE dataset SET count = {count} WHERE id = '{dataset_id}'"))
        .execute(&store.pool)
        .await.map_err(|e| e.to_string())?;

    on_event.send(ProgressEvent::Started {
        progress_id: 1,
        content_length: count,
    }).unwrap();

    let final_docs: Vec<Document> = documents.iter().map(|item| {
        return item.clone().with_metadata(HashMap::from([
            ("dataset_id".to_string(), json!(dataset_id)),
            ("id".to_string(), json!(uuid())),
        ]));
    }).collect();

    store
        .add_documents(&final_docs, &VecStoreOptions::default())
        .await.map_err(|e| e.to_string())?;

    on_event.send(ProgressEvent::Finished {
        progress_id: 1,
    }).unwrap();

    Ok(())

    // todo 下面应该被移除到另一个方法中去
    // let results = store
    //     .similarity_search(&"what is langchain-rust", 2, &VecStoreOptions::default())
    //     .await
    //     .unwrap();
    //
    // if results.is_empty() {
    //     println!("No results found.");
    //     return String::from("No results");
    // } else {
    //     results.iter().for_each(|r| {
    //         println!("Document: {}", r.page_content);
    //     });
    //     return results.first().unwrap().clone().page_content;
    // }
}

