import {LLMModel} from "../../api/model.ts";
import {LLMProvider} from "../../api/model_provider.ts";
import {API} from "../../api";
import {OllamaProvider} from "./ollama.ts";
import {OpenAIProvider} from "./openai.ts";
import {QwenProvider} from "./qwen.ts";
import {SiliconFlowProvider} from "./siliconflow.ts";


const isLLMModel = (obj: any): obj is LLMModel => {
    return (
        obj &&
        typeof obj === 'object' &&
        'type' in obj &&
        'active' in obj &&
        'provider_id' in obj
    );
};

export const getProviderAPI = async (providerName: string) => {
    const provider = await API.modelProvider.queryByName(providerName)
    if (!provider) {
        throw Error("This Provider is not valid")
    }

    return distributeClient(provider)
}

export const getProviderAPIModel = async (model: LLMModel) => {
    return distributeClient(model)
}

const distributeClient = (input: LLMModel | LLMProvider) => {
    const options = isLLMModel(input)
        ? { model: input }
        : { provider: input };

    const providerName = isLLMModel(input)
        ? input.provider
        : input.name;

    switch (providerName) {
        case "Ollama":
            return new OllamaProvider({options})
        case "OpenAI":
            return new OpenAIProvider({options})
        case "Qwen":
            return new QwenProvider({options})
        case "SiliconFlow":
            return new SiliconFlowProvider({options})
        default:
            return new OpenAIProvider({options})
    }
}
