import {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import {Channel, invoke} from "@tauri-apps/api/core";
import {buildMessage} from "../utils/chat.ts";
import {ChatBlock} from "../components/chat/ChatContextProvider.tsx";

type StreamMessageResponse = {
    done?: boolean,
    appendMessage: string
}

// sendMessage: (message: string) => Promise<void>,


export const useChatHelper = () => {
    const {chatBlocks, setChatBlocks, chat} = useContext(ChatContext)


    const sendMessage = async (content: string) => {
        const message = buildMessage(content, 'human')
        const blocks = [
            ...chatBlocks,
            {message, status: 'ok'},
            {message: buildMessage('', 'ai'), status: 'processing'}
        ] as ChatBlock[]
        setChatBlocks(blocks)

        const onEvent = new Channel<StreamMessageResponse>()
        onEvent.onmessage = handleMessage(blocks)
        await invoke("send_chat_message", {messages: blocks.map(it => it.message), onEvent, chatId: chat!!.id})
    }

    const handleMessage = (chatBlocks: ChatBlock[]) => {
        let cacheBlocks = chatBlocks.slice(0, -1)
        let msg = ""
        return (message: StreamMessageResponse) => {
            msg = msg.concat(message.appendMessage)
            setChatBlocks([...cacheBlocks, {message: buildMessage(msg, 'ai'), status: 'processing'}])
            if (message.done) {
                setChatBlocks([...cacheBlocks, {message: buildMessage(msg, 'ai'), status: 'ok'}])
                msg = ""
            }
        }
    }

    return {
        sendMessage,
    }
}
