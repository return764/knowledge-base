import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";
import {ChatMessage} from "../components/chat/ChatContext.tsx";

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
    knowledge_base?: string[]
}

export class ChatAPI extends APIAbc {
    async saveSettings(id: string, settings: ChatSettings) {
        await this.execute("UPDATE chat SET settings = ? WHERE id = ?", [settings, id])
    }

    async queryAll() {
        return await this.query<Chat[]>("SELECT * FROM chat ORDER BY created_at DESC")
    }

    async queryById(id: string) {
        return (await this.query<Chat[]>("SELECT * FROM chat WHERE id = ?", [id]))[0]
    }

    async insert() {
        await this.execute("INSERT INTO chat (id, name) VALUES (?, ?)", [await invoke('uuid'), "未命名聊天"])
    }

    async insertHistory(chatId: string, message: ChatMessage) {
        await this.execute("INSERT INTO chat_history (id, chat_id, content, role) VALUES (?, ?, ?, ?)", [await invoke('uuid'), chatId, message.content, message.role])
    }

    async queryHistoryByChatId(params: {chatId: string}) {
        return await this.query<ChatHistory[]>("SELECT * FROM chat_history WHERE chat_id = ? ORDER BY created_at", [params.chatId])
    }
}
