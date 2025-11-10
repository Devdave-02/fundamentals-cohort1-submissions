const Logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  Logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl
  });

  // Operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Programming or unknown errors
  return res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

module.exports = errorHandler;
