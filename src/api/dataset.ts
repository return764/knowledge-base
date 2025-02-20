import {APIAbc} from "./api.ts";
import {invoke} from "@tauri-apps/api/core";

export type Dataset = {
    id: string,
    name: string,
    kb_id: string,
    count: number,
    active: boolean,
    create_at: Date
}

export type DocumentData = {
    id: number,
    text: string,
    datasetId: string,
}

export type ProgressEvent =
    | {
    event: 'started';
    data: {
        progressId: number;
        contentLength: number;
    };
}
    | {
    event: 'progress';
    data: {
        progressId: number;
        chunkLength: number;
    };
}
    | {
    event: 'finished';
    data: {
        progressId: number;
    };
};


export class DatasetAPI extends APIAbc {
    async insert(params: {name: string, kbId: string}): Promise<string> {
        const datasetId: string = await invoke('uuid')
        await this.execute("INSERT INTO dataset (id, name, kb_id) VALUES (?, ?, ?)", [datasetId, params.name, params.kbId])
        return Promise.resolve(datasetId)
    }

    async queryAllByKbId(params: {kbId: string}) {
        return await this.query<Dataset[]>(`SELECT d.* FROM dataset d WHERE d.kb_id = ?`, [params.kbId])
    }

    async queryById(params: {id: string}) {
        return (await this.query<Dataset[]>("SELECT * FROM dataset WHERE id = ?", [params.id]))[0]
    }

    async deleteById(id: string) {
        await this.execute("DELETE FROM dataset WHERE id = ?", [id])
    }

    // TODO 考虑移除kbId参数，查询没有用到
    async queryAllDocumentsByDatasetId(datasetId: string) {
        return await this.query<DocumentData[]>(`SELECT json_extract(metadata, '$.id') as id, text, json_extract(metadata, '$.dataset_id') as dataset_id FROM documents WHERE json_extract(metadata, '$.dataset_id') = ?`, [datasetId]);
    }

    async deleteDocumentsByDatasetId(datasetId: string) {
        return await this.execute(`DELETE FROM documents WHERE json_extract(metadata, '$.dataset_id') = ?`, [datasetId])
    }
}
