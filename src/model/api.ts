import Database from '@tauri-apps/plugin-sql';

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
}
