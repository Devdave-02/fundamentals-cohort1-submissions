const env = require('./config/env');
const app = require('./app');
const logger = require('./config/logger');

const server = app.listen(env.PORT, () => {
  logger.info(`FlowServe API listening on http://localhost:${env.PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
