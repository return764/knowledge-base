import Database from '@tauri-apps/plugin-sql';
import {isBoolean} from "ahooks/es/utils";

export class APIAbc {
    protected conn: Database | undefined;

    private async getConn() {
        if (this.conn) {
            return this.conn;
        }
        this.conn = await Database.load('sqlite:knowledge_keeper.db');
        return this.conn;
    }

    async query<T>(sql: string, bindValues?: unknown[]) {
        return await (await this.getConn()).select<T>(sql, bindValues)
    }

    async execute(sql: string, bindValues?: unknown[]) {
        return await (await this.getConn()).execute(sql, bindValues)
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

    private _valueFormatter(value: any) {
        if (isBoolean(value)) {
            return value ? 1 : 0
        }
        return value
    }
}
