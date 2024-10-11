import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew, MdOutlineSettings} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Chat, ChatSettings as ChatSettingsModel} from "../model/chat.ts";
import ChatInput from "../components/chat/ChatInput.tsx";
import ChatPanel from "../components/chat/ChatPanel.tsx";
import {ChatContextProvider} from "../components/chat/ChatContextProvider.tsx";
import React, {useContext, useState} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import Modal from "../components/basic/modal/modal.tsx";
import { useToggle } from "ahooks";
import ChatSettings from "../components/chat/ChatSettings.tsx";
import { API } from "../model/index.ts";
import toast from "react-hot-toast";

function ChatPage() {
    const navigate = useNavigate()
    const {chat} = useContext(ChatContext)
    const [visible, {toggle}] = useToggle();
    const [settings, setSettings] = useState<ChatSettingsModel>(JSON.parse(chat?.settings ?? "{}") as ChatSettingsModel);

    const handleModal = () => {
        toggle()
    }

    const  handleSaveSettings = async () => {
        console.log(settings);
        try {
            await API.chat.saveSettings(chat?.id!!, settings)
            toast.success("保存设置成功!")
        } catch(error) {
            console.error("save chat settings failed: " + error)
            toast.error("保存设置失败")
        }
    }

    const handleChangeSettings = (settings: ChatSettingsModel) => {
        setSettings(settings);
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
            <Modal onClose={handleModal} onConfirm={handleSaveSettings} open={visible} title="聊天设置">
                <ChatSettings onChange={handleChangeSettings} settings={settings}/>
            </Modal>
        </div>
    )
}

const WrapCmp = (Cmp: () => React.ReactElement) => {
    return () => {
        const chat = useLoaderData() as Chat
        console.log(chat);
        
        return (
            <ChatContextProvider chat={chat}>
                <Cmp/>
            </ChatContextProvider>
        )
    }
}

export default WrapCmp(ChatPage);
