import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Chat} from "../model/chat.ts";
import ChatInput from "../components/chat/ChatInput.tsx";
import ChatPanel from "../components/chat/ChatPanel.tsx";
import {ChatContextProvider} from "../components/chat/ChatContextProvider.tsx";
import React, {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";

function ChatPage() {
    const navigate = useNavigate()
    const {chat} = useContext(ChatContext)

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="flex">
                    <Button onClick={() => {
                        navigate(-1)
                    }} icon={MdOutlineArrowBackIosNew} type="text"/>
                    <div className="text-primary text-xl leading-none my-auto">{chat?.name}</div>
                </div>
            </div>
            <ChatPanel/>
            <ChatInput />
        </div>
    )
}

const WrapCmp = (Cmp: () => React.ReactElement) => {
    return () => {
        const chat = useLoaderData() as Chat
        return (
            <ChatContextProvider chat={chat}>
                <Cmp/>
            </ChatContextProvider>
        )
    }
}

export default WrapCmp(ChatPage);
