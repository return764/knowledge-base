import { DocumentInterface } from "@langchain/core/documents";
import {VectorStore} from "@langchain/core/vectorstores";
import type {EmbeddingsInterface} from "@langchain/core/embeddings";
import {QueryBuilder} from "../api/builder/query_builder.ts";
import {DatabaseDriver} from "../api/builder/database.ts";


type SqliteVecConfig = {
    pool: DatabaseDriver,
    dimensions?: number
}

type VecType = {
    text: string,
    metadata: any,
    text_embedding: any
}

type VecResult = {
    id: string,
    text: string,
    metadata: any,
    distance: number
}

export class SqliteFilter {
    private type: string;
    private key?: string;
    private value?: string | string[];
    private ordering?: string;
    private filters?: SqliteFilter[];

    constructor(type: string, key?: string, value?: string | string[], ordering?: string, filters?: SqliteFilter[]) {
        this.type = type;
        this.key = key;
        this.value = value;
        this.ordering = ordering;
        this.filters = filters;
    }

    toString(): string {
        switch (this.type) {
            case 'Eq':
                return `json_extract(e.metadata, '$.${this.key}') = '${this.value}'`;
            case 'Cmp':
                const op = this.ordering === 'Less' ? '<' : this.ordering === 'Greater' ? '>' : '=';
                return `json_extract(e.metadata, '$.${this.key}') ${op} '${this.value}'`;
            case 'In':
                const values = (this.value as string[]).map(v => `'${v}'`).join(', ');
                return `json_extract(e.metadata, '$.${this.key}') IN (${values})`;
            case 'And':
                return (this.filters || []).map(filter => filter.toString()).join(' AND ');
            case 'Or':
                return (this.filters || []).map(filter => filter.toString()).join(' OR ');
            default:
                throw new Error(`Unknown filter type: ${this.type}`);
        }
    }

    static Eq(key: string, value: string): SqliteFilter {
        return new SqliteFilter('Eq', key, value);
    }

    static Cmp(ordering: 'Less' | 'Greater' | 'Equal', key: string, value: string): SqliteFilter {
        return new SqliteFilter('Cmp', key, value, ordering);
    }

    static In(key: string, values: string[]): SqliteFilter {
        return new SqliteFilter('In', key, values);
    }

    static And(filters: SqliteFilter[]): SqliteFilter {
        return new SqliteFilter('And', undefined, undefined, undefined, filters);
    }

    static Or(filters: SqliteFilter[]): SqliteFilter {
        return new SqliteFilter('Or', undefined, undefined, undefined, filters);
    }
}

export class SqliteVecStore extends VectorStore {
    declare FilterType: SqliteFilter
    tableName: string = 'documents'
    pool: DatabaseDriver
    dimensions: number

    constructor(embeddings: EmbeddingsInterface, config: SqliteVecConfig) {
        super(embeddings, config)
        this.pool = config.pool
        this.dimensions = config.dimensions ?? 768
        this.ensureTableIsExist()
    }

    _vectorstoreType(): string {
        return 'sqlite-vec';
    }

    ensureTableIsExist() {
        this.pool.execute(`
            CREATE TABLE IF NOT EXISTS ${this.tableName}
            (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              text TEXT,
              metadata BLOB,
              text_embedding BLOB
            );
        `)

        this.pool.execute(`
            CREATE VIRTUAL TABLE IF NOT EXISTS vec_${this.tableName} USING vec0(
              text_embedding float[${this.dimensions}]
            );
        `)

        this.pool.execute(`
            CREATE TRIGGER IF NOT EXISTS embed_text_${this.tableName}
            AFTER INSERT ON ${this.tableName}
            BEGIN
                INSERT INTO vec_${this.tableName}(rowid, text_embedding)
                VALUES (new.id, new.text_embedding)
                ;
            END;
        `)

    }

    async addVectors(vectors: number[][], documents: DocumentInterface[], _options?: { [x: string]: any; }): Promise<string[] | void> {
        const ids: string[] = []
        for (let i = 0; i < vectors.length; i++) {
            const vector = vectors[i]
            const document = documents[i]
            const id = await new QueryBuilder<VecType>(this.tableName, this.pool)
                .insert({
                    text: document.pageContent,
                    metadata: document.metadata,
                    text_embedding: JSON.stringify(vector).toString()
                }, {ignoreId: true})
                .execute()
            ids.push(id!!)
        }
        return ids
    }

    async addDocuments(documents: DocumentInterface[], options?: { [x: string]: any; }): Promise<string[] | void> {
        const texts = documents.map(({ pageContent }) => pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents, options);
    }

    async similaritySearchVectorWithScore(query: number[], k: number, filter?: this["FilterType"] | undefined): Promise<[DocumentInterface, number][]> {
        const _filter = filter ? filter.toString() : 'TRUE'
        const rows = await this.pool.select<VecResult>(`
            SELECT 
                   e.id,
                   text,
                   metadata,
                   distance
            FROM ${this.tableName} e
                     INNER JOIN vec_${this.tableName} v on v.rowid = e.id
            WHERE v.text_embedding match '${JSON.stringify(query)}' AND k = ? AND ${_filter}
            ORDER BY distance
            LIMIT ?
        `, [k, k]) as unknown as VecResult[]

        const results: [DocumentInterface, number][] = []
        rows.forEach(row => {
            const document: DocumentInterface = {
                pageContent: row.text,
                metadata: JSON.parse(row.metadata),
                id: row.id
            }
            results.push([document, row.distance])
        })

        return results
    }

}
