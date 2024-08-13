import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";

export type KnowledgeBase = {
    id: string,
    name: string,
    description: string,
    embedder_model_id: string,
    language_model_id: string,
    created_at: Date
}

export class KnowledgeBaseAPI extends APIAbc {
    async queryAll() {
        return await this.query<KnowledgeBase[]>("SELECT * FROM knowledge_base")
    }

    async queryById(id: string) {
        return (await this.query<KnowledgeBase>("SELECT * FROM knowledge_base WHERE id = ?", [id]))[0]
    }

    async insert(params: {name: string}) {
        await this.execute("INSERT INTO knowledge_base (id, name) VALUES (?, ?)", [await invoke('uuid'), params.name])
    }
}
