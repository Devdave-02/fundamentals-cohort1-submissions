const app = require('./app');
const config = require('./config/config');
const Logger = require('./utils/logger');

const PORT = config.port;

const server = app.listen(PORT, () => {
  Logger.info(`Server running in ${config.env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = server;
