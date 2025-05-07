import Textarea from "../basic/form/components/textarea.tsx";
import {KeyboardEvent, useState} from "react";
import {useChatHelper} from "../../hooks/useChatHelper.ts";
import {useAtom} from "jotai/index";
import {abortControllerAtom, chatAtom} from "../../store/chat.ts";
import ChatSendButton from "./ChatSendButton.tsx";

type ChatInputProps = {
    className?: string,
}

function ChatInput(props: ChatInputProps) {
    const [text, setText] = useState<string>()
    const {sendMessage} = useChatHelper()
    const [abortController] = useAtom(abortControllerAtom)
    const [chat] = useAtom(chatAtom)

    const handleChange = (v: string) => {
        setText(v)
    }

    const handleSendMessage = async () => {
        if (text) {
            setText('')
            await sendMessage(text)
        }
    }

    const handleAbortSend = async () => {
        const controller = abortController[chat?.id!!]
        controller.abort()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className={`${props.className} min-h-32 rounded shadow p-2`}>
            <Textarea
                placeholder="输入问题"
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="outline-none h-24 w-full"
                resize={false}
            />
            <div className="flex justify-end">
                <ChatSendButton
                    disabled={text?.length === 0}
                    inProgress={!!abortController[chat?.id!!]}
                    onAbort={handleAbortSend}
                    onClick={handleSendMessage}></ChatSendButton>
            </div>
        </div>
    );
}

export default ChatInput;
