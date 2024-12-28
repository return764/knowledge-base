import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew, MdOutlineSettings} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Chat} from "../model/chat.ts";
import ChatInput from "../components/chat/ChatInput.tsx";
import ChatPanel from "../components/chat/ChatPanel.tsx";
import {ChatContextProvider} from "../components/chat/ChatContextProvider.tsx";
import React, {useContext} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import Modal from "../components/basic/modal/modal.tsx";
import { useToggle } from "ahooks";
import ChatSettings from "../components/chat/ChatSettings.tsx";

function ChatPage() {
    const navigate = useNavigate()
    const {chat} = useContext(ChatContext)
    const [visible, {toggle}] = useToggle();

    const handleModal = () => {
        toggle()
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="flex">
                    <Button onClick={() => {
                        navigate(-1)
                    }} icon={MdOutlineArrowBackIosNew} type="text"/>
                    <div className="text-primary text-xl leading-none my-auto">{chat?.name}</div>
                </div>
                <div>
                    <Button onClick={handleModal} icon={MdOutlineSettings}>设置</Button>
                </div>
            </div>
            <ChatPanel/>
            <ChatInput/>
            <Modal onClose={handleModal} open={visible} title="聊天设置">
                <ChatSettings />
            </Modal>
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
