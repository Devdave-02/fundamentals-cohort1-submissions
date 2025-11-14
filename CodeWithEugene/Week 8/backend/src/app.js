const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const requestContext = require('./middleware/requestContext');
const { requestLogger, errorLogger } = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');
const { register, metricsMiddleware, setAppVersion } = require('./metrics/metrics');
const packageJson = require('../package.json');

setAppVersion(packageJson.version);

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use(metricsMiddleware.requestCounters);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/api', routes);

app.get('/metrics', async (req, res, next) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Failed to scrape metrics: %s', error.message);
    next(error);
  }
});

app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
