import {APIAbc} from "./api.ts";
import {API} from "./index.ts";

export type ChatSettings = {
    id: string,
    kb_ids?: string[],
    chat_model_id?: string,
}

export type ChatSettingsEntity = {
    id: string,
    kb_ids?: string,
    chat_model_id?: string,
}

export class ChatSettingsAPI extends APIAbc<ChatSettingsEntity> {
    protected tableName: string = 'chat_settings';

    async newSettings(settings: ChatSettings) {
        await this.insert({
            ...settings,
            kb_ids: JSON.stringify(settings.kb_ids)
        })
    }

    async saveSettings(settings: ChatSettings) {
        await this.update({
            ...settings,
            kb_ids: JSON.stringify(settings.kb_ids)
        })
    }

    async getSettings(id: string): Promise<ChatSettings> {
        const chatSettings = await this.queryById(id)
        return {
            ...chatSettings!!,
            kb_ids: JSON.parse(chatSettings?.kb_ids!!)
        }
    }

}
