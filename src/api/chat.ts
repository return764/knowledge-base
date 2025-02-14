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
        return await this.query<Chat[]>("SELECT * FROM chat ORDER BY created_at DESC")
    }

    async queryById(params: {id: string}) {
        return (await this.query<Chat[]>("SELECT * FROM chat WHERE id = ?", [params.id]))[0]
    }

    async insert() {
        // 获取第一个 LLM 模型
        const models = await API.model.queryAllActiveModel();
        const defaultModel = models.find(it => it.type === "llm");
        
        // 准备默认设置
        const defaultSettings: ChatSettings = {
            knowledge_base: [],
            chat_model: defaultModel?.id
        };

        // 插入新的聊天记录，包含默认设置
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
        await this.execute("INSERT INTO chat_history (id, chat_id, content, role) VALUES (?, ?, ?, ?)", [await invoke('uuid'), chatId, message.content, message.role])
    }

    async queryHistoryByChatId(params: {chatId: string}) {
        return await this.query<ChatHistory[]>("SELECT * FROM chat_history WHERE chat_id = ? ORDER BY created_at", [params.chatId])
    }

    async updateName(chatId: string, name: string) {
        await this.execute("UPDATE chat SET name = ? WHERE id = ?", [name, chatId])
    }

}
