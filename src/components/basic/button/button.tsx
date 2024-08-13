import React, {ButtonHTMLAttributes, PropsWithChildren, useMemo} from 'react';
import type {IconType} from "react-icons";

type ButtonProps = {
    type?: "primary" | "link" | "light" | "text" | "icon",
    icon?: IconType,
    size?: "large" | "small" | "default"
    onClick: () => void,
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

function Button(props: PropsWithChildren<ButtonProps>) {
    const {type = "primary", size = "default"} = props

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

    const cls = useMemo(() => {
        switch(size) {
            case "small":
                return {
                    icon: "p-0",
                    iconSize: 12,
                    text: "text-xs",
                    wrap: "px-3 py-0.5",
                }
            case "default":
                return {
                    icon: "p-0.5",
                    iconSize: 16,
                    text: "text-base",
                    wrap: "px-4 py-0.5",
                }
            case "large":
                return {
                    icon: "p-1",
                    iconSize: 24,
                    text: "text-lg",
                    wrap: "px-6 py-1.5",
                }
        }
    }, [size])


    return (
        <button {...props} className={`${props.className} ${buttonStyleClass} ${hasText ? `rounded-md ${cls.wrap}` : 'rounded-full p-1'} flex flex-nowrap select-none transition-colors duration-200 ease-in-out`}>
            {
                props.icon &&
                <div className={`${cls.icon} ${hasText && 'mr-1.5 -ml-1.5 p-0'} my-auto `}>
                    <props.icon size={cls.iconSize}/>
                </div>
            }
            <span className={`whitespace-nowrap ${cls.text}`}>
                {props.children}
            </span>
        </button>
    );
}

export default Button;
