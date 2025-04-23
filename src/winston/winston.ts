import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
import LokiTransport from 'winston-loki';
import dayjs from 'dayjs';

const { combine, printf, label } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.resolve(__dirname, '../logs');

const errorFilter = winston.format((info) => info.level === 'error' ? info : false);
const infoFilter = winston.format((info) => info.level === 'info' ? info : false);
const critFilter = winston.format((info) => info.level === 'crit' ? info : false);

const shiftTimestamp = winston.format((info) => {
  const timestamp = dayjs().add(2, 'hour').toISOString();
  return { ...info, timestamp };
});

const jsonFormat = printf(({ timestamp: time, level, message, label: appLabel, ...meta }) =>
  JSON.stringify({
    label: appLabel,
    timestamp: time,
    level,
    message,
    ...meta,
  })
);

const fileFormat = combine(
  label({ label: 'sven' }),
  shiftTimestamp(),
  jsonFormat
);

const lokiFormat = combine(
  label({ label: 'sven' }),
  winston.format.json()
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
  level: process.env.LOG_LEVEL || 'info',
  format: jsonFormat,
  transports: [
    ...(process.env.DISABLE_LOKI) ? [] : [
      new LokiTransport({
        host: 'http://loki:3100',
        labels: { app: 'sven' },
        json: true,
        format: lokiFormat,
        replaceTimestamp: true,
        onConnectionError: (err) => logger.error('Loki error: ', err),
      })],
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: fileFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-error-%DATE%.log'),
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(errorFilter(), jsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-crit-%DATE%.log'),
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(critFilter(), jsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-info-%DATE%.log'),
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(infoFilter(), fileFormat),
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