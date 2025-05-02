import {useEffect, useState} from "react";
import {PreferenceEnum} from "../utils/constant.ts";
import {useAtom, useSetAtom} from "jotai/index";
import {getPrefValueAtom, updatePrefsAtom} from "../store/preference.ts";

type PreferenceData = {
    value: string
    handleUpdate: (value: any) => void
}

export const usePreference = (key: PreferenceEnum): PreferenceData => {
    const [localValue, setLocalValue] = useState('')
    const updatePrefs = useSetAtom(updatePrefsAtom)
    const [getPrefValue] = useAtom(getPrefValueAtom)

    // TODO 同步 jotai 中的值到本地状态
    useEffect(() => {
        const value = getPrefValue(key);
        setLocalValue(value || '');
    }, [key, getPrefValue(key)]);

    const handleUpdate = (value: any) => {
        setLocalValue(value);
        updatePrefs(key, value);
    }

    return {
        value: localValue,
        handleUpdate,
    };
};
