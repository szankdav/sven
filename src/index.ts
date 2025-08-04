import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import { startSven } from './bot/client/sven.js';
import { createTables } from './logger/database/tables.js';
import { db } from './logger/database/database.js';
import { errorHandler } from './logger/handlers/error.handler.js';
import { homeHandler } from './logger/handlers/home.handler.js';
import { authorsHandler } from './logger/handlers/authors.handler.js';
import {
  messagesHandler,
  messagesByAuthorsHandler,
  messageHandler,
} from './logger/handlers/messages.handler.js';
import { statisticsByAuthorHandler } from './logger/handlers/statistics.handler.js';
import { messageLoggerHandler } from './logger/handlers/messageLogger.handler.js';
import { logger } from './winston/winston.js';
import { startFaendal } from './bot/client/faendal.js';
import { loginAttemptHandler } from './logger/handlers/loginAttempt.handler.js';
import { searchHandler } from './logger/handlers/search.handler.js';
import { loginHandler } from './logger/handlers/login.handler.js';
import { discordAuthGuardHandler } from './logger/handlers/discordAuth.handler.js';
import { authUser } from './logger/handlers/authUser.handler.js';
import { userDataHandler } from './logger/handlers/user.handler.js';
import { loginErrorHandler } from './logger/handlers/loginError.handler.js';
import { indexHandler } from './logger/handlers/index.handler.js';
import { logoutHandler } from './logger/handlers/logout.handler.js';
import { getHWSWNews } from './bot/services/api/hwsw.service.js';
import { publishHandler } from './logger/handlers/publish.handler.js';
import { selectArticlesAndNewsHandler } from './logger/handlers/selectArticlesAndNews.handler.js';
import { cancelArticlesAndNewsHandler } from './logger/handlers/cancelArticlesAndNewsHandler.js';

// Start bots
startSven();
startFaendal();
getHWSWNews();

// Set filepaths
const __dirname = import.meta.dirname;
const app = express();
const authRouter = express.Router({ mergeParams: true });
const openRouter = express.Router({ mergeParams: true });
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'logger/view'));
app.use(express.json());
const port = Number(process.env.PORT) || 3000;

// Create the database
try {
  await createTables(db);
} catch (error) {
  logger.error('Error creating tables:', error);
}

// Public routes
openRouter.get('/', indexHandler);
openRouter.post('/api/logMessage', messageLoggerHandler);
openRouter.get('/login', loginHandler);
openRouter.post('/api/login', loginAttemptHandler);
openRouter.get('/api/authUser', authUser);
openRouter.get('/error', loginErrorHandler);

authRouter.use(discordAuthGuardHandler);
// Protected routes
authRouter.get('/home', homeHandler);
authRouter.get('/authors/:page', authorsHandler);
authRouter.get('/messages/:page', messagesHandler);
authRouter.get('/messages/author/:id', messagesByAuthorsHandler);
authRouter.get('/statistics/author/:id', statisticsByAuthorHandler);
authRouter.post('/search', searchHandler);
authRouter.get('/api/userdata', userDataHandler);
authRouter.post('/api/message', messageHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/publish', publishHandler);
authRouter.post('/api/select', selectArticlesAndNewsHandler);
authRouter.post('/api/cancel', cancelArticlesAndNewsHandler);
// authRouter.get('/api/useravatar', userAvatarHandler);

app.use(express.static(path.join(__dirname, './logger/public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(openRouter);
app.use(authRouter);
app.use(errorHandler);

app.listen(port, () => {
  /* eslint no-console: ["error", { allow: ["log"] }] */
  console.log(`Server running at port: ${port}`);
});
