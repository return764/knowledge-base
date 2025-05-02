import {ChatMessage, ChatRole} from "../package/api/chat.ts";
import {ChatBlock} from "../store/chat.ts";

export const buildOkBlocks = (messages: ChatMessage[]): ChatBlock[] => {
    return messages.map(it => new ChatBlock(it))
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

export const combineMessage = (message: ChatMessage, msgToken: string) => {
    message.content = message.content.concat(msgToken)
}
