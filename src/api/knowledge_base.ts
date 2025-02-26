import {APIAbc} from "./api.ts";

export type KnowledgeBase = {
    id: string,
    name: string,
    description: string,
    embedding_model_id: string,
    created_at: Date
}

export class KnowledgeBaseAPI extends APIAbc {
    protected tableName: string = 'knowledge_base';
}
