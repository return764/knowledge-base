import {QueryBuilder} from "./builder/query_builder";
import {DatabaseDriver, defaultDriver} from "./builder/database";

type EnsureId<T> = T extends { id: infer Id } ? Partial<T> & { id: Id } : never;


export abstract class APIAbc {
    protected db: DatabaseDriver;
    protected abstract tableName: string;

    constructor(db: DatabaseDriver = defaultDriver) {
        this.db = db;
    }

    protected table<T>(name: string): QueryBuilder<T> {
        return new QueryBuilder<T>(name, this.db);
    }

    async queryById<T>(id: string): Promise<T | undefined> {
        return await this.table<T>(this.tableName)
            .where('id = ?', id)
            .first();
    }

    async queryAll<T>(): Promise<T[]> {
        return await this.table<T>(this.tableName)
            .orderBy('created_at', 'DESC')
            .query();
    }

    async delete(id: string) {
        await this.table(this.tableName)
            .delete()
            .where('id = ?', id)
            .execute();
    }

    async update<T>(data: EnsureId<T>) {
        await this.table<T>(this.tableName)
            .update(data)
            .where('id = ?', data.id)
            .execute();
    }

    async insert<T>(data: Partial<T>): Promise<string> {
        return (await this.table<T>(this.tableName)
            .insert(data)
            .execute())!!;
    }

    async bulkInsert<T>(data: Partial<T>[])  {
        if (data.length === 0) return;
        await this.table<T>(this.tableName)
            .bulkInsert(data)
            .execute();
    }
}
