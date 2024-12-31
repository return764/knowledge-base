import {usePreference} from "../../hooks/usePreference.ts";
import {PreferenceEnum} from "../../utils/constant.ts";
import Input from "../basic/form/components/Input.tsx";
import {useEffect, useState} from "react";

type PreferenceProps = {
    label: string,
    keyword: PreferenceEnum,
    onSave?: () => void
}

const Preference = (props: PreferenceProps) => {
    const {keyword, label} = props;
    const {value, onUpdate, preference} = usePreference(keyword)
    const [controlValue, setControlValue] = useState<string>();

    useEffect(() => {
        setControlValue(value)
    }, [value]);

    const handleUpdatePreference = () => {
        onUpdate(controlValue)
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">{label}</label>
            <Input
                type="block"
                onChange={setControlValue}
                value={controlValue}
            />
        </div>
    )
};

export default Preference;
