const authService = require('./auth.service');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.registerUser(username, password);
    res.status(201).json(user); // 201 Created
  } catch (error) {
    // Handle specific errors from the service
    if (error.message === 'Username and password are required') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'Username already taken') {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
    // General error
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token } = await authService.loginUser(username, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message.includes('required')) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  register,
  login,
};