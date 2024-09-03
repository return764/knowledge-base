import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Chat} from "../model/chat.ts";
import ChatInput from "../components/chat/ChatInput.tsx";
import {ChatSegment} from "../components/chat/ChatSegment.tsx";

function ChatPage() {
    const navigate = useNavigate()
    const chat = useLoaderData() as Chat

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="flex">
                    <Button onClick={() => {
                        navigate(-1)
                    }} icon={MdOutlineArrowBackIosNew} type="text"/>
                    <div className="text-primary text-xl leading-none my-auto">{chat.name}</div>
                </div>
            </div>
            <div className="flex flex-grow flex-col overflow-y-scroll flex-flow h-0 -mx-2 gap-4">
                <ChatSegment/>
                <ChatSegment role="user"/>
            </div>
            <ChatInput/>
        </div>
    )
}

export default ChatPage;
