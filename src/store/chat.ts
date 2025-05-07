import { atom } from 'jotai'
import {Chat, ChatMessage} from '../package/api/chat'
import { ChatSettings } from '../package/api/chat_settings'
import {API} from "../package/api";


export const chatAtom = atom<Chat | undefined>(undefined)
export const settingsAtom = atom<ChatSettings>({ id: '' })
export const isReadyAtom = atom<boolean>(false)

export const messagesAtom = atom<ChatMessage[]>([])

// ChatBlock需要重构，添加新的aborted状态，
export const updateChatMessageAtom = atom(
    null,
    async (get, set, updatedMessage: ChatMessage) => {
        const messages = get(messagesAtom)
        const chat = get(chatAtom)

        const index = messages.findIndex(m => m.id === updatedMessage.id)

        if (index !== -1) {
            const newMessages = [...messages]
            newMessages[index] = updatedMessage
            set(messagesAtom, newMessages)
        } else {
            set(messagesAtom, [...messages, updatedMessage])
        }

        await API.chatHistory.upsertHistory(chat!!.id, updatedMessage)
    }
)
