const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('./auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
