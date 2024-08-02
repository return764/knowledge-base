import React, {ChangeEvent, useMemo} from 'react';

type InputProps = {
    name: string,
    label?: string,
    type?: "inline" | "block",
    size?: "small" | "default" | "large",
    value?: string,
    onChange?: (value: string) => void
}

function Input(props: InputProps) {
    const {size = "default"} = props

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
        <div>
            <label className="block mb-2 text-sm font-light leading-normal text-color" htmlFor={props.name}>{props.label ?? props.name}</label>
            <input
                value={props.value ?? ""}
                onChange={handleChange}
                className={`${inputClass} bg-gray-50 border border-[#CFD1E8] text-gray-900 rounded-lg focus:ring-0 focus:outline-0 focus:border-[#cfd0e8] block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} name={props.name}/>
        </div>
    );
}

export default Input;
