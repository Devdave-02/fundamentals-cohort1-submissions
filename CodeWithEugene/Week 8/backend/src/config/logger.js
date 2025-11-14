const { createLogger, format, transports } = require('winston');

const loggingLevel = process.env.LOG_LEVEL || 'info';

const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.splat()
);

const consoleFormat =
  process.env.NODE_ENV === 'production'
    ? format.combine(baseFormat, format.json())
    : format.combine(
        baseFormat,
        format.colorize({ all: true }),
        format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const base = `${timestamp} [${level}] ${message}`;
          const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
          return stack ? `${base}\n${stack}${metaString}` : `${base}${metaString}`;
        })
      );

const logger = createLogger({
  level: loggingLevel,
  defaultMeta: { service: 'deployhub-backend' },
  transports: [
    new transports.Console({
      level: loggingLevel,
      format: consoleFormat
    })
  ]
});

module.exports = logger;
