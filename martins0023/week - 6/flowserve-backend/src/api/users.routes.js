import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createUserSchema,
  getUserSchema,
  getUsersSchema,
} from '../schemas/user.schema.js';

const router = Router();

// --- User Routes ---

// POST /api/v1/users
// Create a new user
router.post(
  '/',
  validate(createUserSchema),
  userController.createUser
);

// GET /api/v1/users
// Get all users with pagination
router.get(
  '/',
  validate(getUsersSchema),
  userController.getUsers
);

// GET /api/v1/users/:id
// Get a single user by their ID
router.get(
  '/:id',
  validate(getUserSchema),
  userController.getUserById
);

export default router;
