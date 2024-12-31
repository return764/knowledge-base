import {useContext, useEffect, useState} from "react";
import {PreferenceEnum} from "../utils/constant.ts";
import PreferenceContext from "../components/preference/context/PreferenceContext.ts";

type PreferenceData = {
    value: string
    handleUpdate: (value: any) => void
}

export const usePreference = (key: PreferenceEnum): PreferenceData => {
    const {getPrefValue, updatePrefs} = useContext(PreferenceContext);
    const [localValue, setLocalValue] = useState('');

    // 同步 context 中的值到本地状态
    useEffect(() => {
        const value = getPrefValue(key);
        setLocalValue(value || '');
    }, [key, getPrefValue]);

    const handleUpdate = (value: any) => {
        setLocalValue(value);
        updatePrefs(key, value);
    }

    return {
        value: localValue,
        handleUpdate,
    };
};
