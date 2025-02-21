import {combineURLs} from "../utils/utils.ts";
import {LLMModelInsert} from "../api/model.ts";
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
        throw new Error("request models error")
    }

    return (await response.json())["data"];
}

export const saveAndUpdateModels = async (models: OpenAIModel[], providerId: string) => {
    // 获取所有已存在的模型
    const existingModels = await API.model.queryAll()
    const insertedModels: LLMModelInsert[] = []

    // 处理每个模型
    for (const model of models) {
        // 检查模型是否已存在
        const existingModel = existingModels.find(m => m.name === model.id);
        if (!existingModel) {
            insertedModels.push({
                id: await invoke('uuid'),
                name: model.id,
                type: getModelType(model.id),
                active: false,
                provider_id: providerId
            })
        }
    }
    // TODO 处理删除逻辑
    await API.model.insertModels(insertedModels);
}

const getModelType = (name: string) => {
    if (/text|embedding|embed/i.test(name)) {
        return "embedding"
    }
    return "llm"
}
