import {RiRobot2Line, RiUser3Line} from "react-icons/ri";
import {useMemo} from "react";
import {ChatMessage} from "./ChatContext.tsx";

type ChatSegmentProps = {
    message: ChatMessage
}

export function ChatSegment(props: ChatSegmentProps) {
    const {message} = props;

    const isAI = useMemo(() => message.role === 'ai', [message.role])

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
                {message.content}
            </div>
        </div>
    )
}
