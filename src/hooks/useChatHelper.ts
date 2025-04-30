import {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import {buildHumanMessage} from "../utils/chat.ts";
import { ChatSettings } from "../package/api/chat.ts";
import { API } from "../package/api";
import {sendChatMessage} from "../package/assistant";

export const useChatHelper = () => {
    const {updateChatMessage, chat, saveSettings} = useContext(ChatContext)

    const sendMessage = async (content: string) => {
        const message = buildHumanMessage(content)
        updateChatMessage(message, "ok")

        await sendChatMessage(updateChatMessage, chat!!.id, message)
    }

    const updateSettings = async (settings: ChatSettings) => {
        await API.chat.saveSettings(chat?.id!!, settings)
        saveSettings(settings);
    }

    return {
        sendMessage,
        updateSettings
    }
}
