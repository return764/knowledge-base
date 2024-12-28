import {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {Chat, ChatHistory, ChatSettings} from "../../model/chat.ts";
import {useQuery} from "../../hooks/useQuery.ts";
import {ChatContext, ChatMessage} from "./ChatContext.tsx";
import {buildMessage, buildOkBlocks} from "../../utils/chat.ts";
import {useParams} from "react-router-dom";

export type ChatBlock = {
    message: ChatMessage,
    status: 'processing' | 'failed' | 'ok'
}

export const ChatContextProvider = (props: PropsWithChildren<{chat: Chat}>) => {
    const {chat} = props
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
            if (chat.prompts) {
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

    return (
        <ChatContext.Provider value={{
            chat,
            messages,
            chatBlocks,
            setChatBlocks,
            settings,
            setSettings,
            isReady
        }}>
            {props.children}
        </ChatContext.Provider>
    )
}
