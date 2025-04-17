import {createContext, Dispatch, SetStateAction} from "react";
import {Chat, ChatSettings} from "../../package/api/chat.ts";
import {ChatBlock} from "./ChatContextProvider.tsx";


export type ChatMessage = {
    content: string,
    role: ChatRole
}

export type ChatRole = 'human' | 'ai' | 'system'

export type ChatStatus = 'processing' | 'failed' | 'ok'


type ChatContextProps = {
    chat?: Chat
    messages: ChatMessage[]
    chatBlocks: ChatBlock[]
    updateChatMessage: (message: ChatMessage, status: ChatStatus) => void,
    settings: ChatSettings
    saveSettings: (settings: ChatSettings) => void
    isReady: boolean
}

export const ChatContext = createContext<ChatContextProps>({
    chat: undefined,
    messages: [],
    chatBlocks: [],
    updateChatMessage: () => {},
    settings: {},
    saveSettings: () => {},
    isReady: false
});
