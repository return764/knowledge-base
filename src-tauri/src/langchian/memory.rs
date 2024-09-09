// use std::sync::{Arc, Mutex};
// use crate::model::model::{ChatMessage};
// use langchain_rust::schemas::{BaseMemory, Message};
// use langchain_rust::vectorstore::sqlite_vec::Store;
//
// pub struct ChatMemory {
//     store: Store,
//     chat_id: String
// }
//
// impl ChatMemory {
//     pub fn new(store: Store, chat_id: String) -> Self {
//         Self {
//             store,
//             chat_id
//         }
//     }
// }
//
// impl BaseMemory for ChatMemory {
//     async fn messages(&self) -> Vec<Message> {
//         let chat_id = &self.chat_id;
//         let list: Vec<ChatMessage> = sqlx::query_as(&format!("SELECT * FROM chat_history WHERE chat_id = {chat_id} ORDER BY created_at ASC"))
//             .fetch_all(&self.store.pool)
//             .await.unwrap();
//
//         list.iter().map(|m| m.into()).collect()
//     }
//
//     fn add_message(&mut self, message: Message) {
//         sqlx::query(&format!("INSERT INTO chat_history (id, chat_id, content, ) VALUES ()"));
//     }
//
//     fn clear(&mut self) {
//         todo!()
//     }
// }
//
// impl Into<Arc<dyn BaseMemory>> for ChatMemory {
//     fn into(self) -> Arc<dyn BaseMemory> {
//         Arc::new(self)
//     }
// }
//
// impl Into<Arc<Mutex<dyn BaseMemory>>> for ChatMemory {
//     fn into(self) -> Arc<Mutex<dyn BaseMemory>> {
//         Arc::new(Mutex::new(self))
//     }
// }
