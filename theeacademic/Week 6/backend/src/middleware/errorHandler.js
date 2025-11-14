const { ZodError } = require('zod');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = 500;
  let message = 'Internal Server Error';
  let details = undefined;

  if (err instanceof ApiError) {
    status = err.statusCode || 500;
    message = err.message || message;
    details = err.errors;
  } else if (err instanceof ZodError) {
    status = 400;
    message = 'Validation error';
    details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (err.name === 'NotFoundError') {
    status = 404;
    message = err.message || 'Resource not found';
  } else if (err.statusCode && err.message) {
    status = err.statusCode;
    message = err.message;
  }

  logger.error({ err, status }, 'Request error');
  res.status(status).json({ success: false, message, details });
}

module.exports = errorHandler;
