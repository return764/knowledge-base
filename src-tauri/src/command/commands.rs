use std::collections::HashMap;
use langchain_rust::chain::{Chain, LLMChainBuilder};
use langchain_rust::document_loaders::{Loader, TextLoader};
use langchain_rust::text_splitter::{SplitterOptions, TokenSplitter};
use langchain_rust::{fmt_template, message_formatter, prompt_args, template_fstring};
use langchain_rust::prompt::{HumanMessagePromptTemplate, SystemMessagePromptTemplate};
use langchain_rust::schemas::{Document, Message, MessageType};
use langchain_rust::vectorstore::{VecStoreOptions, VectorStore};
use serde_json::json;
use tauri::ipc::Channel;
use uuid::Uuid;
use crate::states::SqlPoolContext;
use futures::StreamExt;
use langchain_rust::vectorstore::sqlite_vec::StoreBuilder;
use tauri::State;
use crate::command::event::{ProgressEvent, StreamMessageResponse};
use crate::model::chat::ChatMessage;
use crate::service::{model, chat};

#[tauri::command]
pub async fn init_vec_db(state: State<'_, SqlPoolContext>) -> Result<(), ()> {
    let embedding_model = model::get_active_embedding_model(&state.pool).await;
    let store = StoreBuilder::new()
        .embedder(embedding_model)
        .connection_url(&state.db_path)
        .vector_dimensions(768)
        .build()
        .await.unwrap();
    store.initialize().await.unwrap();
    Ok(())
}

#[tauri::command]
pub async fn send_chat_message(state: State<'_, SqlPoolContext>,
                               chat_id: String,
                               messages: Vec<ChatMessage>,
                               on_event: Channel<StreamMessageResponse>) -> Result<(), ()> {
    let chat = chat::get_chat_settings(&state.pool, &chat_id).await;

    let (chat_model, embedding_model) = model::get_model_from_chat_settings(&state.pool, &chat.settings).await;

    let chat_model = chat_model.expect("There must be at least one llm model");

    let open_ai = model::build_open_ai_model(chat_model);

    let messages_normalize: Vec<Message> = messages.iter().map(|m| m.into()).collect();
    let chain = LLMChainBuilder::new()
        .llm(open_ai)
        .prompt(
            message_formatter![
                fmt_template!(SystemMessagePromptTemplate::new(template_fstring!(
                    "
                    你是知识库问答助手, 使用 <Reference></Reference> 标记中的内容作为本次对话的参考:

                    <Reference>
                    {documents}
                    {chat_history}
                    </Reference>

                    回答要求：
                    - 如果你不清楚答案，你需要澄清。
                    - 避免提及你是从 <Reference></Reference> 获取的知识。
                    - 保持答案与 <Reference></Reference> 中描述的一致。
                    - 使用 Markdown 语法优化回答格式。
                    - 使用与问题相同的语言回答。
                    ", "documents", "chat_history"
                ))),
                fmt_template!(HumanMessagePromptTemplate::new(template_fstring!(
                "{input}", "input"
            ))),
        ])
        .build()
        .unwrap();
    let (input, chat_history) = messages_normalize.split_last().unwrap();

    let embedder = match embedding_model {
        Some(model) => Some(model::build_embedding_model(model)),
        _ => None
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
                .await.unwrap();
            let result = store.similarity_search(&input.content, 2, &VecStoreOptions::default()).await.unwrap();
            documents = result.iter().map(|doc| doc.page_content.clone()).collect();
        }
    }

    let mut stream = match chain.stream(prompt_args! {
        "chat_history" => chat_history,
        "input" => input.content.clone(),
        "documents" => documents
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
pub async fn import_text(state: State<'_, SqlPoolContext>,
                         app: tauri::AppHandle,
                         text: String,
                         kb_id: String,
                         dataset_id: String,
                         on_event: Channel<ProgressEvent>) -> Result<(), String> {
    // 这个方法应该有输入数据集的名称，大文本
    // 创建数据集
    // 对大文本进行分词，512个字符为一个单元，分批进入embed模型进行训练
    // 将训练之后的vec保存到数据库中，其中包括文本/文件，数据集的id，向量，
    let kb = chat::get_knowledge_base(&state.pool, &kb_id).await;

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
        .execute(&state.pool)
        .await.map_err(|e| e.to_string())?;

    on_event.send(ProgressEvent::Started {
        progress_id: 1,
        content_length: count,
    }).unwrap();

    let final_docs: Vec<Document> = documents.iter().map(|item| {
        return item.clone().with_metadata(HashMap::from([
            ("kb_id".to_string(), json!(kb_id)),
            ("dataset_id".to_string(), json!(dataset_id)),
            ("id".to_string(), json!(uuid())),
        ]));
    }).collect();

    let model = model::get_model(&state.pool, &kb.embedding_model_id.unwrap()).await;

    let embedder = model::build_embedding_model(model.unwrap());

    let store = StoreBuilder::new()
        .embedder(embedder)
        .connection_url(&state.db_path)
        .vector_dimensions(768)
        .build()
        .await.unwrap();

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

