import React from "react";
import {useParams} from "react-router-dom";
import {ChatContextProvider} from "./chat/ChatContextProvider.tsx";

export const WrapChatContext = (Cmp: () => React.ReactElement) => {
    return () => {
        const {id: chatId} = useParams()

        return (
            <ChatContextProvider chatId={chatId!!}>
                <Cmp/>
            </ChatContextProvider>
        )
    }
}
