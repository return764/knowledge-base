pub mod vector_database {
    use langchain_rust::{
        embedding::ollama::ollama_embedder::OllamaEmbedder,
        schemas::Document,
        vectorstore::qdrant::{StoreBuilder, QdrantClient},
        vectorstore::{VectorStore, VecStoreOptions},
    };
    use langchain_rust::embedding::Embedder;

    pub async fn it_works() -> String {

        let ollama = OllamaEmbedder::default().with_model("nomic-embed-text");
        let response = ollama.embed_query("Why is the sky blue?").await.unwrap();
        println!("{:?}", response);

        let client = QdrantClient::from_url("http://localhost:6334").build().unwrap();
        let store = StoreBuilder::new()
            .embedder(ollama)
            .client(client)
            .collection_name("langchain-rs")
            .build()
            .await
            .unwrap();
        // Add documents to the database
        let doc1 = Document::new(
            "langchain-rust is a port of the langchain python library to rust and was written in 2024.",
        );
        let doc2 = Document::new(
            "langchaingo is a port of the langchain python library to go language and was written in 2023."
        );
        let doc3 = Document::new(
            "Capital of United States of America (USA) is Washington D.C. and the capital of France is Paris."
        );
        let doc4 = Document::new("Capital of France is Paris.");

        store
            .add_documents(&vec![doc1, doc2, doc3, doc4], &VecStoreOptions::default())
            .await
            .unwrap();

        let results = store
            .similarity_search(&"what is langchaingo", 2, &VecStoreOptions::default())
            .await
            .unwrap();

        if results.is_empty() {
            println!("No results found.");
            return String::from("No results");
        } else {
            results.iter().for_each(|r| {
                println!("Document: {}", r.page_content);
            });
            return results.first().unwrap().clone().page_content;
        }
    }

}
