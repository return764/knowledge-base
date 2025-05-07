import {APIAbc} from "./api.ts";

import {ChatMessage, ChatRole, ChatStatus} from "./chat.ts";

export type ChatHistory = {
    id: string
    chat_id: string
    content: string
    role: ChatRole,
    status: ChatStatus,
    createdAt: string
}

export class ChatHistoryAPI extends APIAbc<ChatHistory> {
    protected tableName: string = 'chat_history';

    async queryByChatId(chatId: string) {
        return await this.table('chat_history')
            .where('chat_id = ?', chatId)
            .orderBy('created_at')
            .query();
    }

    async upsertHistory(chatId: string, message: ChatMessage) {
        const dbMessage = await this.queryById(message.id)
        if (dbMessage) {
            await this.update(message)
        } else {
            await this.insert({
                chat_id: chatId,
                ...message
            })
        }
    }
}
