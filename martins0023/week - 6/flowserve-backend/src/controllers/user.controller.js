import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Public
 */
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createNewUser(req.body);
  res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
});

/**
 * @desc    Get all users with pagination
 * @route   GET /api/v1/users?page=1&limit=10
 * @access  Public
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { data, meta } = await userService.findUsers(Number(page), Number(limit));
  
  res.status(200).json(new ApiResponse(200, data, 'Users fetched successfully', meta));
});

/**
 * @desc    Get a single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.findUserById(id);
  
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});
