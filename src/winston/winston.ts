import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const { combine, timestamp, json } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.resolve(__dirname, '../logs');

const errorFilter = winston.format((info) => info.level === 'error' ? info : false);

const warnFilter = winston.format((info) => info.level === 'warn' ? info : false);

const infoFilter = winston.format((info) => info.level === 'info' ? info : false);

const debugFilter = winston.format((info) => info.level === 'debug' ? info : false);

const critFilter = winston.format((info) => info.level === 'crit' ? info : false);

const jsonFormat = combine(
  winston.format.label({ label: 'sven' }),
  timestamp(),
  winston.format.errors({ stack: true }),
  json()
);

const myCustomLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  },
  colors: {
    emerg: 'red',
    alert: 'yellow',
    crit: 'red',
    error: 'red',
    warning: 'yellow',
    notice: 'blue',
    info: 'blue',
    debug: 'green'
  }
};

export const logger = winston.createLogger({
  levels: myCustomLevels.levels,
  level: process.env.LOG_LEVEL_DEV || 'debug',
  format: jsonFormat,
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-error-%DATE%.log'),
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(errorFilter(), jsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-warn-%DATE%.log'),
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(warnFilter(), jsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-info-%DATE%.log'),
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(infoFilter(), jsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-debug-%DATE%.log'),
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(debugFilter(), jsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-crit-%DATE%.log'),
      level: 'crit',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(critFilter(), jsonFormat),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDirectory, 'exception.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDirectory, 'rejection.log'),
    }),
  ],
});