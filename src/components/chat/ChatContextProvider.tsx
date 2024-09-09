import {PropsWithChildren, useEffect, useState} from "react";
import {Chat, ChatHistory} from "../../model/chat.ts";
import {useQuery} from "../../hooks/useQuery.ts";
import {Channel, invoke} from "@tauri-apps/api/core";
// import {API} from "../../model";
import {ChatContext, ChatMessage, ChatRole} from "./ChatContext.tsx";

type StreamMessageResponse = {
    done?: boolean,
    appendMessage: string
}

export const ChatContextProvider = (props: PropsWithChildren<{chat: Chat}>) => {
    const {chat} = props
    const {data} = useQuery<ChatHistory[]>('chat', 'queryHistoryByChatId', {chatId: chat.id}, {refreshInterval: 0})
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (data) {
            const result = []
            if (chat.prompts) {
                result.push(buildMessage(chat.prompts, 'system'))
            }
            data?.forEach(it => {
                result.push(buildMessage(it.content, it.role))
            })
            setMessages(result)
            console.log(data)
        }
    }, [data]);

    const buildMessage = (content: string, role: ChatRole): ChatMessage => {
        return {content, role}
    }

    const sendMessage = async (content: string) => {
        const message = buildMessage(content, 'human')
        const chatMessages = [...messages, message]
        setMessages(chatMessages)

        const onEvent = new Channel<StreamMessageResponse>()
        onEvent.onmessage = handleMessage(chatMessages)
        await invoke("send_chat_message", {messages: chatMessages, onEvent, chatId: chat.id})
        // await API.chat.insertHistory(chat.id, message)
    }

    const handleMessage = (chatMessages: ChatMessage[]) => {
        let cacheMessages = chatMessages
        let msg = ""
        return (message: StreamMessageResponse) => {
            msg = msg.concat(message.appendMessage)
            setMessages([...cacheMessages, buildMessage(msg, 'ai')])
            if (message.done) {
                msg = ""
            }
        }
    }

    return (
        <ChatContext.Provider value={{
            chat,
            messages,
            sendMessage
        }}>
            {props.children}
        </ChatContext.Provider>
    )
}
