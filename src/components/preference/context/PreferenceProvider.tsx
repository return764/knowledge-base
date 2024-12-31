import {PropsWithChildren, useEffect, useState} from "react";
import PreferenceContext from "./PreferenceContext.ts";
import {PreferenceEnum} from "../../../utils/constant.ts";
import {API} from "../../../api";
import {PreferenceModel} from "../../../api/preference.ts";

const PreferenceProvider = (props: PropsWithChildren<{}>) => {
    const [preferences, setPreferences] = useState<Record<PreferenceEnum, PreferenceModel>>({} as Record<PreferenceEnum, PreferenceModel>);

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const allPrefs = await API.preference.queryAll();
                const prefsMap = {} as Record<PreferenceEnum, PreferenceModel>;

                // 遍历所有枚举值
                Object.values(PreferenceEnum).forEach(enumKey => {
                    // 在 allPrefs 中查找对应的配置
                    const pref = allPrefs.find(p => p.key === enumKey);
                    if (pref) {
                        prefsMap[enumKey] = pref;
                    }
                });

                setPreferences(prefsMap);
            } catch (error) {
                console.error('Failed to load preferences:', error);
            }
        };

        loadPreferences();
    }, []);

    const onSave = async (keys: PreferenceEnum[]) => {
        try {
            for (const it of keys) {
                await API.preference.update(it, preferences?.[it].value.value);
            }
        } catch (error) {
            console.error('Failed to update preference:', error);
        }
    };

    const updatePrefs = (key: PreferenceEnum, value: any) => {
        setPreferences(prefs => {
            const pref = prefs?.[key]
            if (pref) {
                pref.value = {
                    ...pref.value,
                    value
                }
                prefs[key] = pref
            }
            return prefs
        })
    }

    const getPrefValue = (key: PreferenceEnum) => {
        return preferences[key]?.value.value
    }

    return (
        <PreferenceContext.Provider
            value={{
                preferences,
                getPrefValue,
                updatePrefs,
                onSave
            }}
        >
            {props.children}
        </PreferenceContext.Provider>
    );
};

export default PreferenceProvider;
