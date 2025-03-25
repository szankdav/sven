/* eslint-disable prettier/prettier */
import sqlite3, { Database } from 'sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as authorModel from './author.model';
import { SqlParams } from '../types/sqlparams.type';
import { createTables } from '../database/tables';
import { AuthorModel } from './author.model';

let db: Database;
const createdAtTime = new Date().toLocaleString();

vi.mock('../../winston/winston', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
    },
}));

describe('author.model tests', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        db = new sqlite3.Database(':memory:');
        await createTables(db);
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe('createAuthor tests', () => {
        it('should create an author in the database', async () => {
            vi.spyOn(authorModel, 'createAuthor');
            const testAuthor: SqlParams = ['Test Author', 123456789, createdAtTime];
            const result = await authorModel.createAuthor(db, testAuthor);
            expect(result.lastID).toBe(1);
        });
    });

    describe('getAllAuthors tests', () => {
        it('should return with all the authors from the database', async () => {
            vi.spyOn(authorModel, 'getAllAuthors');
            const testAuthor1Model: AuthorModel = { id: 1, name: 'Test Author1', createdAt: createdAtTime };
            const testAuthor2Model: AuthorModel = { id: 2, name: 'Test Author2', createdAt: createdAtTime };
            const testAuthor3Model: AuthorModel = { id: 3, name: 'Test Author3', createdAt: createdAtTime };
            const testAuthor4Model: AuthorModel = { id: 4, name: 'Test Author4', createdAt: createdAtTime };
            const testAuthor1: SqlParams = ['Test Author1', 123456789, createdAtTime];
            const testAuthor2: SqlParams = ['Test Author2', 123456790, createdAtTime];
            const testAuthor3: SqlParams = ['Test Author3', 123456791, createdAtTime];
            const testAuthor4: SqlParams = ['Test Author4', 123456792, createdAtTime];
            await authorModel.createAuthor(db, testAuthor1);
            await authorModel.createAuthor(db, testAuthor2);
            await authorModel.createAuthor(db, testAuthor3);
            await authorModel.createAuthor(db, testAuthor4);
            const result = await authorModel.getAllAuthors(db);
            expect(result).toStrictEqual([testAuthor1Model, testAuthor2Model, testAuthor3Model, testAuthor4Model]);
        });
    });
});
