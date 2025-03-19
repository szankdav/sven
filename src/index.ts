import { startClient } from "./bot/client/client.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./logger/database/tables.js";
import { db } from "./logger/database/database.js";
import { errorHandler } from "./logger/handlers/error.handler.js";
import { homeHandler } from "./logger/handlers/home.handler.js";
import { authorsHandler } from "./logger/handlers/authors.handler.js";
import {
  messagesHandler,
  messagesByAuthorsHandler,
} from "./logger/handlers/messages.handler.js";
import { statisticsByAuthorHandler } from "./logger/handlers/statistics.handler.js";
import { messageLoggerHandler } from "./logger/handlers/messageLogger.handler.js";
import { logger } from "./winston/winston.js";

// Start bot
startClient();

// Set filepaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "logger/view"));
app.use(express.static(path.join(__dirname, "./logger/public")));
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());
const port = Number(process.env.PORT) || 3000;

try {
  await createTables(db);
} catch (error) {
  logger.error("Error creating tables:", error);
}

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

app.get("/", homeHandler);
app.get("/authors/:page", authorsHandler);
app.get("/messages/:page", messagesHandler);
app.get("/messages/author/:id", messagesByAuthorsHandler);
app.get("/statistics/author/:id", statisticsByAuthorHandler);
app.post("/logMessage", messageLoggerHandler);
app.use(errorHandler);
