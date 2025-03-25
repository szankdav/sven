import { Database, RunResult } from 'sqlite3';
import {
  execute,
  fetchAll,
  fetchFirst,
  run,
} from '../database/database.operations.js';
import { SqlParams } from '../types/sqlparams.type.js';

export type AuthorModel = {
  id: number;
  name: string;
  createdAt: string;
};

export const createAuthor = async (
  db: Database,
  params: SqlParams,
): Promise<RunResult> => {
  const sql =
    'INSERT OR IGNORE INTO Authors(name, discordId, createdAt) VALUES (?, ?, ?)';
  return run(db, sql, params);
};

export const getAllAuthors = async (db: Database): Promise<AuthorModel[]> => {
  const sql = 'SELECT * FROM Authors';
  const rows = await fetchAll<{ id: number; name: string; createdAt: string }>(
    db,
    sql,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.createdAt,
  }));
};

export const getAuthorByDiscordId = async (
  db: Database,
  params: SqlParams,
): Promise<AuthorModel | undefined> => {
  const sql = 'SELECT * FROM Authors WHERE discordId = ?';
  return fetchFirst<{ id: number; name: string; createdAt: string }>(
    db,
    sql,
    params,
  );
};

export const getAuthorByName = async (
  db: Database,
  params: SqlParams,
): Promise<AuthorModel | undefined> => {
  const sql = 'SELECT * FROM Authors WHERE name = ?';
  return fetchFirst<{ id: number; name: string; createdAt: string }>(
    db,
    sql,
    params,
  );
};

export const getAuthorById = async (
  db: Database,
  params: SqlParams,
): Promise<AuthorModel | undefined> => {
  const sql = 'SELECT * FROM Authors WHERE id = ?';
  return fetchFirst<{ id: number; name: string; createdAt: string }>(
    db,
    sql,
    params,
  );
};

export const getTenAuthors = async (
  db: Database,
  params: SqlParams,
): Promise<AuthorModel[]> => {
  const sql = 'SELECT * FROM Authors LIMIT 10 OFFSET ?';
  const rows = await fetchAll<{ id: number; name: string; createdAt: string }>(
    db,
    sql,
    params,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.createdAt,
  }));
};

export const deleteAllAuthors = async (db: Database): Promise<void> => {
  await execute(db, 'PRAGMA foreign_keys = ON;');
  const sql = 'DELETE FROM Authors';
  await execute(db, sql);
};
