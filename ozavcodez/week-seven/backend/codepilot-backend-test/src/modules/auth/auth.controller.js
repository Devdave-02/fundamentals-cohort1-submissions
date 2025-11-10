const authService = require('./auth.service');
const asyncHandler = require('../../middleware/asyncHandler');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const result = await authService.register(email, password, name);

  res.status(201).json({
    success: true,
    data: result
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = authService.getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  register,
  login,
  getCurrentUser
};
