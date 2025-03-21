import { Database, RunResult, Statement } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type";
import { DatabaseError } from "../utils/customErrorClasses/databaseError.class.js";

export const run = async (
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<RunResult> => {
  return new Promise((resolve, reject) => {
    if (params && params.length > 0) {
      db.run(sql, params, function (this: RunResult, err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this);
      });
    } else {
      reject(new DatabaseError("Missing query params:", 500));
    }
  });
};

export const execute = async (
  db: Database,
  sql: string,
): Promise<Statement> => {
  return new Promise((resolve, reject) => {
    db.exec(sql, function (this: Statement, err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });
};

export const fetchAll = async <T>(
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as T[]);
    });
  });
};

export const fetchFirst = async <T>(
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row as T | undefined);
    });
  });
};
