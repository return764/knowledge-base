import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";

export type KnowledgeBase = {
    id: string,
    name: string,
    description: string,
    embedding_model_id: string,
    created_at: Date
}

export class KnowledgeBaseAPI extends APIAbc {
    async queryAll() {
        return await this.table<KnowledgeBase>('knowledge_base')
            .execute();
    }

    async queryById(id: string) {
        return await this.table<KnowledgeBase>('knowledge_base')
            .where('id = ?', id)
            .first();
    }

    async insert(params: {name: string, embeddingModel: string}) {
        await this.table<KnowledgeBase>('knowledge_base')
            .insert({
                id: await invoke('uuid'),
                name: params.name,
                embedding_model_id: params.embeddingModel
            })
            .execute();
    }

    async delete(id: string) {
        await this.table<KnowledgeBase>('knowledge_base')
            .delete()
            .where('id = ?', id)
            .execute();
    }
}
