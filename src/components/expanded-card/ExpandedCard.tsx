import {MouseEventHandler, useState} from "react";
import {KnowledgeBase} from "../../api/knowledge_base.ts";
import {RiCloseLine} from "react-icons/ri";
import Button from "../basic/button/button.tsx";
import {useNavigate} from "react-router-dom";
import {deleteKnowledgeBase} from "../../service/knowledge_base.ts";
import toast from "react-hot-toast";

type ExpandedCardProps = {
    knowledgeBase: KnowledgeBase
}

export function ExpandedCard(props: ExpandedCardProps) {
    const {knowledgeBase} = props;
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClickCard: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation()
        setIsActive(!isActive)
        navigate(`/knowledge-base/${knowledgeBase.id}`)
    }

    const handleDeleteKnowledgeBase: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.stopPropagation()
        // TODO 异常捕获，考虑使用二次确认优化用户体验 and 处理异常
        await deleteKnowledgeBase(knowledgeBase.id)
        toast.success(`删除知识库${knowledgeBase.name}成功！`)
    }

    return (
        <div
            className="h-28 w-full select-none transform-gpu duration-150 group cursor-pointer">
            <div className={`origin-center bg-zinc-50 hover:border-gray-300 rounded-lg border-solid border-2 h-full p-1`}
                 onClick={handleClickCard}
            >
                <div className="text-zinc-600 text-sm font-medium">{props.knowledgeBase.name}</div>
                <Button className="hidden group-hover:visible group-hover:flex absolute right-0 top-0" type="text" onClick={handleDeleteKnowledgeBase} icon={RiCloseLine}/>
            </div>
        </div>
    )
}
