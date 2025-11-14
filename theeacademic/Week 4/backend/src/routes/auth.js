const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return register(req, res, next);
});

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return login(req, res, next);
});

router.get('/me', auth, me);

module.exports = router;
