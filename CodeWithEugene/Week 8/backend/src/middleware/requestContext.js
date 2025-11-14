const { randomUUID } = require('node:crypto');

const requestContext = (req, res, next) => {
  const incomingId =
    req.headers['x-request-id'] || req.headers['x-correlation-id'] || randomUUID();

  req.requestId = incomingId;
  res.setHeader('x-request-id', incomingId);

  next();
};

module.exports = requestContext;
