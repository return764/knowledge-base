import { CharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from 'uuid';
import {API} from "../api";
import {OpenAIEmbeddings} from "@langchain/openai";
import {SqliteVecStore} from "./vector_store.ts";
import {defaultDriver} from "../api/builder/database.ts";
import {OllamaEmbeddings} from "@langchain/ollama";

export const importText = async (text: string, kbId: string, datasetId: string) => {
    const splitter = new CharacterTextSplitter({
        chunkSize: 512,
        chunkOverlap: 100,
    });

    const texts = await splitter.splitText(text)
    const documents = await splitter.createDocuments(texts, [
        {
            "kb_id": kbId,
            "dataset_id": datasetId,
            "id": uuidv4(),
        }
    ])

    const kb = await API.knowledgeBase.queryById(kbId);
    const model = await API.model.queryByIdWithProvider(kb!!.embedding_model_id)
    const embedding = new OllamaEmbeddings({
        model: model?.name,
        baseUrl: model?.url,
    })

    const store = new SqliteVecStore(embedding, {
        pool: defaultDriver
    })

    await store.addDocuments(documents)
    await API.dataset.updateDatasetCount(datasetId, documents.length)
}
