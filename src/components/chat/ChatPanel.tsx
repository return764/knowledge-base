import {ChatSegment} from "./ChatSegment.tsx";
import {useContext, useEffect, useMemo, useRef} from "react";
import {ChatContext} from "./ChatContext.tsx";

function ChatPanel() {
    const {chatBlocks, isReady} = useContext(ChatContext)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isReady) {
            panelRef.current?.scrollTo({top: panelRef.current.scrollHeight});
        }
    }, [isReady, chatBlocks]);

    const isEmpty = useMemo(() => {
        return chatBlocks.length === 0
    }, [chatBlocks.length])

    return (
        <div ref={panelRef} className="flex flex-grow flex-col overflow-y-scroll flex-flow h-0 -mx-2 gap-4">
            {
                chatBlocks.map((it, index) => {
                    return <ChatSegment key={index} blockMessage={it}/>
                })
            }
            <div hidden={isEmpty} className="min-h-24">
            </div>
        </div>
    );
}

export default ChatPanel;
