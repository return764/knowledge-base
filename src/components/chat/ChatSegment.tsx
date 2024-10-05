import {RiRobot2Line, RiUser3Line} from "react-icons/ri";
import {useMemo} from "react";
import {ChatBlock} from "./ChatContextProvider.tsx";
import MessageMarkdown from "./message/MessageMarkdown.tsx";

type ChatSegmentProps = {
    blockMessage: ChatBlock
}

export function ChatSegment(props: ChatSegmentProps) {
    const {blockMessage} = props

    const isAI = useMemo(() => blockMessage.message.role === 'ai', [blockMessage.message.role])
    const isProcessing = useMemo(() => blockMessage.status === 'processing', [blockMessage.status])
    const isFailed = useMemo(() => blockMessage.status === 'failed', [blockMessage.status])

    return (
        <div className="mx-2">
            <div className={`mb-2 flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                {
                    isAI ?
                        <RiRobot2Line size={32} className="text-primary rounded-full border p-1"/> :
                        <RiUser3Line size={32} className="text-zinc-600 rounded-full border p-1"/>
                }
            </div>
            <div className={`select-auto rounded-md shadow p-2 ${isAI ? '' : 'w-fit float-right bg-primary text-white'} ${isProcessing && 'border border-primary'} ${isFailed && 'border border-red-500'}`}>
                <MessageMarkdown content={blockMessage.message.content}/>
                {
                    isProcessing && <span>...</span>
                }
            </div>
        </div>
    )
}
