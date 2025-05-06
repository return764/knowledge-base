import {BaseLLM} from "@langchain/core/language_models/llms";
import {ChatOllama, Ollama, OllamaEmbeddings} from "@langchain/ollama";
import {BaseChatModel} from "@langchain/core/language_models/chat_models";
import {Embeddings} from "@langchain/core/embeddings";
import OllamaSvg from "../../../assets/ollama.svg?react";
import {LLMProviderConfig} from "./config.ts";
import {LLMProviderAPI, ModelOptions, OpenAIListModelResponse} from "./default.ts";
import {combineURLs} from "../../../utils/utils.ts";

export class OllamaProvider extends LLMProviderAPI {
    static {
        LLMProviderConfig.registerProvider("Ollama", OllamaSvg)
    }

    _getModel(options?: ModelOptions): BaseLLM {
        return new Ollama({
            model:options ? options.name : this.options.model?.name,
            baseUrl: this.baseUrl
        })
    }

    _getChatModel(options?: ModelOptions): BaseChatModel {
        return new ChatOllama({
            model: options ? options.name : this.options.model?.name,
            baseUrl: this.baseUrl
        })
    }

    _getEmbeddingModel(options?: ModelOptions): Embeddings {
        return new OllamaEmbeddings({
            model: options ? options.name : this.options.model?.name,
            baseUrl: this.baseUrl
        })
    }

    async listModels(): Promise<string[]> {
        if (!this.baseUrl) {
            return []
        }
        const response = await fetch(combineURLs(this.baseUrl, 'v1/models'), {
            method: 'GET',
        });

        if (!response.ok) {
            console.warn(`请求失败: ${response.status}`)
            throw new Error("request models error")
        }

        return ((await response.json()) as OpenAIListModelResponse).data.map(it => it.id)

    }
}
