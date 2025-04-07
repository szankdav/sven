import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
import LokiTransport from 'winston-loki';

const { combine, timestamp } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.resolve(__dirname, '../logs');

const errorFilter = winston.format((info) => info.level === 'error' ? info : false);
const infoFilter = winston.format((info) => info.level === 'info' ? info : false);

const orderedJsonFormat = winston.format.printf(({ timestamp: logTimestamp, level, message, label, ...meta }) => JSON.stringify({
    label,
    timestamp: logTimestamp,
    level,
    message,
    ...meta,
  }));

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(winston.format.label({ label: 'sven' }), timestamp()),
  transports: [
    ...(process.env.DISABLE_LOKI) ? [] : [
      new LokiTransport({
        host: 'http://loki:3100',
        labels: { app: 'sven' },
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => logger.error('Loki error: ', err),
      })],
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(orderedJsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-error-%DATE%.log'),
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(errorFilter(), orderedJsonFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-info-%DATE%.log'),
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(infoFilter(), orderedJsonFormat),
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
