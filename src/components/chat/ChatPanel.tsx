import {ChatSegment} from "./ChatSegment.tsx";
import {useContext, useEffect, useMemo, useRef} from "react";
import {ChatContext} from "./ChatContext.tsx";

function ChatPanel() {
    const {messages, isReady} = useContext(ChatContext)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isReady) {
            panelRef.current?.scrollTo({top: panelRef.current.scrollHeight});
        }
    }, [isReady, messages]);

    const isEmpty = useMemo(() => {
        return messages.length === 0
    }, [messages.length])

    return (
        <div ref={panelRef} className="flex flex-grow flex-col overflow-y-scroll flex-flow h-0 -mx-2 gap-4">
            {
                messages.map((it, index) => {
                    return <ChatSegment key={index} message={it}/>
                })
            }
            <div hidden={isEmpty} className="min-h-24">
            </div>
        </div>
    );
}

export default ChatPanel;
