import {ChatSegment} from "./ChatSegment.tsx";
import {useContext} from "react";
import {ChatContext} from "./ChatContext.tsx";

function ChatPanel() {
    const {messages} = useContext(ChatContext)

    return (
        <>
            {
                messages.map(it => {
                    return <ChatSegment message={it}/>
                })
            }
        </>
    );
}

export default ChatPanel;
