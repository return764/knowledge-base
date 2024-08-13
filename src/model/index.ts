import {KnowledgeBaseAPI} from "./knowledge_base.ts";
import {DatasetAPI} from "./dataset.ts";

export const API = {
    'knowledgeBase': new KnowledgeBaseAPI(),
    'dataset': new DatasetAPI()
}
