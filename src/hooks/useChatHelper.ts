import {buildHumanMessage} from "../utils/chat.ts";
import { ChatSettings } from "../package/api/chat_settings.ts";
import { API } from "../package/api";
import {sendChatMessage} from "../package/assistant";
import {useAtom, useSetAtom} from "jotai/index";
import {chatAtom, updateChatMessageAtom} from "../store/chat.ts";
import { useSWRConfig } from "swr";

export const useChatHelper = () => {
    const { mutate } = useSWRConfig()
    const [chat] = useAtom(chatAtom)
    const updateChatMessage = useSetAtom(updateChatMessageAtom)

    const sendMessage = async (content: string) => {
        const message = buildHumanMessage(content)
        await updateChatMessage(message, "ok")

        await sendChatMessage(chat!!.id, message)
    }

    // todo 考虑是否有别的字段需要添加到chat中
    const updateSettings = async (settings: ChatSettings) => {
        await API.chatSettings.saveSettings(settings)
        await mutate('chatSettings.getSettings')
    }

    return {
        sendMessage,
        updateSettings
    }
}
