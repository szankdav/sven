import express from 'express';
import path from 'path';
import { startSven } from './bot/client/sven.js';
import { createTables } from './logger/database/tables.js';
import { db } from './logger/database/database.js';
import { errorHandler } from './logger/handlers/error.handler.js';
import { homeHandler } from './logger/handlers/home.handler.js';
import { authorsHandler } from './logger/handlers/authors.handler.js';
import {
  messagesHandler,
  messagesByAuthorsHandler,
} from './logger/handlers/messages.handler.js';
import { statisticsByAuthorHandler } from './logger/handlers/statistics.handler.js';
import { messageLoggerHandler } from './logger/handlers/messageLogger.handler.js';
import { logger } from './winston/winston.js';
import { startFaendal } from './bot/client/faendal.js';
import { loginAttempHandler, loginHandler } from './logger/handlers/login.handler.js';

// Start bots
startSven();
startFaendal();

// Set filepaths
const __dirname = import.meta.dirname;
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'logger/view'));
app.use(express.json());
const port = Number(process.env.PORT) || 3000;

try {
  await createTables(db);
} catch (error) {
  logger.error('Error creating tables:', error);
}

app.get('/', homeHandler);
app.get('/authors/:page', authorsHandler);
app.get('/messages/:page', messagesHandler);
app.get('/messages/author/:id', messagesByAuthorsHandler);
app.get('/statistics/author/:id', statisticsByAuthorHandler);
app.post('/logMessage', messageLoggerHandler);
app.get('/login', loginHandler);
app.post('/login', loginAttempHandler);

app.use(express.static(path.join(__dirname, './logger/public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(errorHandler);

app.listen(port, () => {
  /* eslint no-console: ["error", { allow: ["log"] }] */
  console.log(`Server running at port: ${port}`);
});
