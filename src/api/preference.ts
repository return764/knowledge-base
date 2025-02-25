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
        await this.table<PreferenceModel>('preferences')
            .update({ value: { value } })
            .where('key = ?', key)
            .execute();
    }

    async batchInsert(preferences: Omit<PreferenceModel, "id">[]) {
        const insertData: PreferenceModel[] = []
        for (let pref of preferences) {
            insertData.push({
                id: await invoke('uuid'),
                key: pref.key,
                type: pref.type,
                value: pref.value
            })
        }

        await this.table<PreferenceModel>('preferences')
            .bulkInsert(insertData)
            .execute();
    }
}
