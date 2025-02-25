import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";
import {ChatMessage} from "../components/chat/ChatContext.tsx";
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
    async saveSettings(id: string, settings: ChatSettings) {
        await this.table<Chat>('chat')
            .update({ settings: JSON.stringify(settings) })
            .where('id = ?', id)
            .execute();
    }

    async queryAll() {
        return await this.table<Chat>('chat')
            .orderBy('created_at', 'DESC')
            .execute();
    }

    async queryById(params: {id: string}) {
        return await this.table<Chat>('chat')
            .where('id = ?', params.id)
            .first();
    }

    async queryHistoryByChatId(params: {chatId: string}) {
        return await this.table<ChatHistory>('chat_history')
            .where('chat_id = ?', params.chatId)
            .orderBy('created_at')
            .execute();
    }

    async updateName(chatId: string, name: string) {
        await this.table<Chat>('chat')
            .update({ name })
            .where('id = ?', chatId)
            .execute();
    }

    async insert() {
        const models = await API.model.queryAllActiveModel();
        const defaultModel = models.find(it => it.type === "llm");

        const defaultSettings: ChatSettings = {
            knowledge_base: [],
            chat_model: defaultModel?.id
        };

        await this.table<Chat>('chat')
            .insert({
                id: await invoke('uuid'),
                name: DEFAULT_CHAT_TITLE,
                settings: JSON.stringify(defaultSettings)
            })
            .execute();
    }

    async insertHistory(chatId: string, message: ChatMessage) {
        await this.table<ChatHistory>('chat_history')
            .insert({
                id: await invoke('uuid'),
                chat_id: chatId,
                content: message.content,
                role: message.role
            })
            .execute();
    }
}
