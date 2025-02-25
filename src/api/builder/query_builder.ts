import { DatabaseDriver } from "./database";

type OrderDirection = 'ASC' | 'DESC';
type JoinType = 'LEFT' | 'RIGHT' | 'INNER';

export class QueryBuilder<T> {
    private tableName: string;
    private tableAlias?: string;
    private selectColumns: string[] = ['*'];
    private whereConditions: string[] = [];
    private whereValues: any[] = [];
    private orderByColumns: { column: string; direction: OrderDirection }[] = [];
    private limitValue?: number;
    private offsetValue?: number;
    private joins: { type: JoinType; table: string; alias?: string; condition: string }[] = [];
    private db: DatabaseDriver;

    constructor(tableName: string, db: DatabaseDriver) {
        this.tableName = tableName;
        this.db = db;
    }

    as(alias: string): QueryBuilder<T> {
        this.tableAlias = alias;
        return this;
    }

    select(columns: string[] | string): QueryBuilder<T> {
        if (typeof columns === 'string') {
            this.selectColumns = [columns];
        } else {
            this.selectColumns = columns;
        }
        return this;
    }

    join(table: string, condition: string, type: JoinType = 'INNER', alias?: string): QueryBuilder<T> {
        this.joins.push({ type, table, condition, alias });
        return this;
    }

    leftJoin(table: string, condition: string, alias?: string): QueryBuilder<T> {
        return this.join(table, condition, 'LEFT', alias);
    }

    rightJoin(table: string, condition: string, alias?: string): QueryBuilder<T> {
        return this.join(table, condition, 'RIGHT', alias);
    }

    where(condition: string, value?: any): QueryBuilder<T> {
        this.whereConditions.push(condition);
        if (value !== undefined) {
            this.whereValues.push(value);
        }
        return this;
    }

    orderBy(column: string, direction: OrderDirection = 'ASC'): QueryBuilder<T> {
        this.orderByColumns.push({ column, direction });
        return this;
    }

    limit(limit: number): QueryBuilder<T> {
        this.limitValue = limit;
        return this;
    }

    offset(offset: number): QueryBuilder<T> {
        this.offsetValue = offset;
        return this;
    }

    buildQuery(): { sql: string; values: any[] } {
        const fromClause = this.tableAlias 
            ? `${this.tableName} ${this.tableAlias}`
            : this.tableName;

        let sql = `SELECT ${this.selectColumns.join(', ')} FROM ${fromClause}`;

        if (this.joins.length > 0) {
            const joinClauses = this.joins.map(join => {
                const tableClause = join.alias 
                    ? `${join.table} ${join.alias}`
                    : join.table;
                return `${join.type} JOIN ${tableClause} ON ${join.condition}`;
            });
            sql += ' ' + joinClauses.join(' ');
        }

        if (this.whereConditions.length > 0) {
            sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
        }

        if (this.orderByColumns.length > 0) {
            const orderByStr = this.orderByColumns
                .map(({ column, direction }) => `${column} ${direction}`)
                .join(', ');
            sql += ` ORDER BY ${orderByStr}`;
        }

        if (this.limitValue !== undefined) {
            sql += ` LIMIT ${this.limitValue}`;
        }

        if (this.offsetValue !== undefined) {
            sql += ` OFFSET ${this.offsetValue}`;
        }

        return {
            sql,
            values: this.whereValues
        };
    }

    async execute(): Promise<T[]> {
        const { sql, values } = this.buildQuery();
        return await this.db.select<T>(sql, values);
    }

    async first(): Promise<T | undefined> {
        const results = await this.execute();
        return results[0];
    }
} 