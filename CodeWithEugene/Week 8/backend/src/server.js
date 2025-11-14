const http = require('node:http');
const app = require('./app');
const logger = require('./config/logger');

const port = Number(process.env.PORT) || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  logger.info('DeployHub backend listening on port %d', port, {
    environment: process.env.NODE_ENV || 'development'
  });
});

const shutdown = (signal) => {
  logger.warn('%s received. Closing server gracefully.', signal);
  server.close((closeError) => {
    if (closeError) {
      logger.error('Error closing server: %s', closeError.message);
      process.exitCode = 1;
    }
    logger.info('Server closed. Bye!');
    process.exit();
  });

  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10000).unref();
};

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection: %o', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception: %s', error.message, { stack: error.stack });
  shutdown('uncaughtException');
});
