import {atom} from "jotai";
import {PreferenceEnum} from "../utils/constant.ts";
import {PreferenceModel} from "../package/api/preference.ts";
import {API} from "../package/api";

const preferencesAtom = atom<Record<PreferenceEnum, PreferenceModel>>({} as Record<PreferenceEnum, PreferenceModel>)

export const getPrefValueAtom = atom(
    (get) => (key: PreferenceEnum) => {
        const preferences = get(preferencesAtom)
        return preferences[key]?.value.value
    }
)

export const updatePrefsAtom = atom(
    null,
    (get, set, key: PreferenceEnum, value: any) => {
        const preferences = get(preferencesAtom)
        const pref = preferences?.[key]
        if (pref) {
            pref.value = {
                ...pref.value,
                value
            }
            set(preferencesAtom, {
                ...preferences,
                [key]: pref
            })
        }
    }
)

export const onSaveAtom = atom(
    null,
    async (get, _, keys: PreferenceEnum[]) => {
        const preferences = get(preferencesAtom)
        try {
            for (const key of keys) {
                await API.preference.updateByKey(key, preferences?.[key].value.value)
            }
        } catch (error) {
            console.error('Failed to update preference:', error)
        }
    }
)

export const loadPreferencesAtom = atom(
    null,
    async (_, set) => {
        try {
            const allPrefs = await API.preference.queryAllPrefs()
            const prefsMap = {} as Record<PreferenceEnum, PreferenceModel>

            Object.values(PreferenceEnum).forEach(enumKey => {
                const pref = allPrefs.find(p => p.key === enumKey)
                if (pref) {
                    prefsMap[enumKey] = pref
                }
            })

            set(preferencesAtom, prefsMap)
        } catch (error) {
            console.error('Failed to load preferences:', error)
        }
    }
)
