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
    chatId: string
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
        await this.execute("UPDATE chat SET settings = ? WHERE id = ?", [settings, id])
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
        await this.execute("UPDATE chat SET name = ? WHERE id = ?", [name, chatId]);
    }

    async insert() {
        const models = await API.model.queryAllActiveModel();
        const defaultModel = models.find(it => it.type === "llm");
        
        const defaultSettings: ChatSettings = {
            knowledge_base: [],
            chat_model: defaultModel?.id
        };

        await this.execute(
            "INSERT INTO chat (id, name, settings) VALUES (?, ?, ?)", 
            [
                await invoke('uuid'), 
                DEFAULT_CHAT_TITLE,
                JSON.stringify(defaultSettings)
            ]
        );
    }

    async insertHistory(chatId: string, message: ChatMessage) {
        await this.execute(
            "INSERT INTO chat_history (id, chat_id, content, role) VALUES (?, ?, ?, ?)", 
            [await invoke('uuid'), chatId, message.content, message.role]
        );
    }
}
