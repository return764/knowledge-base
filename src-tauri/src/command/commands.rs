use crate::service::model;
use crate::states::SqlPoolContext;
use langchain_rust::vectorstore::sqlite_vec::StoreBuilder;
use tauri::State;

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
