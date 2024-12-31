import {useQuery} from "./useQuery.ts";
import {PreferenceModel} from "../api/preference.ts";
import {useMemo} from "react";
import {API} from "../api";
import {PreferenceEnum} from "../utils/constant.ts";

type PreferenceData = {
    value: string
    onUpdate: (value: any) => void,
    preference: PreferenceModel
}

export const usePreference = (key: PreferenceEnum): PreferenceData => {
    const {data} = useQuery<PreferenceModel>('preference', 'queryByKey', {key})

    const value = useMemo(() => {
        switch (data?.type) {
            case 'input':
                return data.value.value.toString()
            default:
                return data?.value.value.toString()!!
        }
    }, [key, data])

    const onUpdate = (value: any) => {
        API.preference.update(key, value)
    }

    return {value, onUpdate, preference: data!!}
}
