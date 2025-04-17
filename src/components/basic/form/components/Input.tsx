import {ChangeEvent, HTMLInputTypeAttribute, useMemo, useState} from 'react';
import { Input as HeadlessInput } from '@headlessui/react'
import {OnChangeAndValue} from "../interface.ts";
import { LuEye, LuEyeOff } from "react-icons/lu";

type InputProps = {
    name?: string,
    label?: string,
    type?: HTMLInputTypeAttribute,
    size?: "small" | "default" | "large",
    placeholder?: string,
} & OnChangeAndValue

function Input(props: InputProps) {
    const {size = "default", placeholder, type} = props
    const [showPassword, setShowPassword] = useState(false)

    const inputClass = useMemo(() => {
        switch (size) {
            case "large":
                return "text-base p-3"
            case "default":
                return "text-sm p-2"
            case "small":
                return "text-xs p-1.5"
        }
    }, [size])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(e.currentTarget.value)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
        <div className="relative">
            <HeadlessInput
                value={props.value ?? ""}
                onChange={handleChange}
                type={inputType}
                placeholder={placeholder}
                className={`${inputClass} bg-gray-50 border border-[#CFD1E8] text-gray-900 rounded-lg focus:ring-0 focus:outline-0 focus:border-[#cfd0e8] block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                name={props.name}
            />
            {type === 'password' && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? (
                        <LuEye/>
                    ) : (
                        <LuEyeOff/>
                    )}
                </button>
            )}
        </div>
    );
}

export default Input;
