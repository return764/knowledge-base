import {usePreference} from "../../hooks/usePreference.ts";
import {PreferenceEnum} from "../../utils/constant.ts";
import Input from "../basic/form/components/Input.tsx";

type PreferenceProps = {
    label: string,
    keyword: PreferenceEnum,
    onSave?: () => void
}

const Preference = (props: PreferenceProps) => {
    const {keyword, label} = props;
    const {value, handleUpdate} = usePreference(keyword);

    const handleChange = (newValue: string) => {
        handleUpdate(newValue);
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">{label}</label>
            <Input
                type="block"
                onChange={handleChange}
                value={value}
            />
        </div>
    )
};

export default Preference;
