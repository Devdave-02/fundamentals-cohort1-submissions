const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().uuid()
});

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional()
});

const listUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  search: z.string().optional()
});

module.exports = {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  listUsersQuerySchema
};
