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

export type LLMModelInsert = Partial<LLMModel>

export type ModelType = "llm" | "embedding"


export class ModelAPI extends APIAbc<LLMModel> {
    protected tableName: string = 'model';

    async queryAllWithProvider() {
        return await this.table('model').as('m')
            .select(['m.*', 'mp.name as provider', 'mp.url', 'mp.api_key'])
            .leftJoin('model_provider', 'm.provider_id = mp.id', 'mp')
            .query();
    }

    async queryByIdWithProvider(id: string) {
        return await this.table('model').as('m')
            .select(['m.*', 'mp.name as provider', 'mp.url', 'mp.api_key'])
            .leftJoin('model_provider', 'm.provider_id = mp.id', 'mp')
            .where("m.id = ?", id)
            .first();
    }

    async activeModel(id: string, active: boolean) {
        await this.table('model')
            .update({ active })
            .where('id = ?', id)
            .execute();
    }

    async queryAllActiveModel() {
        return await this.queryBy('active', 1);
    }
}
