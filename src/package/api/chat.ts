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

export type ChatHistory = {
    id: string
    chat_id: string
    content: string
    role: 'ai' | 'human' | 'system'
    createdAt: string
}

export type ChatSettings = {
    knowledge_base?: string[],
    chat_model?: string,
}

export const DEFAULT_CHAT_TITLE = "未命名聊天"

export class ChatAPI extends APIAbc {
    protected tableName: string = 'chat';
    async saveSettings(id: string, settings: ChatSettings) {
        await this.update<Chat>({ id, settings: JSON.stringify(settings) })
    }

    async queryHistoryByChatId(chatId: string) {
        return await this.table<ChatHistory>('chat_history')
            .where('chat_id = ?', chatId)
            .orderBy('created_at')
            .query();
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

    async insertHistory(chatId: string, message: ChatMessage) {
        await this.table<ChatHistory>('chat_history')
            .insert({
                chat_id: chatId,
                content: message.content,
                role: message.role
            })
            .execute();
    }
}
