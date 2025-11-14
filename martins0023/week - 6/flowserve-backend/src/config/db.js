import { PrismaClient } from '@prisma/client';

// Instantiate PrismaClient
// This creates a connection pool and manages database connections.
// By exporting it from a single file, we ensure a singleton instance is used.
export const prisma = new PrismaClient({
  // Log database queries for debugging in development
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
