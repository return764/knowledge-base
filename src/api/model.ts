import {APIAbc} from "./api.ts";


export type LLMModel = {
    id: string
    url: string
    type: ModelType
    provider: string
    api_key: string
    name: string
    active: boolean
}

export type ModelType = "llm" | "embedding"


export class ModelAPI extends APIAbc {
    async insertModels(llmModels: LLMModel[]) {
        if (llmModels.length === 0) return
        const params = llmModels.map(it => [it.id, it.name, it.provider, it.type, it.api_key, it.url, it.active])
        await this.bulkInsert('model', ["id", "name", "provider", "type", "api_key", "url", "active"], params)
    }

    async updateModels(llmModels: LLMModel[]) {
        for (let model of llmModels) {
            await this.execute(
                "UPDATE model SET provider = ?, type = ?, api_key = ?, url = ?, active = ? WHERE id = ?",
                [model.provider, model.type, model.api_key, model.url, model.active, model.id]
            )
        }
    }

    async queryAll() {
        return await this.query<LLMModel[]>("SELECT * FROM model")
    }

    async activeModel(id: string, active: boolean) {
        await this.execute("UPDATE model SET active = ? WHERE id = ?", [active ? 1 : 0, id])
    }

    async queryAllActiveModel() {
        return await this.query<LLMModel[]>("SELECT * FROM model WHERE active = 1")
    }
}
