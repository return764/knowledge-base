import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";
import {PreferenceEnum} from "../utils/constant.ts";

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
    async queryByKey(params: {key: string}): Promise<PreferenceModel> {
        const preference = (await this.query<PreferenceModel[]>("SELECT * FROM preferences WHERE key = ?", [params.key]))[0]
        return {
            ...preference,
            value: JSON.parse(preference.value.toString())
        }
    }

    async getCount(): Promise<number> {
        return (await this.query<{count: number}[]>("SELECT COUNT(*) as count FROM preferences"))[0].count;
    }

    async queryAll(): Promise<PreferenceModel[]> {
        const preferences = await this.query<PreferenceModel[]>("SELECT * FROM preferences");
        return preferences.map(pref => ({
            ...pref,
            value: JSON.parse(pref.value.toString())
        }));
    }

    async update(key: PreferenceEnum, value: any) {
        const valueParams = {value}
        return (await this.execute("UPDATE preferences SET value = ? WHERE key = ?", [valueParams, key]))
    }

    async batchInsert(preferences: Omit<PreferenceModel, "id">[]) {
        const params = await Promise.all(
            preferences.map(async (pref) => {
                const id = await invoke('uuid');
                return [id, pref.key, pref.type, JSON.stringify(pref.value)];
            })
        );
        await this.bulkInsert('preferences', ["id", "key", "type", "value"], params)
    }
}
