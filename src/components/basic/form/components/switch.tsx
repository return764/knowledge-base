import {Switch as HeadlessSwitch} from "@headlessui/react"
import {useMemo} from "react";
import {isNumber} from "ahooks/es/utils";


type SwitchProps = {
    checked: boolean | number,
    onChange: (checked: boolean) => void
}

function Switch(props: SwitchProps) {
    const {checked, onChange} = props

    const formatedChecked = useMemo(() => {
        if (isNumber(checked)) {
            return checked !== 0;
        }
        return checked
    }, [checked])

    return (
        <HeadlessSwitch
            checked={formatedChecked}
            onChange={onChange}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 data-[checked]:bg-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
        </HeadlessSwitch>
    );
}

export default Switch;
