import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  // Log the error
  logger.error(err, `[${req.method}] ${req.path} - Error: ${message}`);

  // --- Handle Specific Error Types ---

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400; // Bad Request
    
    // --- THIS IS THE FIX ---
    // Use .issues, not .errors, for Zod v3+
    message = err.issues.map((e) => `${e.path.join('.') || 'error'}: ${e.message}`).join(', ');
  }

  // Handle Prisma unique constraint violation
  if (err.code === 'P2002') {
    statusCode = 409; // Conflict
    message = `Duplicate field error: ${err.meta?.target?.join(', ')} already exists.`;
  }

  // Handle Prisma record not found
  if (err.code === 'P2025') {
    statusCode = 404; // Not Found
    message = err.meta?.cause || 'Record not found.';
  }

  // Handle custom ApiErrors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send the final error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};