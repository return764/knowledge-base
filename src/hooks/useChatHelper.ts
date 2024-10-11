import {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import {Channel, invoke} from "@tauri-apps/api/core";
import {buildAiMessage, buildChatBlock, buildHumanMessage} from "../utils/chat.ts";
import {ChatBlock} from "../components/chat/ChatContextProvider.tsx";
import { ChatSettings } from "../model/chat.ts";
import { API } from "../model/index.ts";

type StreamMessageResponse = 
    | { event: "appendMessage", data: { content: string } }
    | { event: "error", data: { message: string } }
    | { event: "done" }

export const useChatHelper = () => {
    const {chatBlocks, setChatBlocks, chat, setSettings} = useContext(ChatContext)


    const sendMessage = async (content: string) => {
        const message = buildHumanMessage(content)
        const currentAiResultMessage = buildAiMessage('')
        const blocks = [
            ...chatBlocks,
            buildChatBlock(message),
            buildChatBlock(currentAiResultMessage, 'processing')
        ] as ChatBlock[]
        setChatBlocks(blocks)

        const onEvent = new Channel<StreamMessageResponse>()
        onEvent.onmessage = handleMessage(blocks)
        await invoke("send_chat_message", {messages: blocks.slice(0, -1).map(it => it.message), onEvent, chatId: chat!!.id})
    }

    const handleMessage = (chatBlocks: ChatBlock[]) => {
        let cacheBlocks = chatBlocks.slice(0, -1)
        let msg = ""
        return (message: StreamMessageResponse) => {
            switch (message.event) {
                case "appendMessage":
                    msg = msg.concat(message.data.content)
                    const chatMessageProcessing = buildAiMessage(msg)
                    setChatBlocks([...cacheBlocks, {message: chatMessageProcessing, status: 'processing'}])
                    break
                case "error":
                    //const chatMessageError = buildAiMessage(`Error: ${message.data.message}`)
                    setChatBlocks([...cacheBlocks, {message: buildAiMessage(msg), status: 'failed'}])
                    msg = ""
                    break
                case "done":
                    const chatMessageDone = buildAiMessage(msg)
                    setChatBlocks([...cacheBlocks, {message: chatMessageDone, status: 'ok'}])
                    msg = ""
                    break
            }
        }
    }

    const updateSettings = async (settings: ChatSettings) => {
        await API.chat.saveSettings(chat?.id!!, settings)
        setSettings(settings);
    }

    return {
        sendMessage,
        updateSettings
    }
}
