const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const env = require('./config/env');
const apiLimiter = require('./config/rateLimit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
