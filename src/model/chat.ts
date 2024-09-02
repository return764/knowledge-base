import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";

export type Chat = {
    id: string,
    name: string,
    prompts?: string,
    createdAt: string
}

export type ChatHistory = {

}


export class ChatAPI extends APIAbc {

    async queryAll() {
        return await this.query<Chat[]>("SELECT * FROM chat ORDER BY created_at DESC")
    }

    async queryById(id: string) {
        return (await this.query<Chat[]>("SELECT * FROM chat WHERE id = ?", [id]))[0]
    }

    async insert() {
        await this.execute("INSERT INTO chat (id, name) VALUES (?, ?)", [await invoke('uuid'), "未命名聊天"])
    }
}
