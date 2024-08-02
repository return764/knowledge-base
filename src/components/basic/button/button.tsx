import React, {ButtonHTMLAttributes, PropsWithChildren, useMemo} from 'react';
import type {IconType} from "react-icons";

type ButtonProps = {
    type?: "primary" | "link" | "light" | "text" | "icon",
    icon?: IconType,
    onClick: () => void,
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

function Button(props: PropsWithChildren<ButtonProps>) {
    const {type = "primary"} = props

    const hasText = useMemo(() => {
        return !!props.children
    }, [props.children])

    const buttonStyleClass = useMemo(() => {
        switch(type) {
            case "link":
                return ""
            case "primary":
                return "bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow"
            case "light":
                return "border border-gray-300 text-gray-700 active:text-primary-active active:border-primary-active hover:text-primary-hover hover:border-primary-hover shadow"
            case "text":
                return "text-gray-700 hover:bg-gray-100/50 active:bg-gray-200/75"
        }
    }, [type])


    return (
        <button {...props} className={`${props.className} ${buttonStyleClass} ${hasText ? 'rounded-md px-5 py-1' : 'rounded-full p-1'} flex flex-nowrap select-none transition-colors duration-200 ease-in-out`}>
            {
                props.icon &&
                <div className={`${hasText && 'mr-1.5 -ml-1.5'} my-auto`}>
                    <props.icon size={hasText ? 16 : 24}/>
                </div>
            }
            <span className="whitespace-nowrap">
                {props.children}
            </span>
        </button>
    );
}

export default Button;
