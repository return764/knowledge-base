import React from "react";
import {useLoaderData} from "react-router-dom";
import {Chat} from "../api/chat.ts";
import {ChatContextProvider} from "./chat/ChatContextProvider.tsx";

export const WrapChatContext = (Cmp: () => React.ReactElement) => {
    return () => {
        const chat = useLoaderData() as Chat

        return (
            <ChatContextProvider chat={chat}>
                <Cmp/>
            </ChatContextProvider>
        )
    }
}
