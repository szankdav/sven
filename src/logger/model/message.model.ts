import { Database } from 'sqlite3';
import { fetchAll, fetchFirst, run } from '../database/database.operations.js';
import { SqlParams } from '../types/sqlparams.type.js';

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
  const sql =
    'INSERT INTO Messages(authorId, message, createdAt) VALUES (?, ?, ?)';
  await run(db, sql, params);
};

export const getAllMessages = async (db: Database): Promise<MessageModel[]> => {
  const sql = 'SELECT * FROM Messages';
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
  const sql = 'SELECT * FROM Messages WHERE authorId = ?';
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

const shortedMessage = (message: string): string => {
  const splittedMessage = message.split(' ');
  if(splittedMessage[0].length >= 12){
    return splittedMessage[0].slice(0, 12);
  } 

  if (splittedMessage.length > 3) {
    return splittedMessage.slice(0, 3).join(' ');
  }

  return splittedMessage.slice(0, 1).join(' ');
};

export const getTenMessages = async (
  db: Database,
  params: SqlParams,
): Promise<MessageModel[]> => {
  const sql = 'SELECT * FROM Messages LIMIT 10 OFFSET ?';
  const rows = await fetchAll<{
    id: number;
    authorId: number;
    message: string;
    createdAt: string;
  }>(db, sql, params);

  return rows.map((row) => ({
    id: row.id,
    authorId: row.authorId,
    content: `${shortedMessage(row.message)}...`,
    messageCreatedAt: row.createdAt,
  }));
};

export const getMessageById = async (
  db: Database,
  params: SqlParams,
): Promise<string> => {
  const sql = 'SELECT * FROM Messages WHERE id = ?';
  const row = await fetchFirst<{
    id: number;
    authorId: number;
    message: string;
    createdAt: string;
  }>(db, sql, params);

  return row!.message;
};