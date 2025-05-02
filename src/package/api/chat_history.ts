import {APIAbc} from "./api.ts";

import {ChatMessage} from "./chat.ts";

export type ChatHistory = {
    id: string
    chat_id: string
    content: string
    role: 'ai' | 'human' | 'system'
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

    async insertHistory(chatId: string, message: ChatMessage) {
        await this.table('chat_history')
            .insert({
                chat_id: chatId,
                content: message.content,
                role: message.role
            })
            .execute();
    }
}
