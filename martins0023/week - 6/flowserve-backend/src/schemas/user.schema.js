import { z } from 'zod';

// Schema for creating a new user
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

// Schema for getting users (pagination)
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number).pipe(z.number().int().min(1)),
    limit: z.string().optional().transform(Number).pipe(z.number().int().min(1)),
  }).optional(),
});

// Schema for getting a single user by ID
export const getUserSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID format'), // CUID is Prisma's default
  }),
});
