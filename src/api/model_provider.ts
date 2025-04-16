import {APIAbc} from "./api.ts";

export type LLMProvider = {
    id: string
    name: string
    url: string
    api_key: string
}

export class ModelProviderAPI extends APIAbc {
    protected tableName: string = 'model_provider';

    async queryByName(name: string) {
        return await this.queryFirstBy('name', name)
    }
}
