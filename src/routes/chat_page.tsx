import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Chat} from "../model/chat.ts";

function ChatPage() {
    const navigate = useNavigate()
    const chat = useLoaderData() as Chat


    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="flex">
                        <Button onClick={() => {
                            navigate(-1)
                        }} icon={MdOutlineArrowBackIosNew} type="text"/>
                        <div className="text-primary text-xl leading-none my-auto">{chat.name}</div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage;
