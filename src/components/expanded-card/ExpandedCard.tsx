import React, {MouseEventHandler, useState} from "react";
import {KnowledgeBase} from "../../model/knowledge_base.ts";
import {RiCloseLine} from "react-icons/ri";
import Button from "../basic/button/button.tsx";
import {Link, useNavigate} from "react-router-dom";

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

    return (
        <div
            className="h-28 w-full select-none transform-gpu duration-150 group cursor-pointer">
            <div className={`origin-center bg-zinc-50 hover:border-gray-300 rounded-lg border-solid border-2 h-full p-1`}
                 onClick={handleClickCard}
            >
                <div className="text-zinc-600 text-sm font-medium">{props.knowledgeBase.name}</div>
                <Button className="hidden group-hover:visible group-hover:flex absolute right-0 top-0" type="text" onClick={() => {
                }} icon={RiCloseLine}/>
            </div>
        </div>
    )
}
