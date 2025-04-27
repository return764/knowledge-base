import {APIAbc} from "./api.ts";
import {ChatMessage} from "../../components/chat/ChatContext.tsx";
import {API} from "./index.ts";

export type Chat = {
    id: string,
    name: string,
    prompts?: string,
    settings?: string,
    createdAt: string
}

export type ChatSettings = {
    knowledge_base?: string[],
    chat_model?: string,
}

export const DEFAULT_CHAT_TITLE = "未命名聊天"

export class ChatAPI extends APIAbc<Chat> {
    protected tableName: string = 'chat';
    async saveSettings(id: string, settings: ChatSettings) {
        await this.update({ id, settings: JSON.stringify(settings) })
    }

    // TODO optimize extract settings to other table
    async getSettings(id: string) {
        const chat = await this.queryById(id)
        return JSON.parse(chat?.settings!!) as ChatSettings
    }

    async newChat() {
        const models = await API.model.queryAllActiveModel();
        const defaultModel = models.find(it => it.type === "llm");

        const defaultSettings: ChatSettings = {
            knowledge_base: [],
            chat_model: defaultModel?.id
        };

        await this.insert({
                name: DEFAULT_CHAT_TITLE,
                settings: JSON.stringify(defaultSettings)
            });
    }
}
