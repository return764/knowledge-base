import {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import {Channel, invoke} from "@tauri-apps/api/core";
import {buildAiMessage, buildHumanMessage, combineMessage} from "../utils/chat.ts";
import { ChatSettings } from "../api/chat.ts";
import { API } from "../api";

type StreamMessageResponse =
    | { event: "appendMessage", data: { content: string } }
    | { event: "error", data: { message: string } }
    | { event: "done" }

// type MessageStatus = StreamMessageResponse["event"]

export const useChatHelper = () => {
    const {updateChatMessage, chat, saveSettings} = useContext(ChatContext)

    const sendMessage = async (content: string) => {
        const message = buildHumanMessage(content)
        updateChatMessage(message, "ok")

        const onEvent = new Channel<StreamMessageResponse>()
        onEvent.onmessage = handleMessage()
        await invoke("send_chat_message", {message, onEvent, chatId: chat!!.id})
    }

    const handleMessage = () => {
        let msg = buildAiMessage("")
        updateChatMessage(msg, "processing")
        return (message: StreamMessageResponse) => {
            switch (message.event) {
                case "appendMessage":
                    combineMessage(msg, message.data.content)
                    updateChatMessage(msg, "processing")
                    break
                case "error":
                    updateChatMessage(msg, "failed")
                    break
                case "done":
                    updateChatMessage(msg, "ok")
                    break
            }

        }
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
