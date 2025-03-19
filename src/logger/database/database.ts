import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../../winston/winston.js";
import { config } from "../../config.js";

// Initialize database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath =
  config.DB_PATH || path.join(__dirname, "db/DiscordMessages.db");

export const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    logger.error("Failed to connect to database:", err);
  } else {
    logger.info(
      `Connected to SQLite database successfully at path: ${dbFilePath}`,
    );
  }
});
