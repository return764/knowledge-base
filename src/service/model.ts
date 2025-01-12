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

export const saveModels = async (models: OpenAIModel[], type: string, url: string, key: string) => {
    const llmModels: LLMModel[] = await Promise.all(models.map(async it => ({
        id: await invoke('uuid'),
        url: url,
        api_key: key,
        name: it.id,
        type: type,
        active: false
    })))
    await API.model.insertModels(llmModels)
}
