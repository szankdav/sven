import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
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
import { loginAttemptHandler } from './logger/handlers/loginAttempt.handler.js';
import { searchHandler } from './logger/handlers/search.handler.js';
import { loginHandler } from './logger/handlers/login.handler.js';
import { discordAuthHandler } from './logger/handlers/discordAuth.handler.js';
import { statustHandler } from './logger/handlers/status.handler.js';

// Start bots
startSven();
startFaendal();

// Set filepaths
const __dirname = import.meta.dirname;
const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'logger/view'));
app.use(express.json());
const port = Number(process.env.PORT) || 3000;

// Create the database
try {
  await createTables(db);
} catch (error) {
  logger.error('Error creating tables:', error);
}

// Protected routes
app.get('/', discordAuthHandler, homeHandler);
app.get('/authors/:page', discordAuthHandler, authorsHandler);
app.get('/messages/:page', discordAuthHandler, messagesHandler);
app.get('/messages/author/:id', discordAuthHandler, messagesByAuthorsHandler);
app.get('/statistics/author/:id', discordAuthHandler, statisticsByAuthorHandler);
app.post('/search', discordAuthHandler, searchHandler);

// Public routes
app.post('/logMessage', messageLoggerHandler);
app.get('/login', loginHandler);
app.post('/login', loginAttemptHandler);
app.get('/status', statustHandler);

app.use(express.static(path.join(__dirname, './logger/public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(errorHandler);

app.listen(port, () => {
  /* eslint no-console: ["error", { allow: ["log"] }] */
  console.log(`Server running at port: ${port}`);
});
