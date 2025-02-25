import {APIAbc} from "./api.ts";


export type LLMModel = {
    id: string
    type: ModelType
    name: string
    active: boolean,
    provider_id: string,
    url: string
    provider: string
    api_key: string
}

export type LLMProvider = {
    id: string
    name: string
    url: string
    api_key: string
}

export type LLMModelInsert = Omit<LLMModel, 'url' | 'provider' | 'api_key'>

export type ModelType = "llm" | "embedding"


export class ModelAPI extends APIAbc {
    async insertModels(llmModels: LLMModelInsert[]) {
        if (llmModels.length === 0) return
        const params = llmModels.map(it => [it.id, it.name, it.type, it.active, it.provider_id])
        await this.bulkInsert('model', ["id", "name", "type", "active", "provider_id"], params)
    }

    async updateModels(llmModels: LLMModel[]) {
        for (let model of llmModels) {
            await this.execute(
                "UPDATE model SET type = ?, active = ? WHERE id = ?",
                [model.type, model.active, model.id]
            )
        }
    }

    async updateProvider(provider: LLMProvider) {
        await this.execute(
            "UPDATE model_provider SET url = ?, api_key = ? WHERE id = ?",
            [provider.url, provider.api_key, provider.id]
        )
    }

    async queryAll() {
        return await this.table<LLMModel>('model')
            .as('m')
            .select(['m.*', 'mp.name as provider', 'mp.url', 'mp.api_key'])
            .leftJoin('model_provider', 'm.provider_id = mp.id', 'mp')
            .execute();
    }

    async queryAllProvider() {
        return await this.table<LLMProvider>('model_provider')
            .execute();
    }

    async insertProviders(providers: LLMProvider[]) {
        if (providers.length === 0) return
        const params = providers.map(it => [it.id, it.name, it.api_key, it.url])
        await this.bulkInsert('model_provider', ["id", "name", "api_key", "url"], params)
    }

    async activeModel(id: string, active: boolean) {
        await this.execute(
            "UPDATE model SET active = ? WHERE id = ?", 
            [active ? 1 : 0, id]
        );
    }

    async queryAllActiveModel() {
        return await this.table<LLMModel>('model')
            .where('active = ?', 1)
            .execute();
    }
}
