import {RiRobot2Line, RiUser3Line} from "react-icons/ri";
import {useMemo} from "react";
import MessageMarkdown from "./message/MessageMarkdown.tsx";
import {ChatMessage} from "../../package/api/chat.ts";

type ChatSegmentProps = {
    message: ChatMessage
}

export function ChatSegment(props: ChatSegmentProps) {
    const {message} = props

    const isAI = useMemo(() => message.role === 'assistant', [message.role])
    const isInProgress = useMemo(() => message.status === 'in_progress', [message.status])
    const isFailed = useMemo(() => message.status === 'failed', [message.status])

    let content = message.content;

    if (isInProgress) {
        content = content + '...'
    }

    return (
        <div className="mx-2">
            <div className={`mb-2 flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                {
                    isAI ?
                        <RiRobot2Line size={32} className="text-primary rounded-full border p-1"/> :
                        <RiUser3Line size={32} className="text-zinc-600 rounded-full border p-1"/>
                }
            </div>
            <div className={`w-full flex flex-col ${!isAI && 'items-end'}`}>
                {
                    isAI ?
                        <div
                            className={`rounded-md shadow px-4 py-2 w-fit ${isInProgress && 'border border-primary'} ${isFailed && 'border border-red-500'}`}>
                            <MessageMarkdown content={content}/>
                        </div>
                        :
                        <div className="rounded-md shadow px-4 py-2 w-fit relative bg-primary text-white max-w-[70%]">
                            <div className="whitespace-pre-wrap select-text">
                                {content}
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
