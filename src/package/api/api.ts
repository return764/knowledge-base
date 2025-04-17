import {QueryBuilder} from "./builder/query_builder.ts";
import {DatabaseDriver, defaultDriver} from "./builder/database.ts";

type EnsureId<T> = T extends { id: infer Id } ? Partial<T> & { id: Id } : never;


export abstract class APIAbc<T> {
    protected db: DatabaseDriver;
    protected abstract tableName: string;

    constructor(db: DatabaseDriver = defaultDriver) {
        this.db = db;
    }

    protected table(name: string): QueryBuilder<T> {
        return new QueryBuilder<T>(name, this.db);
    }

    async queryById(id: string): Promise<T | undefined> {
        return await this.table(this.tableName)
            .where('id = ?', id)
            .first();
    }

    async queryAll(): Promise<T[]> {
        return await this.table(this.tableName)
            .orderBy('created_at', 'DESC')
            .query();
    }

    async queryBy(column: string, value: string | number): Promise<T[]> {
        return await this.table(this.tableName)
            .where(`${column} = ?`, value)
            .query();
    }

    async queryFirstBy(column: string, value: string | number): Promise<T | undefined> {
        return await this.table(this.tableName)
            .where(`${column} = ?`, value)
            .first();
    }

    async delete(id: string) {
        await this.table(this.tableName)
            .delete()
            .where('id = ?', id)
            .execute();
    }

    async update(data: EnsureId<T>) {
        await this.table(this.tableName)
            .update(data)
            .where('id = ?', data.id)
            .execute();
    }

    async insert(data: Partial<T>): Promise<string> {
        return (await this.table(this.tableName)
            .insert(data)
            .execute())!!;
    }

    async bulkInsert(data: Partial<T>[]) {
        if (data.length === 0) return;
        await this.table(this.tableName)
            .bulkInsert(data)
            .execute();
    }

    async count(): Promise<number> {
        const countResult = await new QueryBuilder<{count: number}>(this.tableName, this.db)
            .select("COUNT(*) as count")
            .first()

        return countResult?.count ?? 0
    }
}
