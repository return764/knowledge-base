use vector_database;
use vector_database::vector_database::it_works;

#[tauri::command]
pub async fn import_text() -> String {
    println!("I was invoked from JavaScript!");
    let str = it_works().await;
    str
}
