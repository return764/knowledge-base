"use client"
import React, {MouseEventHandler, useState} from "react";

type ExpandedCardProps = {
    index: number
}

export function ExpandedCard(props: ExpandedCardProps) {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClickCard: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation()
        setIsActive(!isActive)
    }

    return (
        <div
            className="h-28 w-36 snap-center -skew-y-6 hover:-translate-y-5 hover:-translate-x-2 hover:skew-x-6 transform-gpu duration-150"
            >
            <div className={`origin-center bg-zinc-50 hover:border-gray-300 rounded-lg border-solid border-2 h-full p-1`}
                 onClick={handleClickCard}
            >
                <div className="text-zinc-600 text-sm font-medium">Salesforce 学习</div>
            </div>
        </div>
    )
}
