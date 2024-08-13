use std::collections::HashMap;
use langchain_rust::embedding::OllamaEmbedder;
use langchain_rust::schemas::Document;
use langchain_rust::vectorstore::sqlite_vec::StoreBuilder;
use langchain_rust::vectorstore::{VecStoreOptions, VectorStore};
use serde::Serialize;
use serde_json::json;
use tauri::ipc::Channel;
use tauri::Manager;
use uuid::{Uuid};
use crate::langchian::langchian::split_text;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum ProgressEvent {
    #[serde(rename_all = "camelCase")]
    Started {
        progress_id: usize,
        content_length: usize,
    },
    #[serde(rename_all = "camelCase")]
    Progress {
        progress_id: usize,
        chunk_length: usize,
    },
    #[serde(rename_all = "camelCase")]
    Finished {
        progress_id: usize,
    },
}

#[tauri::command]
pub fn uuid() -> String {
    return Uuid::new_v4().to_string();
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
    let document_contents = split_text(&text, 512);

    on_event.send(ProgressEvent::Started {
        progress_id: 1,
        content_length: document_contents.len(),
    }).unwrap();

    let docs: Vec<Document> = document_contents.iter().map(|item| {
        return Document::new(
            item,
        ).with_metadata(HashMap::from([
            ("dataset_id".to_string(), json!(dataset_id)),
            ("id".to_string(), json!(uuid())),
        ]));
    }).collect();

    store
        .add_documents(&docs, &VecStoreOptions::default())
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