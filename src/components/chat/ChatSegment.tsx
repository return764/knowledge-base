import {RiRobot2Line, RiUser3Line} from "react-icons/ri";
import {useMemo} from "react";

type ChatSegmentProps = {
    role?: 'user' | 'assistant'
}

export function ChatSegment(props: ChatSegmentProps) {
    const {role = 'assistant'} = props;

    const isAssistant = useMemo(() => role === 'assistant', [role])

    return (
        <div className="mx-2">
            <div className={`mb-2 flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                {
                    isAssistant ?
                        <RiRobot2Line size={32} className="text-primary rounded-full border p-1"/> :
                        <RiUser3Line size={32} className="text-zinc-600 rounded-full border p-1"/>
                }
            </div>
            <div className="select-auto rounded-md shadow p-2">
                chat.......................
            </div>
        </div>
    )
}
