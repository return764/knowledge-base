import Database from '@tauri-apps/plugin-sql';

export interface DatabaseDriver {
    select<T>(sql: string, bindValues?: unknown[]): Promise<T[]>;
    execute(sql: string, bindValues?: unknown[]): Promise<any>;
}

export class SqliteDriver implements DatabaseDriver {
    private conn: Database | undefined;
    private dbPath: string;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
    }

    private async getConn() {
        if (this.conn) {
            return this.conn;
        }
        this.conn = await Database.load(`sqlite:${this.dbPath}`);
        return this.conn;
    }

    async select<T>(sql: string, bindValues?: unknown[]): Promise<T[]> {
        return await (await this.getConn()).select<T>(sql, bindValues);
    }

    async execute(sql: string, bindValues?: unknown[]): Promise<any> {
        return await (await this.getConn()).execute(sql, bindValues);
    }
}

// 工厂函数，用于创建数据库驱动实例
export function createDriver(type: 'sqlite', path: string): DatabaseDriver {
    switch (type) {
        case 'sqlite':
            return new SqliteDriver(path);
        default:
            throw new Error(`Unsupported database type: ${type}`);
    }
}

// 默认数据库实例
export const defaultDriver = createDriver('sqlite', 'knowledge_keeper.db');