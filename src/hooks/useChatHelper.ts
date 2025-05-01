import {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import {buildHumanMessage} from "../utils/chat.ts";
import { ChatSettings } from "../package/api/chat_settings.ts";
import { API } from "../package/api";
import {sendChatMessage} from "../package/assistant";

export const useChatHelper = () => {
    const {updateChatMessage, chat, refreshSettings} = useContext(ChatContext)

    const sendMessage = async (content: string) => {
        const message = buildHumanMessage(content)
        updateChatMessage(message, "ok")

        await sendChatMessage(updateChatMessage, chat!!.id, message)
    }

    // todo 考虑是否有别的字段需要添加到chat中
    const updateSettings = async (settings: ChatSettings) => {
        await API.chatSettings.saveSettings(settings)
        refreshSettings();
    }

    return {
        sendMessage,
        updateSettings
    }
}
