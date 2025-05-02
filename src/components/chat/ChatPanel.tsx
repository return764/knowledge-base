import {ChatSegment} from "./ChatSegment.tsx";
import {useEffect, useMemo, useRef} from "react";
import {useAtom} from "jotai/index";
import {chatBlocksAtom, isReadyAtom} from "../../store/chat.ts";

function ChatPanel() {
    const [chatBlocks] = useAtom(chatBlocksAtom)
    const [isReady] = useAtom(isReadyAtom)
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
        <div ref={panelRef} className="flex flex-grow flex-col overflow-y-scroll flex-flow h-0 -mx-2 gap-4 mb-2">
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
