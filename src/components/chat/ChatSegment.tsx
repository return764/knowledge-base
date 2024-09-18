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

    return (
        <div className="mx-2">
            <div className={`mb-2 flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                {
                    isAI ?
                        <RiRobot2Line size={32} className="text-primary rounded-full border p-1"/> :
                        <RiUser3Line size={32} className="text-zinc-600 rounded-full border p-1"/>
                }
            </div>
            <div className="select-auto rounded-md shadow p-2">
                <MessageMarkdown content={blockMessage.message.content}/>
                {
                    // todo 优化
                    blockMessage.status === "processing" && <span>...</span>
                }
            </div>
        </div>
    )
}
