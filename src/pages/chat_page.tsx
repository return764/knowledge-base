import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew, MdOutlineSettings} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import ChatInput from "../components/chat/ChatInput.tsx";
import ChatPanel from "../components/chat/ChatPanel.tsx";
import {useContext, useEffect} from "react";
import {ChatContext} from "../components/chat/ChatContext.tsx";
import Modal from "../components/basic/modal/modal.tsx";
import { useToggle } from "ahooks";
import ChatSettings from "../components/chat/ChatSettings.tsx";
import {useForm} from "../components/basic/form/form.tsx";
import {useChatHelper} from "../hooks/useChatHelper.ts";
import toast from "react-hot-toast";
import {WrapChatContext} from "../components/WrapChatContext.tsx";
import {DEFAULT_CHAT_TITLE} from "../package/api/chat.ts";
import {API} from "../package/api";
import AnimatedTitle from "../components/basic/animated_title.tsx";
import {generateChatTitle} from "../package/assistant";

function ChatPage() {
    const navigate = useNavigate()
    const {chat, messages} = useContext(ChatContext)
    const [visible, {toggle}] = useToggle();
    const [form] = useForm();
    const {updateSettings} = useChatHelper();

    const handleModal = () => {
        toggle()
    }

    const saveSettings = async () => {
        try {
            await updateSettings(form.getFieldValues())
            toast.success("保存设置成功")
        } catch (e) {
            toast.error("保存设置失败")
        }
    }

    useEffect(() => {
        if (messages.length >= 2 && chat?.name === DEFAULT_CHAT_TITLE) {
            generateChatTitle(chat.id, messages)
                .then(res => {
                    console.log(res)
                    API.chat.update({
                        id: chat.id,
                        name: res as string
                    })
                })
        }
    }, [messages.length]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="flex">
                    <Button onClick={() => {
                        navigate(-1)
                    }} icon={MdOutlineArrowBackIosNew} type="text"/>
                    <AnimatedTitle
                        text={chat?.name}
                        className="text-primary text-xl leading-none my-auto"
                    />
                </div>
                <div>
                    <Button onClick={handleModal} icon={MdOutlineSettings}>设置</Button>
                </div>
            </div>
            <ChatPanel/>
            <ChatInput/>
            <Modal onClose={handleModal} onConfirm={saveSettings} open={visible} title="聊天设置">
                <ChatSettings form={form}/>
            </Modal>
        </div>
    )
}

export default WrapChatContext(ChatPage);
