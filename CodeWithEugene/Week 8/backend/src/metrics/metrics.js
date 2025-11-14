const client = require('prom-client');

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration histogram of HTTP responses in seconds',
  labelNames: ['method', 'route', 'code']
});

const httpRequestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

const httpErrorsCounter = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP responses that resulted in errors',
  labelNames: ['method', 'route', 'code']
});

const uptimeGauge = new client.Gauge({
  name: 'app_uptime_seconds',
  help: 'Current uptime of the application in seconds'
});

const appInfoGauge = new client.Gauge({
  name: 'app_info',
  help: 'Static info about the app',
  labelNames: ['version']
});

register.registerMetric(httpRequestDurationHistogram);
register.registerMetric(httpRequestsCounter);
register.registerMetric(httpErrorsCounter);
register.registerMetric(uptimeGauge);
register.registerMetric(appInfoGauge);

const updateUptime = () => {
  uptimeGauge.set(process.uptime());
};

setInterval(updateUptime, 5000).unref();
updateUptime();

const buildRouteLabel = (req) => {
  if (req.route && req.route.path) {
    return `${req.baseUrl}${req.route.path}`;
  }
  return req.originalUrl || req.url;
};

const metricsMiddleware = {
  requestCounters: (req, res, next) => {
    const endTimer = httpRequestDurationHistogram.startTimer();
    res.on('finish', () => {
      const route = buildRouteLabel(req);
      const labels = { method: req.method, route, code: res.statusCode };
      httpRequestsCounter.inc(labels);
      endTimer(labels);
      if (res.statusCode >= 500) {
        httpErrorsCounter.inc(labels);
      }
    });
    next();
  }
};

const setAppVersion = (version) => {
  if (!version) {
    return;
  }
  appInfoGauge.set({ version }, 1);
};

module.exports = {
  register,
  metricsMiddleware,
  setAppVersion
};
