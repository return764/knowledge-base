import {combineURLs} from "../utils/utils.ts";
import {LLMModel} from "../api/model.ts";
import {invoke} from "@tauri-apps/api/core";
import {API} from "../api";


type OpenAIModel = {
    id: string,
    object: string,
    created: Date,
    owned_by: string
}

export const queryAllModels = async (url: string, key: string): Promise<OpenAIModel[]> => {
    const response = await fetch(combineURLs(url, 'models'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${key}`
        }
    });

    if (!response.ok) {
        console.warn(`请求失败: ${response.status}`)
        return []
    }

    return (await response.json())["data"];
}

export const saveAndUpdateModels = async (models: OpenAIModel[], type: string, url: string, key: string) => {
    // 获取所有已存在的模型
    const existingModels = await API.model.queryAll()
    const updatedModels: LLMModel[] = []
    const insertedModels: LLMModel[] = []

    // 处理每个模型
    for (const model of models) {
        // 检查模型是否已存在
        const existingModel = existingModels.find(m => m.name === model.id);

        if (existingModel) {
            updatedModels.push({
                ...existingModel,
                url: url,
                api_key: key,
                type: type
            })
        } else {
            insertedModels.push({
                id: await invoke('uuid'),
                url: url,
                api_key: key,
                name: model.id,
                type: type,
                active: false
            })
        }
    }
    await API.model.updateModels(updatedModels);
    await API.model.insertModels(insertedModels);
}
