import { DatabaseDriver } from "./database";
import {isBoolean} from "ahooks/es/utils";
import { v4 as uuidv4 } from 'uuid';

type OrderDirection = 'ASC' | 'DESC';
type JoinType = 'LEFT' | 'RIGHT' | 'INNER';
type OperationType = "INSERT" | "DELETE" | "UPDATE" | "QUERY"

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
    private updateColumns: { column: string; value: any }[] = [];
    private insertColumns: string[] = [];
    private insertValues: any[][] = [];
    private operationType: OperationType = "QUERY";
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

    insert(data: Partial<T>): QueryBuilder<T> {
        this.operationType = "INSERT"
        if (!('id' in data)) {
            data = {
                id: uuidv4(),
                ...data,
            };
        }
        const columns = Object.keys(data);
        const values = Object.values(data);
        this.insertColumns = columns;
        this.insertValues = [values];
        return this;
    }

    bulkInsert(data: Partial<T>[]): QueryBuilder<T> {
        if (data.length === 0) return this;
        this.operationType = "INSERT"
        this.insertColumns = Object.keys(data[0]);
        this.insertValues = data.map(item => Object.values(item));
        return this;
    }

    update(data: Partial<T>): QueryBuilder<T> {
        this.operationType = "UPDATE"
        this.updateColumns = Object.entries(data).map(([column, value]) => ({
            column,
            value
        }));
        return this;
    }

    delete(): QueryBuilder<T> {
        this.operationType = "DELETE"
        return this;
    }

    private buildSelectQuery(): { sql: string; values: any[] } {
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

        return { sql, values: this.whereValues };
    }

    private buildInsertQuery(): { sql: string; values: any[] } {
        const placeholders = this.insertValues.map(
            () => `(${Array(this.insertColumns.length).fill('?').join(',')})`
        ).join(',');
        // insert 创建的id需要返回给调用者

        const sql = `INSERT INTO ${this.tableName} (${this.insertColumns.join(',')}) VALUES ${placeholders}`;
        const values = this.insertValues.map(this._valueFormatter).flat();

        return { sql, values };
    }

    private buildUpdateQuery(): { sql: string; values: any[] } {
        const setClauses = this.updateColumns.map(({column}) => `${column} = ?`);
        let sql = `UPDATE ${this.tableName} SET ${setClauses.join(', ')}`;

        if (this.whereConditions.length > 0) {
            sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
        }

        const values = [
            ...this.updateColumns.map(({value}) => value),
            ...this.whereValues
        ].map(this._valueFormatter);

        return { sql, values };
    }

    private buildDeleteQuery(): { sql: string; values: any[] } {
        let sql = `DELETE FROM ${this.tableName}`;

        if (this.whereConditions.length > 0) {
            sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
        }

        return { sql, values: this.whereValues.map(this._valueFormatter) };
    }

    async query(): Promise<T[]> {
        const query = this.buildSelectQuery();
        return await this.db.select<T>(query.sql, query.values);
    }

    async first(): Promise<T | undefined> {
        const results = await this.query();
        return results[0];
    }

    async execute(): Promise<string | void> {
        let query;

        if (this.operationType === "INSERT" && this.insertColumns.length > 0) {
            query = this.buildInsertQuery();
            await this.db.execute(query.sql, query.values);
            const idIndex = this.insertColumns.findIndex(it => it === "id")
            return this.insertValues[0][idIndex];
        }

        if (this.operationType === "UPDATE" && this.updateColumns.length > 0) {
            query = this.buildUpdateQuery();
            await this.db.execute(query.sql, query.values);
        }

        if (this.operationType === "DELETE") {
            query = this.buildDeleteQuery();
            await this.db.execute(query.sql, query.values);
        }
    }

    private _valueFormatter(value: any) {
        if (isBoolean(value)) {
            return value ? 1 : 0
        }
        return value
    }
}
