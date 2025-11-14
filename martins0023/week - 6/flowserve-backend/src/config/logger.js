import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configure Pino logger
export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  // Pretty print logs in development for readability
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});
