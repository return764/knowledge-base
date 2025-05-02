

// 根据chatId获取对应的Provider
// Provider的实现中能获取到对应的ChatLLM, embedding, rerank模型
// 这些模型，优先使用langchain js的实现

import {BaseChatModel} from "@langchain/core/language_models/chat_models";
import {ChatOpenAI, OpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {LLMModel} from "../api/model.ts";
import {Embeddings} from "@langchain/core/embeddings";
import {ChatOllama, Ollama, OllamaEmbeddings} from "@langchain/ollama";
import {API} from "../api";
import {BaseLLM} from "@langchain/core/language_models/llms";

type ProviderProps = {
    model: LLMModel
}

export const getProviderFromChat = async (chatId: string) => {
    const chatSettings = await API.chatSettings.getSettings(chatId)
    const chatModel = await API.model.queryByIdWithProvider(chatSettings.chat_model_id!!)
    if (!chatModel) {
        throw Error("There must be at least one llm model")
    }

    return distributeProvider(chatModel)
}

export const getProviderFromKb = async (kbId: string) => {
    const kb = await API.knowledgeBase.queryById(kbId);
    const model = await API.model.queryByIdWithProvider(kb!!.embedding_model_id)
    if (!model) {
        throw Error("There must be at least one llm model")
    }

    return distributeProvider(model)
}

const distributeProvider = (model: LLMModel) => {
    switch (model.provider) {
        case "Ollama":
            return new OllamaProvider({model: model})
        case "OpenAI":
            return new OpenAIProvider({model: model})
        case "Qwen":
            return new QwenProvider({model: model})
        case "SiliconFlow":
            return new SiliconFlowProvider({model: model})
        default:
            return new OpenAIProvider({model: model})
    }
}

abstract class LLMProvider {
    model: LLMModel
    constructor(props: ProviderProps) {
        this.model = props.model
    }

    getModel(): BaseLLM {
        return new OpenAI({
            model: this.model.name,
            configuration: {
                baseURL: this.model.url,
                apiKey: this.model.api_key
            }
        })
    }

    // chatModel
    // embeddingModel
    // rerankModel
    getChatModel(): BaseChatModel {
        return new ChatOpenAI({
            model: this.model.name,
            configuration: {
                baseURL: this.model.url,
                apiKey: this.model.api_key
            }
        })
    };

    getEmbeddingModel(): Embeddings {
        return new OpenAIEmbeddings({
            model: this.model.name,
            configuration: {
                apiKey: this.model.api_key,
                baseURL: this.model.url,
            }
        })
    }
}

class OllamaProvider extends LLMProvider {
    getModel(): BaseLLM {
        return new Ollama({
            model: this.model.name,
            baseUrl: this.model.url
        })
    }

    getChatModel(): BaseChatModel {
        return new ChatOllama({
            model: this.model.name,
            baseUrl: this.model.url
        })
    }

    getEmbeddingModel(): Embeddings {
        return new OllamaEmbeddings({
            model: this.model.name,
            baseUrl: this.model.url
        })
    }
}


class OpenAIProvider extends LLMProvider {

}

class QwenProvider extends LLMProvider {

}

class SiliconFlowProvider extends LLMProvider {

}
