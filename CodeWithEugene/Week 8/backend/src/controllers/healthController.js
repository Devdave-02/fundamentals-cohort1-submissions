const os = require('node:os');
const packageJson = require('../../package.json');
const { register } = require('../metrics/metrics');

const buildHealthPayload = async () => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  const metrics = await register.getMetricsAsJSON();

  return {
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    environment: process.env.NODE_ENV || 'development',
    host: {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release()
    },
    resources: {
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed
      },
      cpuLoad: os.loadavg()
    },
    metrics
  };
};

const getHealth = async (req, res) => {
  const payload = await buildHealthPayload();
  res.json(payload);
};

module.exports = {
  getHealth
};
