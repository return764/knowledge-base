import { atom } from 'jotai'
import {Chat, ChatMessage, ChatStatus} from '../package/api/chat'
import { ChatSettings } from '../package/api/chat_settings'
import {API} from "../package/api";

export class ChatBlock {
    message: ChatMessage
    status: ChatStatus

    constructor(message: ChatMessage, status: ChatStatus = 'ok') {
        this.message = message
        this.status = status
    }
}

export const chatAtom = atom<Chat | undefined>(undefined)
export const chatBlocksAtom = atom<ChatBlock[]>([])
export const settingsAtom = atom<ChatSettings>({ id: '' })
export const isReadyAtom = atom<boolean>(false)

export const messagesAtom = atom(
    (get) => get(chatBlocksAtom).map(it => it.message)
)

export const updateChatMessageAtom = atom(
    null,
    async (get, set, message: ChatMessage, status: ChatStatus = "processing") => {
        const chatBlocks = get(chatBlocksAtom)
        const chat = get(chatAtom)

        if (chatBlocks.length === 0) {
            set(chatBlocksAtom, [new ChatBlock(message, status)])
            return
        }

        const latestChatBlock = chatBlocks[chatBlocks.length - 1]
        if (latestChatBlock.status != "processing") {
            set(chatBlocksAtom, [...chatBlocks, new ChatBlock(message, status)])
            return
        }

        let cacheBlocks = chatBlocks.slice(0, -1)
        set(chatBlocksAtom, [...cacheBlocks, new ChatBlock(message, status)])

        if (status === "ok" && chat) {
            await API.chatHistory.insertHistory(chat.id, message)
        }
    }
)
