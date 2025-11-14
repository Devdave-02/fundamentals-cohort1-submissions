/**
 * A higher-order function that wraps async route handlers to
 * catch errors and pass them to the global error handler (next(error)).
 * This avoids repetitive try-catch blocks in every controller.
 *
 * @param {Function} fn - The async controller/handler function to wrap.
 * @returns {Function} A new function that executes the original function
 * and catches any rejected promises.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
