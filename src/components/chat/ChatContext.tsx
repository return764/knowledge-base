import {createContext} from "react";
import {Chat} from "../../model/chat.ts";


export type ChatMessage = {
    content: string,
    role: ChatRole
}

export type ChatRole = 'human' | 'ai' | 'system'

type ChatContextProps = {
    chat?: Chat,
    messages: ChatMessage[],
    sendMessage: (message: string) => Promise<void>
}

export const ChatContext = createContext<ChatContextProps>({
    chat: undefined,
    messages: [],
    sendMessage: async () => {}
});
