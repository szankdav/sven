import { Database, RunResult } from "sqlite3";
import { fetchAll, run } from "../database/database.operations.js";
import { SqlParams } from "../types/sqlparams.type.js";

export type MessageModel = {
  id: number;
  authorId: number;
  content: string;
  messageCreatedAt: string;
};

export const createMessage = async (
  db: Database,
  params: SqlParams,
): Promise<void> => {
  const sql: string =
    "INSERT INTO Messages(authorId, message, createdAt) VALUES (?, ?, ?)";
  await run(db, sql, params);
};

export const getAllMessages = async (db: Database): Promise<MessageModel[]> => {
  const sql = "SELECT * FROM Messages";
  const rows = await fetchAll<{
    id: number;
    authorId: number;
    message: string;
    createdAt: string;
  }>(db, sql);

  return rows.map((row) => ({
    id: row.id,
    authorId: row.authorId,
    content: row.message,
    messageCreatedAt: row.createdAt,
  }));
};

export const getMessagesByAuthorId = async (
  db: Database,
  params: SqlParams,
): Promise<MessageModel[]> => {
  const sql = "SELECT * FROM Messages WHERE authorId = ?";
  const rows = await fetchAll<{
    id: number;
    authorId: number;
    message: string;
    createdAt: string;
  }>(db, sql, params);

  return rows.map((row) => ({
    id: row.id,
    authorId: row.authorId,
    content: row.message,
    messageCreatedAt: row.createdAt,
  }));
};

export const getTenMessages = async (
  db: Database,
  params: SqlParams,
): Promise<MessageModel[]> => {
  const sql = "SELECT * FROM Messages LIMIT 10 OFFSET ?";
  const rows = await fetchAll<{
    id: number;
    authorId: number;
    message: string;
    createdAt: string;
  }>(db, sql, params);

  return rows.map((row) => ({
    id: row.id,
    authorId: row.authorId,
    content: row.message,
    messageCreatedAt: row.createdAt,
  }));
};
