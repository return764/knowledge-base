import {ChangeEvent, useMemo} from 'react';
import { Input as HeadlessInput } from '@headlessui/react'
import {OnChangeAndValue} from "../interface.ts";

type InputProps = {
    name?: string,
    label?: string,
    type?: "inline" | "block",
    size?: "small" | "default" | "large",
    placeholder?: string,
} & OnChangeAndValue

function Input(props: InputProps) {
    const {size = "default", placeholder} = props

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

    return (
        <HeadlessInput
            value={props.value ?? ""}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${inputClass} bg-gray-50 border border-[#CFD1E8] text-gray-900 rounded-lg focus:ring-0 focus:outline-0 focus:border-[#cfd0e8] block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} name={props.name}/>
    );
}

export default Input;
