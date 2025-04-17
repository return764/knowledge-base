import { OnChangeAndValue } from '../interface';
import {useEffect, useMemo, useState} from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { HiChevronUpDown } from 'react-icons/hi2';
import { MdCheck } from 'react-icons/md';
import { LuLoader2 } from "react-icons/lu";
import { useUpdateEffect } from 'ahooks';

type SelectProps = {
    defaultFirst?: boolean,
    options?: SelectItem[],
    label?: string,
    onLoadOptions?: () => Promise<SelectItem[]>,
} & OnChangeAndValue

type SelectItem = {
    label: string,
    value: string
}

function Select(props: SelectProps) {
    const { options: initialOptions = [], value, onChange, label, defaultFirst = true, onLoadOptions } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<SelectItem[]>(initialOptions);

    useUpdateEffect(() => {
        setOptions(initialOptions);
    }, [initialOptions]);

    const selected = useMemo(() => {
        let option = options.find(option => option.value === value) ?? null
        if (!option && defaultFirst) {
            option = options.length > 0 ? options[0] : null
        }
        return option
    } , [value, options, defaultFirst]);

    useEffect(() => {
        if (!value && selected && defaultFirst && options.length > 0) {
            onChange?.(selected.value)
        }
    }, [options, value]);

    const handleChangeSelect = (item: SelectItem) => {
        onChange?.(item.value);
    }

    const handleOpen = async () => {
        if (!isOpen && onLoadOptions && options.length === 0) {
            setIsLoading(true);
            try {
                const loadedOptions = await onLoadOptions();
                setOptions(loadedOptions);
            } finally {
                setIsLoading(false);
            }
        }
        setIsOpen(true);
    }

    return (
        <Listbox value={selected} onChange={handleChangeSelect}>
            {label && <Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Label>}
            <div className="relative mt-2">
                <ListboxButton 
                    className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    onClick={handleOpen}
                >
                    <span className="flex items-center">
                        <span className="ml-1 block truncate h-6">{selected?.label}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <HiChevronUpDown aria-hidden="true" className="h-5 w-5 text-gray-400" />
                    </span>
                </ListboxButton>
                <ListboxOptions
                    transition
                    style={{
                        width: 'var(--button-width)'
                    }}
                    className="fixed z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <LuLoader2 className="h-5 w-5 animate-spin text-gray-400" />
                        </div>
                    ) : options.length === 0 ? (
                        <div className="py-2 pl-3 pr-9 text-gray-500 text-sm">
                            暂无数据
                        </div>
                    ) : (
                        options.map((option, index) => (
                            <ListboxOption
                                key={index}
                                value={option}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                            >
                                <div className="flex items-center">
                                    <span className="ml-1 block truncate font-normal group-data-[selected]:font-semibold">
                                        {option.label}
                                    </span>
                                </div>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                    <MdCheck aria-hidden="true" className="h-5 w-5" />
                                </span>
                            </ListboxOption>
                        ))
                    )}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

export default Select;
