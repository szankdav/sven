import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
import LokiTransport from 'winston-loki';
import dayjs from 'dayjs';

const { combine, printf, label, json } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.resolve(__dirname, '../logs');

const errorFilter = winston.format((info) => info.level === 'error' ? info : false);
const infoFilter = winston.format((info) => info.level === 'info' ? info : false);

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

const baseFormat = combine(
  label({ label: 'sven' }),
  shiftTimestamp(),
  jsonFormat
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: baseFormat,
  transports: [
    ...(process.env.DISABLE_LOKI) ? [] : [
      new LokiTransport({
        host: 'http://loki:3100',
        labels: { app: 'sven' },
        json: true,
        format: combine(baseFormat),
        replaceTimestamp: true,
        onConnectionError: (err) => logger.error('Loki error: ', err),
      })],
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: baseFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-error-%DATE%.log'),
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(errorFilter(), baseFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, 'app-info-%DATE%.log'),
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: combine(infoFilter(), baseFormat),
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
