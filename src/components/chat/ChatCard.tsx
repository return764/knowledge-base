import {Chat} from "../../package/api/chat.ts";
import {useNavigate} from "react-router-dom";

type ChatCardProps = {
    chat: Chat
}

function ChatCard(props: ChatCardProps) {
    const navigate = useNavigate();

    const handleClickCard = () => {
        navigate(props.chat.id)
    }

    return (
        <div className="cursor-pointer" onClick={handleClickCard}>
            <div className="p-2 bg-white hover:shadow hover:border-gray-300 rounded-lg border-solid border">
                {props.chat.name}
            </div>
        </div>
    );
}

export default ChatCard;
