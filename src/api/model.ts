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
        if (llmModels.length === 0) return;
        await this.table<LLMModel>('model')
            .bulkInsert(llmModels.map(model => ({
                id: model.id,
                name: model.name,
                type: model.type,
                active: model.active,
                provider_id: model.provider_id
            })))
            .execute();
    }

    async updateModels(llmModels: LLMModel[]) {
        for (let model of llmModels) {
            await this.table<LLMModel>('model')
                .update({ type: model.type, active: model.active })
                .where('id = ?', model.id)
                .execute();
        }
    }

    async updateProvider(provider: LLMProvider) {
        await this.table<LLMProvider>('model_provider')
            .update({ url: provider.url, api_key: provider.api_key })
            .where('id = ?', provider.id)
            .execute();
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
        await this.table<LLMProvider>('model_provider')
            .bulkInsert(providers)
            .execute();
    }

    async activeModel(id: string, active: boolean) {
        await this.table<LLMModel>('model')
            .update({ active })
            .where('id = ?', id)
            .execute();
    }

    async queryAllActiveModel() {
        return await this.table<LLMModel>('model')
            .where('active = ?', 1)
            .execute();
    }
}
