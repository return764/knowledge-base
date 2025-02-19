import {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {ChatHistory, ChatSettings} from "../../api/chat.ts";
import {useQuery} from "../../hooks/useQuery.ts";
import {ChatContext, ChatMessage, ChatStatus} from "./ChatContext.tsx";
import {buildMessage, buildOkBlocks} from "../../utils/chat.ts";
import {useParams} from "react-router-dom";
import {API} from "../../api";


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
    const {data: chat, mutate} = useQuery("chat", "queryById", {id: chatId})
    const {id} = useParams()
    const {data, isLoading, error} = useQuery<ChatHistory[]>('chat', 'queryHistoryByChatId', {chatId: id}, {refreshInterval: 0})
    const [settings, setSettings] = useState<ChatSettings>(JSON.parse(chat?.settings ?? "{}"));
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

    const saveSettings = (settings: ChatSettings) => {
        setSettings({...settings})
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
            API.chat.insertHistory(chat.id, message)
        }
    }

    return (
        <ChatContext.Provider value={{
            chat,
            messages,
            chatBlocks,
            updateChatMessage,
            settings,
            saveSettings,
            isReady
        }}>
            {props.children}
        </ChatContext.Provider>
    )
}
