import {APIAbc} from "./api.ts";

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
    protected tableName: string = 'dataset';

    async queryAllByKbId(kbId: string) {
        return await this.queryBy('kb_id', kbId);
    }

    async queryAllDocumentsByDatasetId(datasetId: string) {
        return await this.table<DocumentData>('documents')
            .select([
                'json_extract(metadata, "$.id") as id',
                'text',
                'json_extract(metadata, "$.dataset_id") as dataset_id'
            ])
            .where('json_extract(metadata, "$.dataset_id") = ?', datasetId)
            .query();
    }

    async deleteDocumentsByDatasetId(datasetId: string) {
        await this.table('documents')
            .delete()
            .where('json_extract(metadata, "$.dataset_id") = ?', datasetId)
            .execute();
    }
}
