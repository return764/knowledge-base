import {createContext, Dispatch, SetStateAction} from "react";
import {Chat} from "../../model/chat.ts";
import {ChatBlock} from "./ChatContextProvider.tsx";


export type ChatMessage = {
    content: string,
    role: ChatRole
}

export type ChatRole = 'human' | 'ai' | 'system'

type ChatContextProps = {
    chat?: Chat,
    messages: ChatMessage[],
    chatBlocks: ChatBlock[],
    setChatBlocks: Dispatch<SetStateAction<ChatBlock[]>>
    isReady: boolean,
}

export const ChatContext = createContext<ChatContextProps>({
    chat: undefined,
    messages: [],
    chatBlocks: [],
    setChatBlocks: () => {},
    isReady: false
});
