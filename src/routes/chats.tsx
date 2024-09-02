import Button from "../components/basic/button/button.tsx";
import {FaPlus} from "react-icons/fa6";
import ChatCard from "../components/chat-card/ChatCard.tsx";
import {useQuery} from "../hooks/useQuery.ts";
import {Chat} from "../model/chat.ts";
import {API} from "../model";

function Chats() {
    const {data} = useQuery<Chat[]>('chat', 'queryAll')

    const handleNewChat = async () => {
        await API.chat.insert()
    }

    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="text-primary text-xl leading-none my-auto">聊天</div>
                    <div><Button onClick={handleNewChat} icon={FaPlus}>创建新对话</Button></div>
                </div>
                <div className="flex flex-col gap-y-1.5">
                    {
                        data?.map(it => <ChatCard chat={it}/>)
                    }
                </div>
            </div>
            {/*<Modal title={"新聊天"} onClose={toggle} open={visible} onConfirm={handleNewChat}>*/}
            {/*    <Form form={form}>*/}
            {/*        <FormItem name={"kbName"} label={"关联知识库"}>*/}
            {/*            <Input size={"small"}/>*/}
            {/*        </FormItem>*/}
            {/*    </Form>*/}
            {/*</Modal>*/}
        </div>
    )
}

export default Chats;
