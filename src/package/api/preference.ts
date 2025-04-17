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

export class PreferenceAPI extends APIAbc {
    protected tableName: string = 'preferences';

    async getCount(): Promise<number> {
        const result = await this.table<{count: number}>('preferences')
            .select('COUNT(*) as count')
            .first();

        return result?.count ?? 0;
    }

    async queryAllPrefs(): Promise<PreferenceModel[]> {
        const preferences = await this.queryAll<PreferenceModel>();

        return preferences.map(pref => ({
            ...pref,
            value: JSON.parse(pref.value.toString())
        }));
    }

    async updateByKey(key: PreferenceEnum, value: any) {
        await this.table<PreferenceModel>('preferences')
            .update({ value: { value } })
            .where('key = ?', key)
            .execute()
    }
}
