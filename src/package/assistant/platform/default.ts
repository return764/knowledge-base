import {BaseLLM} from "@langchain/core/language_models/llms";
import {BaseChatModel} from "@langchain/core/language_models/chat_models";
import {Embeddings} from "@langchain/core/embeddings";
import {LLMModel} from "../../api/model.ts";
import {LLMProvider} from "../../api/model_provider.ts";
import {ChatOpenAI, OpenAI, OpenAIEmbeddings} from "@langchain/openai";

type ProviderAPIOptions =
    | { model: LLMModel; provider?: LLMProvider }
    | { model?: LLMModel; provider: LLMProvider };
export type ModelOptions = {
    name: string
}
export type ProviderProps = {
    options: ProviderAPIOptions
}

export abstract class LLMProviderAPI {

    options: ProviderAPIOptions

    constructor(props: ProviderProps) {
        this.options = props.options
    }

    get baseUrl() {
        return this.options && this.options.model ? this.options.model.url : this.options.provider?.url
    }

    get apiKey() {
        return this.options && this.options.model ? this.options.model.api_key : this.options.provider?.api_key
    }

    validateOptions() {
        if (this.options.model?.provider !== this.options.provider?.name) {
            throw new Error('provider must associate with model')
        }
    }

    getModel(options?: ModelOptions): BaseLLM {
        this.validateOptions()
        return this._getModel(options)
    }

    getChatModel(options?: ModelOptions): BaseChatModel {
        this.validateOptions()
        return this._getChatModel(options)
    }

    getEmbeddingModel(options?: ModelOptions): Embeddings {
        this.validateOptions()
        return this._getEmbeddingModel(options)
    }

    abstract _getModel(options?: ModelOptions): BaseLLM

    abstract _getChatModel(options?: ModelOptions): BaseChatModel

    abstract _getEmbeddingModel(options?: ModelOptions): Embeddings
}

export class DefaultOpenAiProviderAPI extends LLMProviderAPI {
    _getModel(options?: ModelOptions): BaseLLM {
        this.validateOptions()
        return new OpenAI({
            model: options ? options.name : this.options.model?.name,
            configuration: {
                baseURL: this.baseUrl,
                apiKey: this.apiKey
            }
        })
    }

    // rerankModel
    _getChatModel(options?: ModelOptions): BaseChatModel {
        this.validateOptions()
        return new ChatOpenAI({
            model: options ? options.name : this.options.model?.name,
            configuration: {
                baseURL: this.baseUrl,
                apiKey: this.apiKey
            }
        })
    };

    _getEmbeddingModel(options?: ModelOptions): Embeddings {
        this.validateOptions()
        return new OpenAIEmbeddings({
            model: options ? options.name : this.options.model?.name,
            configuration: {
                baseURL: this.baseUrl,
                apiKey: this.apiKey
            }
        })
    }
}
