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
        const preference = await this.table<PreferenceModel>('preferences')
            .where('key = ?', params.key)
            .first();
            
        return {
            ...preference!,
            value: JSON.parse(preference!.value.toString())
        };
    }

    async getCount(): Promise<number> {
        const result = await this.table<{count: number}>('preferences')
            .select('COUNT(*) as count')
            .first();
            
        return result?.count ?? 0;
    }

    async queryAll(): Promise<PreferenceModel[]> {
        const preferences = await this.table<PreferenceModel>('preferences')
            .execute();
            
        return preferences.map(pref => ({
            ...pref,
            value: JSON.parse(pref.value.toString())
        }));
    }

    async update(key: PreferenceEnum, value: any) {
        const valueParams = {value};
        await this.execute(
            "UPDATE preferences SET value = ? WHERE key = ?", 
            [valueParams, key]
        );
    }

    async batchInsert(preferences: Omit<PreferenceModel, "id">[]) {
        const params = await Promise.all(
            preferences.map(async (pref) => {
                const id = await invoke('uuid');
                return [id, pref.key, pref.type, JSON.stringify(pref.value)];
            })
        );
        await this.bulkInsert('preferences', ["id", "key", "type", "value"], params);
    }
}
