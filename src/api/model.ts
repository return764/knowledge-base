import {APIAbc} from "./api.ts";


export type LLMModel = {
    id: string
    url: string
    type: string
    api_key: string
    name: string
    active: boolean
}


export class ModelAPI extends APIAbc {
    async insertModels(llmModels: LLMModel[]) {
        const params = llmModels.map(it => [it.id, it.name, it.type, it.api_key, it.url, it.active])
        await this.bulkInsert('model', ["id", "name", "type", "api_key", "url", "active"], params)
    }

    async queryAll() {
        return await this.query<LLMModel[]>("SELECT * FROM model")
    }

    async activeModel(id: string, active: boolean) {
        this.execute("UPDATE model SET active = ? WHERE id = ?", [active ? 1 : 0, id])
    }
}
