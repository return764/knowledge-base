import {createContext} from "react";
import {PreferenceEnum} from "../../../utils/constant.ts";
import {PreferenceModel} from "../../../package/api/preference.ts";

type PreferenceContextProps = {
    preferences: Record<PreferenceEnum, PreferenceModel>
    getPrefValue: (key: PreferenceEnum) => string
    updatePrefs: (key: PreferenceEnum, value: any) => void
    onSave: (keys: PreferenceEnum[]) => void
}

export default createContext<PreferenceContextProps>({
    preferences: {} as Record<PreferenceEnum, PreferenceModel>,
    getPrefValue: () => "",
    updatePrefs: () => {},
    onSave: async () => {}
})
