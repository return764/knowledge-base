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

    async newChat() {
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
    }
}

export type ChatMessage = {
    content: string,
    role: ChatRole
}
export type ChatRole = 'human' | 'ai' | 'system'
export type ChatStatus = 'processing' | 'failed' | 'ok'
