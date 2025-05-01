import {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {useQuery} from "../../hooks/useQuery.ts";
import {ChatContext, ChatMessage, ChatStatus} from "./ChatContext.tsx";
import {buildMessage, buildOkBlocks} from "../../utils/chat.ts";
import {useParams} from "react-router-dom";
import {API} from "../../package/api";
import {ChatHistory} from "../../package/api/chat_history.ts";


export class ChatBlock {
    message: ChatMessage
    status : ChatStatus

    constructor(message: ChatMessage, status: ChatStatus = 'ok') {
        this.message = message
        this.status = status
    }
}

export const ChatContextProvider = (props: PropsWithChildren<{chatId: string}>) => {
    const {chatId} = props
    const {data: chat, mutate} = useQuery("chat", "queryById", chatId)
    const {data: settings, mutate: mutateSettings} = useQuery("chatSettings", "getSettings", chatId)
    const {id} = useParams()
    const {data, isLoading, error} = useQuery<ChatHistory[]>('chatHistory', 'queryByChatId', id, {refreshInterval: 0})
    const [chatBlocks, setChatBlocks] = useState<ChatBlock[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        if (isLoading || error) {
            setIsReady(false)
            return
        }
        setIsReady(true)
    }, [isLoading, error]);

    useEffect(() => {
        if (data) {
            const result = []
            // TODO 目前prompt集成在后台，这里没有用上
            if (chat?.prompts) {
                result.push(buildMessage(chat.prompts, 'system'))
            }
            data?.forEach(it => {
                result.push(buildMessage(it.content, it.role))
            })
            setChatBlocks(buildOkBlocks(result))
        }
    }, [data]);

    const messages: ChatMessage[] = useMemo(() => {
        return chatBlocks.map(it => it.message)
    }, [chatBlocks])

    const refreshSettings = () => {
        mutateSettings()
    }

    const updateChatMessage = (message: ChatMessage, status: ChatStatus = "processing") => {
        setChatBlocks((chatBlocks) => {
            if (chatBlocks.length === 0) {
                return [new ChatBlock(message, status)]
            }
            const latestChatBlock = chatBlocks[chatBlocks.length - 1]
            if (latestChatBlock.status != "processing") {
                return [...chatBlocks, new ChatBlock(message, status)]
            }
            let cacheBlocks = chatBlocks.slice(0, -1)
            return [...cacheBlocks, new ChatBlock(message, status)]
        })

        if (status === "ok") {
            API.chatHistory.insertHistory(chat.id, message)
        }
    }

    return (
        <ChatContext.Provider value={{
            chat,
            messages,
            chatBlocks,
            updateChatMessage,
            settings,
            refreshSettings,
            isReady
        }}>
            {props.children}
        </ChatContext.Provider>
    )
}
