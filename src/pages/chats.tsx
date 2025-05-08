import Button from "../components/basic/button/button.tsx";
import {FaPlus} from "react-icons/fa6";
import ChatCard from "../components/chat/ChatCard.tsx";
import {useQuery} from "../hooks/useQuery.ts";
import {Chat} from "../package/api/chat.ts";
import {API} from "../package/api";
import {useNavigate} from "react-router-dom";

function Chats() {
    const {data} = useQuery<Chat[]>('chat', 'queryAll')
    const navigate = useNavigate();

    const handleNewChat = async () => {
        const chatId = await API.chat.newChat()
        chatId && navigate(chatId)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="text-primary text-xl leading-none my-auto">聊天</div>
                <div><Button onClick={handleNewChat} icon={FaPlus}>创建新对话</Button></div>
            </div>
            <div className="flex flex-grow flex-col gap-y-1.5 overflow-y-scroll flex-flow h-0">
                {
                    data?.map(it => <ChatCard key={it.id} chat={it}/>)
                }
            </div>
        </div>
    )
}

export default Chats;
