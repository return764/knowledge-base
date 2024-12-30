import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";

export type PreferenceModel = {
    id: string
    key: string
    type: 'select' | 'input' | 'checkbox'
    value: string
}


export class PreferenceAPI extends APIAbc {
    async queryByKey(key: string): Promise<PreferenceModel> {
        return (await this.query<PreferenceModel[]>("SELECT * FROM preferences WHERE key = ?", [key]))[0]
    }

    async getCount(): Promise<number> {
        return (await this.query<{count: number}[]>("SELECT COUNT(*) as count FROM preferences"))[0].count;
    }

    async batchInsert(preferences: Omit<PreferenceModel, "id">[]) {
        const paramsPlaceholder = '(?, ?, ?, ?),'.repeat(preferences.length).slice(0, -1);
        const params = await Promise.all(
            preferences.map(async (pref) => {
                const id = await invoke('uuid');
                return [id, pref.key, pref.type, pref.value];
            })
        );
        console.log(paramsPlaceholder)
        console.log(params.flat())
        await this.execute(
            `INSERT INTO preferences (id, key, type, value) VALUES ${paramsPlaceholder}`,
            params.flat()
        );
    }
}
