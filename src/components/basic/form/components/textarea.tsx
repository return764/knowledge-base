import {ChangeEvent, useMemo} from 'react';
import {OnChangeAndValue} from "../interface.ts";
import {useControllableValue} from "ahooks";

type TextareaProps = {
    rows?: number,
    resize?: boolean,
    className?: string,
} & OnChangeAndValue

function Textarea(props: TextareaProps) {
    const {rows = 5, resize = true, className} = props
    const [text, setText] = useControllableValue(props)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }

    const resizeClass = useMemo(() => (resize ? "" : "resize-none"), [resize])

    const calcClassName = useMemo(() => {
        if (className) {
            return className
        }
        return 'text-sm p-2 bg-gray-50 border border-[#CFD1E8] text-gray-900 rounded-lg focus:ring-0 focus:outline-0 focus:border-[#cfd0e8] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
    }, [className])

    return (
        <textarea
            value={text}
            onChange={handleChange}
            rows={rows}
            className={`block w-full h-full ${resizeClass} ${calcClassName}`}/>
    );
}

export default Textarea;
