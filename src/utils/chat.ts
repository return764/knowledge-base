import {ChatMessage, ChatRole, ChatStatus} from "../package/api/chat.ts";
import {ChatHistory} from "../package/api/chat_history.ts";
import {v4 as uuidv4} from 'uuid';

export const toChatMessage = (history: ChatHistory): ChatMessage => {
    return {
        id: history.id,
        content: history.content,
        status: history.status,
        role: history.role
    }
}

export const buildMessage = (content: string, role: ChatRole, status: ChatStatus = "ok"): ChatMessage => {
    return {id: uuidv4(), content, role, status}
}

export const buildSystemMessage = (content: string): ChatMessage => {
    return buildMessage(content, "system")
}

export const buildHumanMessage = (content: string): ChatMessage => {
    return buildMessage(content, "human")
}

export const buildAiMessage = (content: string): ChatMessage => {
    return buildMessage(content, "assistant", "in_progress")
}

export const emptyAssistantMessage = (): ChatMessage => {
    return buildAiMessage("")
}

export const combineMessage = (message: ChatMessage, msgToken: string) => {
    message.content = message.content.concat(msgToken)
}
