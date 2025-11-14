const expressWinston = require('express-winston');
const logger = require('../config/logger');

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  colorize: false,
  expressFormat: false,
  ignoreRoute: () => false,
  dynamicMeta: (req, res) => ({
    requestId: req.requestId,
    statusCode: res.statusCode
  })
});

const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  dynamicMeta: (req) => ({
    requestId: req?.requestId
  })
});

module.exports = {
  requestLogger,
  errorLogger
};
