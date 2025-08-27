import winston from 'winston';
import { logConfig } from '@/config';

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';

const logsDir = path.dirname(logConfig.file);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: logConfig.level,
  format: logFormat,
  defaultMeta: { service: 'jobhub-api' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: logConfig.file.replace('.log', '-error.log'),
      level: 'error',
      maxsize: logConfig.maxSize,
      maxFiles: logConfig.maxFiles,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: logConfig.file,
      maxsize: logConfig.maxSize,
      maxFiles: logConfig.maxFiles,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: logConfig.file.replace('.log', '-exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: logConfig.file.replace('.log', '-rejections.log'),
    }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create a stream object for Morgan
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
