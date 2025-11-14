const express = require('express');
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const { validateRegistration, sanitizeString } = require('../utils/validation');
const User = require('../models/User');

const router = express.Router();
const SALT_ROUNDS = 10;
const MAX_FAILED = 3;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body || {};
  const { valid, errors } = validateRegistration({ username, email, password });
  if (!valid) return res.status(400).json({ errors });

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username: sanitizeString(username), email: sanitizeString(email), password: hashed, role: role === 'admin' ? 'admin' : 'user' });
    await user.save();
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'User or email already exists' });
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const user = await User.findOne({ username: sanitizeString(username) });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ error: 'Account locked. Try later.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED) {
        user.lockUntil = Date.now() + LOCK_TIME;
        user.failedLoginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // successful login: reset counters
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // store refresh token in user document
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // send refresh token as HttpOnly secure cookie (note: secure flag requires https)
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });

    return res.json({ accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  const token = req.cookies && req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = verifyRefreshToken(token);
    const userId = payload.sub;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    // ensure token is stored (not revoked)
    const found = user.refreshTokens.find(rt => rt.token === token);
    if (!found) return res.status(401).json({ error: 'Refresh token revoked' });

    // rotate: create new access token (do not issue new refresh token here)
    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    return res.json({ accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// Logout - revoke refresh token
router.post('/logout', async (req, res) => {
  const token = req.cookies && req.cookies.refreshToken;
  if (!token) return res.status(400).json({ ok: true });
  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
      await user.save();
    }
    res.clearCookie('refreshToken');
    return res.json({ ok: true });
  } catch (err) {
    // even if token invalid, clear cookie
    res.clearCookie('refreshToken');
    return res.json({ ok: true });
  }
});

module.exports = router;
