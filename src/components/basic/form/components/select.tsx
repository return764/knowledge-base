import { OnChangeAndValue } from '../interface';
import { useMemo } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { HiChevronUpDown } from 'react-icons/hi2';
import { MdCheck } from 'react-icons/md';

type SelectProps = {
    options: SelectItem[]
} & OnChangeAndValue

type SelectItem = {
    label: string,
    value: string
}

function Select(props: SelectProps) {
    const { options, value, onChange } = props;

    const selected = useMemo(() =>         
        options.find(option => option.value === value) ?? null
    , [value, options]);

    const handleChangeSelect = (item: SelectItem) => {
        onChange?.(item.value);
    }

    return (
        <Listbox value={selected} onChange={handleChangeSelect}>
            <Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Label>
            <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                    <span className="ml-1 block truncate h-6">{selected?.label}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <HiChevronUpDown aria-hidden="true" className="h-5 w-5 text-gray-400" />
                </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {props.options.map((optoin, index) => (
                        <ListboxOption
                            key={index}
                            value={optoin}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                        >
                            <div className="flex items-center">
                                <span className="ml-1 block truncate font-normal group-data-[selected]:font-semibold">
                                    {optoin.label}
                                </span>
                            </div>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                <MdCheck aria-hidden="true" className="h-5 w-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

export default Select;
