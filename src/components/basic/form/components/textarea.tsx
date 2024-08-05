import React, {ChangeEvent} from 'react';
import {OnChangeAndValue} from "../interface.ts";

type TextareaProps = {
    rows?: number
} & OnChangeAndValue

function Textarea(props: TextareaProps) {
    const {rows = 5} = props

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange?.(e.currentTarget.value)
    }

    return (
        <textarea
            value={props.value ?? ""}
            onChange={handleChange}
            rows={rows}
            className="text-sm p-2 bg-gray-50 border border-[#CFD1E8] text-gray-900 rounded-lg focus:ring-0 focus:outline-0 focus:border-[#cfd0e8] block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    );
}

export default Textarea;
