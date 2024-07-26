import {APIAbc} from "./api.ts";

export type KnowledgeBase = {
    id: string,
    name: string,
    created_at: Date
}

export class KnowledgeBaseAPI extends APIAbc {
    async queryAll() {
        return await this.query<KnowledgeBase[]>("SELECT * FROM knowledge_base")
    }

    async insert(params: {name: string}) {
        await this.execute("INSERT INTO knowledge_base (NAME) VALUES (?)", [params.name])
    }
}
