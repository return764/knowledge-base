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
        await this.table<Dataset>('dataset')
            .insert({
                id: datasetId,
                name: params.name,
                kb_id: params.kbId
            })
            .execute();
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
        await this.table<Dataset>('dataset')
            .delete()
            .where('id = ?', id)
            .execute();
    }

    async queryAllDocumentsByDatasetId(datasetId: string) {
        return await this.table<DocumentData>('documents')
            .select([
                'json_extract(metadata, "$.id") as id',
                'text',
                'json_extract(metadata, "$.dataset_id") as datasetId'
            ])
            .where('json_extract(metadata, "$.dataset_id") = ?', datasetId)
            .execute();
    }

    async deleteDocumentsByDatasetId(datasetId: string) {
        await this.table('documents')
            .delete()
            .where('json_extract(metadata, "$.dataset_id") = ?', datasetId)
            .execute();
    }
}
