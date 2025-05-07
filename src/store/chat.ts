import { atom } from 'jotai'
import {Chat, ChatMessage} from '../package/api/chat'
import { ChatSettings } from '../package/api/chat_settings'
import {API} from "../package/api";

export const chatAtom = atom<Chat | undefined>(undefined)
export const settingsAtom = atom<ChatSettings>({ id: '' })
export const isReadyAtom = atom<boolean>(false)
export const messagesAtom = atom<ChatMessage[]>([])
export const abortControllerAtom = atom<Record<string, AbortController>>({})


export const abortControllerActions = {
    add: atom(null, (_get, set, { key, controller }) => {
        set(abortControllerAtom, prev => ({ ...prev, [key]: controller }))
    }),
    remove: atom(null, (get, set, key: string) => {
        const { [key]: _, ...rest } = get(abortControllerAtom)
        set(abortControllerAtom, rest)
    }),
    abort: atom(null, (get, set, key: string) => {
        get(abortControllerAtom)[key]?.abort()
        const { [key]: _, ...rest } = get(abortControllerAtom)
        set(abortControllerAtom, rest)
    })
}

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
