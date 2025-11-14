/**
 * Custom error class for API errors.
 * Extends the built-in Error class to include a status code and
 * maintain a consistent error response structure.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} message - A clear, user-friendly error message
   */
  constructor(statusCode, message = 'Something went wrong') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
