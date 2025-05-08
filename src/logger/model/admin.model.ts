import { Database, RunResult } from 'sqlite3';
import { SqlParams } from '../types/sqlparams.type.js';
import { fetchFirst, run } from '../database/database.operations.js';

export type AdminModel = {
  id: number;
  username: string;
  password: string;
  createdAt: string;
};


export const createAdmin = async (
  db: Database,
  params: SqlParams,
): Promise<RunResult> => {
  const sql =
    'INSERT OR IGNORE INTO Admins(username, password, createdAt) VALUES (?, ?, ?)';
  return run(db, sql, params);
};

export const getAdminByName = async (
  db: Database,
  params: SqlParams,
): Promise<AdminModel | undefined> => {
  const sql = 'SELECT * FROM Admins WHERE name = ?';
  return fetchFirst<{ id: number; username: string; password: string, createdAt: string }>(
    db,
    sql,
    params,
  );
};