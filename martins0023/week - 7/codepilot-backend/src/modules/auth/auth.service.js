const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Mock Database ---
// In a real app, this would be a database (e.g., PostgreSQL, MongoDB)
const MOCK_DB = {
  users: [],
};
// --- ---

// A (bad) secret key. In production, this MUST be from env variables.
const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

const registerUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Check if user already exists
  const existingUser = MOCK_DB.users.find((u) => u.username === username);
  if (existingUser) {
    throw new Error('Username already taken');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the user
  const newUser = {
    id: MOCK_DB.users.length + 1,
    username: username,
    password: hashedPassword, // Store the hashed password
  };
  MOCK_DB.users.push(newUser);

  // Return the new user (without the password)
  return { id: newUser.id, username: newUser.username };
};

const loginUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Find user
  const user = MOCK_DB.users.find((u) => u.username === username);
  if (!user) {
    throw new Error('Invalid credentials'); // User not found
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials'); // Wrong password
  }

  // Create JWT Token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  return { token };
};

// Helper for tests to clean the mock DB
const __cleanupMockDb = () => {
  MOCK_DB.users = [];
};

module.exports = {
  registerUser,
  loginUser,
  MOCK_DB, // Exporting for test inspection
  __cleanupMockDb, // Exporting for test setup
};