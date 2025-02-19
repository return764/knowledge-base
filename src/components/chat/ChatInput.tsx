import Textarea from "../basic/form/components/textarea.tsx";
import Button from "../basic/button/button.tsx";
import {KeyboardEvent, useState} from "react";
import {useChatHelper} from "../../hooks/useChatHelper.ts";

type ChatInputProps = {
    className?: string,
}

function ChatInput(props: ChatInputProps) {
    const [text, setText] = useState<string>()
    const {sendMessage} = useChatHelper()

    const handleChange = (v: string) => {
        setText(v)
    }

    const handleSendMessage = async () => {
        if (text) {
            setText('')
            await sendMessage(text)
        }
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
                <Button disabled={text?.length === 0} onClick={handleSendMessage}>发送</Button>
            </div>
        </div>
    );
}

export default ChatInput;
