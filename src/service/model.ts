import {API} from "../package/api";
import {LLMModel} from "../package/api/model.ts";

export const getEmbeddingModelFromKbBind = async (kbId: string): Promise<LLMModel> => {
    const kb = await API.knowledgeBase.queryById(kbId);
    const model = await API.model.queryByIdWithProvider(kb!!.embedding_model_id)
    if (!model) {
        throw Error("There must be at least one llm model")
    }

    return model!!
}

export const getModelFromChatBind = async (chatId: string): Promise<LLMModel> => {
    const chatSettings = await API.chatSettings.getSettings(chatId)
    const chatModel = await API.model.queryByIdWithProvider(chatSettings.chat_model_id!!)
    if (!chatModel) {
        throw Error("There must be at least one llm model")
    }

    return chatModel
}

export const saveModel = async (model: string, providerId: string) => {
    await API.model.insert({
        name: model,
        type: getModelType(model),
        active: true,
        provider_id: providerId
    })
}

const getModelType = (name: string) => {
    if (/text|embedding|embed/i.test(name)) {
        return "embedding"
    }
    return "llm"
}
