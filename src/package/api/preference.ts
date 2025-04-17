import {APIAbc} from "./api.ts";
import {PreferenceEnum} from "../../utils/constant.ts";

export type PreferenceModel = {
    id: string
    key: string
    type: 'select' | 'input' | 'checkbox'
    value: PreferenceValue
}

export type PreferenceValue = {
    value: string
}

export class PreferenceAPI extends APIAbc<PreferenceModel> {
    protected tableName: string = 'preferences';

    async queryAllPrefs(): Promise<PreferenceModel[]> {
        const preferences = await this.queryAll();

        return preferences.map(pref => ({
            ...pref,
            value: JSON.parse(pref.value.toString())
        }));
    }

    async updateByKey(key: PreferenceEnum, value: any) {
        await this.table('preferences')
            .update({ value: { value } })
            .where('key = ?', key)
            .execute()
    }
}
