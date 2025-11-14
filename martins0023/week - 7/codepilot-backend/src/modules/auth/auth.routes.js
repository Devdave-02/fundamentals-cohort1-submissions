const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');

// POST /api/v1/auth/register
router.post('/register', controller.register);

// POST /api/v1/auth/login
router.post('/login', controller.login);

module.exports = router;