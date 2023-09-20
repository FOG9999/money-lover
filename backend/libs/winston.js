const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { format } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ message, timestamp }) => {
  return `${timestamp}: ${message}`;
});

const winstonLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new DailyRotateFile({
        level: 'error',
        dirname: 'logs/errors',
        filename: `%DATE%.log`,
        datePattern: 'YYYY-MM-DD'
    }),
    new DailyRotateFile({
        level: 'http',
        dirname: 'logs/combined',
        filename: `%DATE%.log`,
        datePattern: 'YYYY-MM-DD'
    }),
    new winston.transports.Console()
  ],
});

module.exports = winstonLogger;