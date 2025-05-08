import {APIAbc} from "./api.ts";
import {API} from "./index.ts";
import toast from "react-hot-toast";

export type Chat = {
    id: string,
    name: string,
    prompts?: string,
    settings?: string,
    createdAt: string
}

export const DEFAULT_CHAT_TITLE = "未命名聊天"

export class ChatAPI extends APIAbc<Chat> {
    protected tableName: string = 'chat';

    async newChat(): Promise<string | undefined> {
        const models = await API.model.queryAllActiveModel();
        const defaultModel = models.find(it => it.type === "llm");

        if (!defaultModel) {
            toast.error("You must have one model in system")
            return
        }

        const id = await this.insert({
            name: DEFAULT_CHAT_TITLE
        });

        await API.chatSettings.newSettings({
            id,
            kb_ids: [],
            chat_model_id: defaultModel?.id
        })

        return id
    }
}

export type ChatMessage = {
    id: string,
    content: string,
    role: ChatRole,
    status: ChatStatus
}
export type ChatRole = 'human' | 'assistant' | 'system'
export type ChatStatus = 'in_progress' | 'failed' | 'ok' | 'aborted'
