import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Chat} from "../model/chat.ts";
import ChatInput from "../components/chat-input/ChatInput.tsx";

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
            <div className="border flex flex-grow overflow-y-scroll flex-flow h-0">
                   asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
                    asldkaldaksjdlkajdalksdaskldmaslkdmaklsmdklasmdklasmdklasmdlkasmdklmaslkdmaklsdmalksmdlkasmdlkamskld
            </div>
            <ChatInput/>
        </div>
    )
}

export default ChatPage;
