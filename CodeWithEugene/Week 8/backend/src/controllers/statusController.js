const packageJson = require('../../package.json');

const getStatus = (req, res) => {
  res.json({
    status: 'ok',
    service: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    releasedAt: process.env.RELEASED_AT || null,
    commit: process.env.GIT_SHA || null,
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  getStatus
};
