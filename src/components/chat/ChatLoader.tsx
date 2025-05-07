import {PropsWithChildren, useEffect} from "react";
import {useQuery} from "../../hooks/useQuery.ts";
import {ChatHistory} from "../../package/api/chat_history.ts";
import {buildSystemMessage, toChatMessage} from "../../utils/chat.ts";
import {useAtom, useSetAtom} from "jotai";
import {
    chatAtom,
    settingsAtom,
    isReadyAtom,
    messagesAtom,
} from "../../store/chat";

export const ChatLoader = (props: PropsWithChildren<{chatId: string}>) => {
    const {chatId} = props
    const {data: chat, mutate} = useQuery("chat", "queryById", chatId)
    const {data: settings, mutate: mutateSettings} = useQuery("chatSettings", "getSettings", chatId)
    const {data: history, isLoading, error} = useQuery<ChatHistory[]>('chatHistory', 'queryByChatId', chatId, {refreshInterval: 0})

    const [chatAtomValue, setChatAtom] = useAtom(chatAtom)
    const setMessages = useSetAtom(messagesAtom)
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
        if (history) {
            const result = []
            // TODO prompts的位置有待确认
            if (chat?.prompts) {
                result.push(buildSystemMessage(chat.prompts))
            }
            history?.forEach(it => {
                result.push(toChatMessage(it))
            })
            setMessages(result)
        }
    }, [history]);

    return (
        <>
            {props.children}
        </>
    )
}
