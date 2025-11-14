const jwt = require('jsonwebtoken');
// This MUST be the same secret as in auth.service.js
const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

const checkAuth = (req, res, next) => {
  try {
    // Expect "Bearer TOKEN_STRING"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Auth failed: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Get token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Auth failed: Malformed token' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Attach user info to the request object for use in controllers
    req.userData = { 
      userId: decodedToken.id, 
      username: decodedToken.username 
    };
    
    // Pass to the next middleware/controller
    next();

  } catch (error) {
    // This catches invalid/expired tokens
    return res.status(401).json({ message: 'Auth failed: Invalid token' });
  }
};

module.exports = checkAuth;