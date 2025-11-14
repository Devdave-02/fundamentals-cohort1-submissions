/**
 * Custom class for a consistent API success response.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 200, 201)
   * @param {any} data - The data payload to be sent (e.g., user object, list of users)
   * @param {string} message - A clear, user-friendly success message
   * @param {object} [meta] - Optional metadata (e.g., for pagination)
   */
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success is true if statusCode is 2xx or 3xx
    if (meta) {
      this.meta = meta;
    }
  }
}

export { ApiResponse };
