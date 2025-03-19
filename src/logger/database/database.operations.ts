import { Database } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type";

export const execute = async (
  db: Database,
  sql: string,
  params: SqlParams = [],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (params && params.length > 0) {
      db.run(sql, params, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    } else {
      db.exec(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    }
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
