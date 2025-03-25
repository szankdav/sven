import { Database, RunResult, Statement } from 'sqlite3';
import { SqlParams } from '../types/sqlparams.type';
import { DatabaseError } from '../utils/customErrorClasses/databaseError.class.js';

export const run = async (
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<RunResult> => new Promise((resolve, reject) => {
    if (params && params.length > 0) {
      const runQuery = function runQuery (this: RunResult, err: Error | null) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this);
      };

      db.run(sql, params, runQuery);
    } else {
      reject(new DatabaseError('Missing query params:', 500));
    }
  });

export const execute = async (
  db: Database,
  sql: string,
): Promise<Statement> => new Promise((resolve, reject) => {
  const exec = function exec (this: Statement, err: Error | null) {
    if (err) {
      reject(err);
      return;
    }
    resolve(this);
  };

  db.exec(sql, exec);
  });

export const fetchAll = async <T>(
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<T[]> => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as T[]);
    });
  });

export const fetchFirst = async <T>(
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<T | undefined> => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row as T | undefined);
    });
  });
