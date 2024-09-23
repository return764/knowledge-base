import {ChatMessage, ChatRole} from "../components/chat/ChatContext.tsx";
import {ChatBlock} from "../components/chat/ChatContextProvider.tsx";

export const buildOkBlocks = (messages: ChatMessage[]): ChatBlock[] => {
    return messages.map(it => (
        {
            message: it,
            status: 'ok'
        }
    ))
}

export const buildMessage = (content: string, role: ChatRole): ChatMessage => {
    return {content, role}
}

export const buildHumanMessage = (content: string): ChatMessage => {
    return buildMessage(content, "human")
}

export const buildAiMessage = (content: string): ChatMessage => {
    return buildMessage(content, "ai")
}

export const buildChatBlock = (message: ChatMessage, status: ChatBlock['status'] = 'ok') => {
    return {message, status}
}
