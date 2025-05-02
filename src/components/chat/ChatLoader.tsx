import {PropsWithChildren, useEffect} from "react";
import {useQuery} from "../../hooks/useQuery.ts";
import {ChatHistory} from "../../package/api/chat_history.ts";
import {buildMessage, buildOkBlocks} from "../../utils/chat.ts";
import {useAtom, useSetAtom} from "jotai";
import {
    chatAtom,
    chatBlocksAtom,
    settingsAtom,
    isReadyAtom,
} from "../../store/chat";

export const ChatLoader = (props: PropsWithChildren<{chatId: string}>) => {
    const {chatId} = props
    const {data: chat, mutate} = useQuery("chat", "queryById", chatId)
    const {data: settings, mutate: mutateSettings} = useQuery("chatSettings", "getSettings", chatId)
    const {data, isLoading, error} = useQuery<ChatHistory[]>('chatHistory', 'queryByChatId', chatId, {refreshInterval: 0})

    const [chatAtomValue, setChatAtom] = useAtom(chatAtom)
    const setChatBlocks = useSetAtom(chatBlocksAtom)
    const setSettings = useSetAtom(settingsAtom)
    const setIsReady = useSetAtom(isReadyAtom)

    useEffect(() => {
        if (chat) {
            setChatAtom(chat)
        }
    }, [chat])

    useEffect(() => {
        if (settings) {
            setSettings(settings)
        }
    }, [settings])

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
            if (chat?.prompts) {
                result.push(buildMessage(chat.prompts, 'system'))
            }
            data?.forEach(it => {
                result.push(buildMessage(it.content, it.role))
            })
            setChatBlocks(buildOkBlocks(result))
        }
    }, [data]);

    return (
        <>
            {props.children}
        </>
    )
}
