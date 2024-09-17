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
