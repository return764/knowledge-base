import {QueryBuilder} from "./builder/query_builder";
import {DatabaseDriver, defaultDriver} from "./builder/database";

export class APIAbc {
    protected db: DatabaseDriver;

    constructor(db: DatabaseDriver = defaultDriver) {
        this.db = db;
    }

    protected table<T>(name: string): QueryBuilder<T> {
        return new QueryBuilder<T>(name, this.db);
    }
}
