import {ChatSegment} from "./ChatSegment.tsx";
import {useEffect, useMemo, useRef} from "react";
import {useAtom} from "jotai/index";
import {isReadyAtom, messagesAtom} from "../../store/chat.ts";

function ChatPanel() {
    const [messages] = useAtom(messagesAtom)
    const [isReady] = useAtom(isReadyAtom)
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
        <div ref={panelRef} className="flex flex-grow flex-col overflow-y-scroll flex-flow h-0 -mx-2 gap-4 mb-2">
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
