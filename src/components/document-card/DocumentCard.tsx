import React, {MouseEventHandler} from 'react';
import Button from "../basic/button/button.tsx";
import {RiDeleteBin6Line} from "react-icons/ri";
import {DocumentData} from "../../model/dataset.ts";
import Badge from "../basic/badge/badge.tsx";
import {PiTextTFill} from "react-icons/pi";


type DocumentCardProps = {
    index: number,
    document: DocumentData
}

function DocumentCard(props: DocumentCardProps) {

    const handleClickCard: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation()
    }

    return (
        <div
            className="group h-44 w-full select-none transform-gpu duration-150 cursor-pointer">
            <div
                className={`origin-center bg-zinc-50 group-hover:shadow group-hover:bg-white group-hover:border-gray-300 rounded-lg border-solid border h-full p-3 overflow-y-hidden`}
                onClick={handleClickCard}
            >
                <div className="pb-1 flex items-center">
                    <Badge># {props.index}</Badge>
                    <div className="text-xs text-zinc-500 font-extralight text-ellipsis-c text-right">ID: {props.document.id}</div>
                </div>
                <div className="text-zinc-600 text-sm font-light">{props.document.text}</div>
            </div>
            <div className="footer absolute bottom-0 p-3 rounded-lg hidden group-hover:visible group-hover:flex inset-0 items-end bg-gradient-to-t from-white via-white via-20% to-60% to-transparent">
                <div className="flex flex-1 justify-between">
                    <div className="flex items-center text-xs/[20px] text-zinc-500">
                        <PiTextTFill fill="#aaa"/>
                        <span>{props.document.text.length}</span>
                    </div>
                    <Button
                        type="text"
                        size="small"
                        onClick={() => {
                        }} icon={RiDeleteBin6Line}/>
                </div>
            </div>
        </div>
    );
}

export default DocumentCard;
