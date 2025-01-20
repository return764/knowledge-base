import {useMemo} from "react";
import {Combobox as HeadlessCombobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions} from "@headlessui/react";
import clsx from "clsx";
import {HiChevronUpDown} from "react-icons/hi2";
import {MdCheck} from "react-icons/md";
import {OnChangeAndValue} from "../interface.ts";

type ComboboxProps = {
    options: SelectItem[],
} & OnChangeAndValue

type SelectItem = {
    label: string,
    value: string
}

function Combobox(props: ComboboxProps) {
    const {value, onChange, options} = props

    const selectedValues = useMemo(() => {
        if (!value || options.length === 0) return []
        return value.map((it: string) => options.find(option => option.value === it))
    }, [value, options])

    const handleChangeSelect = (values: any) => {
        onChange && onChange(values.map((it: SelectItem) => it.value))
    }

    return (
        <HeadlessCombobox immediate multiple value={selectedValues} onChange={handleChangeSelect}>
            <div className="relative">
                <ComboboxInput
                    className={clsx(
                        'w-full rounded-md text-sm/6 cursor-default bg-white py-1.5 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    displayValue={(selectedList: SelectItem[]) => {
                        return selectedList.map(it => it.label).join(';')
                    }}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <HiChevronUpDown className="h-5 w-5 text-gray-400"/>
                </ComboboxButton>
            </div>

            <ComboboxOptions
                anchor="bottom"
                transition
                style={{
                    width: 'var(--input-width)'
                }}
                className={'absolute z-50 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg empty:invisible ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm'}
            >
                {options.map((option) => (
                    <ComboboxOption
                        key={option.label}
                        value={option}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                        <div className="flex items-center">
                            <span className="ml-1 block truncate font-normal group-data-[selected]:font-semibold">
                                {option.label}
                            </span>
                        </div>

                        <span
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                            <MdCheck aria-hidden="true" className="h-5 w-5"/>
                        </span>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </HeadlessCombobox>
    );
}

export default Combobox;
