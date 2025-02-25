import {isBoolean} from "ahooks/es/utils";
import {QueryBuilder} from "./builder/query_builder";
import {DatabaseDriver, defaultDriver} from "./builder/database";

export class APIAbc {
    protected db: DatabaseDriver;

    constructor(db: DatabaseDriver = defaultDriver) {
        this.db = db;
    }

    async execute(sql: string, bindValues?: unknown[]) {
        return await this.db.execute(sql, bindValues);
    }

    async bulkInsert(table: string, cols: string[], vals: any[][]) {
        const values = vals.flat().map(it => this._valueFormatter(it));
        const def = [];
        let x = 1;
        for (let i = 0; i < vals.length; i++) {
            const f = [];
            for (let j = 0; j < cols.length; j++) {
                f[j] = "$" + x;
                x++;
            }
            def[i] = "(" + f.join(",") + ")";
        }

        await this.execute(
            `INSERT INTO ${table} (${cols.join(",")}) VALUES ${def.join(",")}`,
            values
        );
    }

    protected table<T>(name: string): QueryBuilder<T> {
        return new QueryBuilder<T>(name, this.db);
    }

    private _valueFormatter(value: any) {
        if (isBoolean(value)) {
            return value ? 1 : 0
        }
        return value
    }
}
