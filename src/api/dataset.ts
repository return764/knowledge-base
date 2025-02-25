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
        const datasetId: string = await invoke('uuid');
        await this.execute(
            "INSERT INTO dataset (id, name, kb_id) VALUES (?, ?, ?)", 
            [datasetId, params.name, params.kbId]
        );
        return datasetId;
    }

    async queryAllByKbId(params: {kbId: string}) {
        return await this.table<Dataset>('dataset')
            .where('kb_id = ?', params.kbId)
            .execute();
    }

    async queryById(params: {id: string}) {
        return await this.table<Dataset>('dataset')
            .where('id = ?', params.id)
            .first();
    }

    async deleteById(id: string) {
        await this.execute("DELETE FROM dataset WHERE id = ?", [id]);
    }

    async queryAllDocumentsByDatasetId(datasetId: string) {
        return await this.table<DocumentData>('documents')
            .select([
                'json_extract(metadata, "$.id") as id',
                'text',
                'json_extract(metadata, "$.dataset_id") as dataset_id'
            ])
            .where('json_extract(metadata, "$.dataset_id") = ?', datasetId)
            .execute();
    }

    async deleteDocumentsByDatasetId(datasetId: string) {
        await this.execute(
            `DELETE FROM documents WHERE json_extract(metadata, '$.dataset_id') = ?`, 
            [datasetId]
        );
    }
}
