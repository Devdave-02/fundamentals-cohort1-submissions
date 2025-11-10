const config = require('../config/config');

class Logger {
  static info(message, meta = {}) {
    if (config.env !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
    }
  }

  static error(message, error = {}) {
    if (config.env !== 'test') {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }
  }

  static warn(message, meta = {}) {
    if (config.env !== 'test') {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
    }
  }

  static debug(message, meta = {}) {
    if (config.env === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
    }
  }
}

module.exports = Logger;
