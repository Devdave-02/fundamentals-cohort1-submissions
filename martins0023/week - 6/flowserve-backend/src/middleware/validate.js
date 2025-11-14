import { ZodError } from 'zod';

/**
 * Creates a middleware function to validate request data (body, query, params)
 * against a provided Zod schema.
 *
 * @param {z.Schema} schema - The Zod schema to validate against.
 * @returns {Function} Express middleware function.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Parse and validate the request data
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // If validation succeeds, move to the next middleware/controller
    next();
  } catch (error) {
    // If validation fails, pass the ZodError to the global error handler
    if (error instanceof ZodError) {
      next(error);
    } else {
      // Pass other unexpected errors
      next(new Error('An unexpected error occurred during validation'));
    }
  }
};
