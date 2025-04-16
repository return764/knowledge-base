import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryBuilder } from '../query_builder';
import { DatabaseDriver } from '../database';
import { v4 as uuidv4 } from 'uuid';

vi.mock('uuid', () => ({
    v4: vi.fn(() => 'mocked-uuid')
}));

describe('QueryBuilder', () => {
    let mockDb: DatabaseDriver;
    let builder: QueryBuilder<any>;

    beforeEach(() => {
        mockDb = {
            select: vi.fn().mockImplementation(() => Promise.resolve([])),
            execute: vi.fn().mockImplementation(() => Promise.resolve({ lastInsertId: 'mocked-uuid' }))
        };
        builder = new QueryBuilder('test_table', mockDb);
        vi.clearAllMocks();
    });

    describe('SELECT queries', () => {
        it('builds basic SELECT query', async () => {
            await builder.query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT * FROM test_table',
                []
            );
        });

        it('builds SELECT query with specific columns', async () => {
            await builder
                .select(['id', 'name', 'email'])
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT id, name, email FROM test_table',
                []
            );
        });

        it('builds SELECT query with WHERE clause', async () => {
            await builder
                .where('id = ?', 1)
                .where('status = ?', 'active')
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT * FROM test_table WHERE id = ? AND status = ?',
                [1, 'active']
            );
        });

        it('builds SELECT query with ORDER BY', async () => {
            await builder
                .orderBy('created_at', 'DESC')
                .orderBy('name')
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT * FROM test_table ORDER BY created_at DESC, name ASC',
                []
            );
        });

        it('builds SELECT query with LIMIT and OFFSET', async () => {
            await builder
                .limit(10)
                .offset(20)
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT * FROM test_table LIMIT 10 OFFSET 20',
                []
            );
        });

        it('builds SELECT query with table alias', async () => {
            await builder
                .as('t')
                .select(['t.id', 't.name'])
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT t.id, t.name FROM test_table t',
                []
            );
        });

        it('builds SELECT query with JOIN', async () => {
            await builder
                .as('u')
                .leftJoin('roles', 'u.role_id = r.id', 'r')
                .select(['u.*', 'r.name as role_name'])
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT u.*, r.name as role_name FROM test_table u LEFT JOIN roles r ON u.role_id = r.id',
                []
            );
        });
    });

    describe('INSERT queries', () => {
        it('builds basic INSERT query with auto-generated id', async () => {
            await builder
                .insert({ name: 'test', email: 'test@example.com' })
                .execute();

            expect(uuidv4).toHaveBeenCalled();
            expect(mockDb.execute).toHaveBeenCalledWith(
                'INSERT INTO test_table (id,name,email) VALUES (?,?,?)',
                ['mocked-uuid', 'test', 'test@example.com']
            );
        });

        it('respects provided id in INSERT query', async () => {
            await builder
                .insert({ id: 'custom-id', name: 'test', email: 'test@example.com' })
                .execute();

            expect(uuidv4).not.toHaveBeenCalled();
            expect(mockDb.execute).toHaveBeenCalledWith(
                'INSERT INTO test_table (id,name,email) VALUES (?,?,?)',
                ['custom-id', 'test', 'test@example.com']
            );
        });

        it('builds bulk INSERT query', async () => {
            await builder
                .bulkInsert([
                    { name: 'test1', email: 'test1@example.com' },
                    { name: 'test2', email: 'test2@example.com' }
                ])
                .execute();

            expect(mockDb.execute).toHaveBeenCalledWith(
                'INSERT INTO test_table (id,name,email) VALUES (?,?,?),(?,?,?)',
                ['mocked-uuid', 'test1', 'test1@example.com', 'mocked-uuid', 'test2', 'test2@example.com']
            );
        });
    });

    describe('UPDATE queries', () => {
        it('builds basic UPDATE query', async () => {
            await builder
                .update({ name: 'test', email: 'test@example.com' })
                .where('id = ?', 1)
                .execute();

            expect(mockDb.execute).toHaveBeenCalledWith(
                'UPDATE test_table SET name = ?, email = ? WHERE id = ?',
                ['test', 'test@example.com', 1]
            );
        });

        it('handles boolean values in UPDATE', async () => {
            await builder
                .update({ active: true, disabled: false })
                .execute();

            expect(mockDb.execute).toHaveBeenCalledWith(
                'UPDATE test_table SET active = ?, disabled = ?',
                [1, 0]
            );
        });
    });

    describe('DELETE queries', () => {
        it('builds basic DELETE query', async () => {
            await builder
                .delete()
                .where('id = ?', 1)
                .execute();

            expect(mockDb.execute).toHaveBeenCalledWith(
                'DELETE FROM test_table WHERE id = ?',
                [1]
            );
        });
    });

    describe('Query execution', () => {
        it('executes SELECT query', async () => {
            const expectedResult = [{ id: 1, name: 'test' }];
            mockDb.select = vi.fn().mockImplementation(() => Promise.resolve(expectedResult));

            const result = await builder
                .select(['id', 'name'])
                .where('id = ?', 1)
                .query();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT id, name FROM test_table WHERE id = ?',
                [1]
            );
            expect(result).toEqual(expectedResult);
        });

        it('executes first() query', async () => {
            const expectedResult = [{ id: 1, name: 'test' }];
            mockDb.select = vi.fn().mockImplementation(() => Promise.resolve(expectedResult));

            const result = await builder
                .select(['id', 'name'])
                .where('id = ?', 1)
                .first();

            expect(mockDb.select).toHaveBeenCalledWith(
                'SELECT id, name FROM test_table WHERE id = ?',
                [1]
            );
            expect(result).toEqual(expectedResult[0]);
        });

        it('returns undefined for first() when no results', async () => {
            mockDb.select = vi.fn().mockImplementation(() => Promise.resolve([]));

            const result = await builder.first();

            expect(result).toBeUndefined();
        });

        it('returns generated id after INSERT', async () => {
            const result = await builder
                .insert({ name: 'test' })
                .execute();

            expect(result).toBe('mocked-uuid');
        });
    });
});
