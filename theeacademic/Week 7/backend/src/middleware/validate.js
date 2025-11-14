const { ZodError } = require('zod');

const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      next(err);
    } else {
      next(new Error('Validation failed'));
    }
  }
};

module.exports = { validate };
