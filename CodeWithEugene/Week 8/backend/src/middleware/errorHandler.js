const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.publicMessage || 'Internal server error',
    traceId: req.requestId || req.headers['x-request-id'] || null
  };

  logger.error('Unhandled error: %s', err.message, {
    statusCode,
    stack: err.stack
  });

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
