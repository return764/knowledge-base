import React from "react";
import {useParams} from "react-router-dom";
import {ChatLoader} from "./chat/ChatLoader.tsx";
import {createStore, Provider} from "jotai";

export const store = createStore()

export const WrapChatContext = (Cmp: () => React.ReactElement) => {
    return () => {
        const {id: chatId} = useParams()

        return (
            <Provider store={store}>
                <ChatLoader chatId={chatId!!}>
                    <Cmp/>
                </ChatLoader>
            </Provider>
        )
    }
}
