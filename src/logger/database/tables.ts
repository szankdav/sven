import { Database } from "sqlite3";
import { execute } from "./database.operations.js";
import { logger } from "../../winston/winston.js";

export const createAuthorsTable = async (db: Database): Promise<void> => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            discordId TEXT NOT NULL UNIQUE,
            createdAt TEXT NOT NULL)`,
    );
  } catch (error) {
    logger.error("Error creating Authors table:", error);
  }
};

export const createMessagesTable = async (db: Database): Promise<void> => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            authorId INTEGER NOT NULL,
            message TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (authorId) REFERENCES Authors(id) ON DELETE CASCADE)`,
    );
  } catch (error) {
    logger.error("Error creating Messages table:", error);
  }
};

export const createLettersTable = async (db: Database): Promise<void> => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        authorId INTEGER NOT NULL,
        letter TEXT NOT NULL,
        count INT DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (authorId) REFERENCES Authors(id) ON DELETE CASCADE)`,
    );
  } catch (error) {
    logger.error("Error creating Letters table:", error);
  }
};

export const createTables = async (db: Database): Promise<void> => {
  try {
    await execute(db, "PRAGMA foreign_keys = ON;");
    await createAuthorsTable(db);
    await createMessagesTable(db);
    await createLettersTable(db);
  } catch (error) {
    logger.error("Error creating tables:", error);
  }
};
