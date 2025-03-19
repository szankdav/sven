import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";

const { combine, timestamp, json } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.resolve(__dirname, "../logs");

const errorFilter = winston.format((info) => {
  return info.level === "error" ? info : false;
});

const warnFilter = winston.format((info) => {
  return info.level === "warn" ? info : false;
});

const infoFilter = winston.format((info) => {
  return info.level === "info" ? info : false;
});

const httpFilter = winston.format((info) => {
  return info.level === "http" ? info : false;
});
const verboseFilter = winston.format((info) => {
  return info.level === "verbose" ? info : false;
});

const debugFilter = winston.format((info) => {
  return info.level === "debug" ? info : false;
});
const sillyFilter = winston.format((info) => {
  return info.level === "silly" ? info : false;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL_DEV || "silly",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.label({ label: "sven" }),
  ),
  transports: [
    // new LokiTransport({
    //     host: "http://loki:3100",
    //     labels: { app: 'sven' },
    //     json: true,
    //     format: winston.format.json(),
    //     replaceTimestamp: true,
    //     onConnectionError: (err) => console.error(err),
    // }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-warn-%DATE%.log"),
      level: "warn",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(warnFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-info-%DATE%.log"),
      level: "info",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(infoFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-http-%DATE%.log"),
      level: "http",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(httpFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-verbose-%DATE%.log"),
      level: "verbose",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(verboseFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-debug-%DATE%.log"),
      level: "debug",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(debugFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDirectory, "app-silly-%DATE%.log"),
      level: "silly",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(sillyFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDirectory, "exception.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDirectory, "rejection.log"),
    }),
  ],
});
