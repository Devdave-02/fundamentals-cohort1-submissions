const express = require('express');
const { body, validationResult } = require('express-validator');
const userService = require('../services/userService');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  try {
    const profile = userService.getUserProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/profile', authenticate, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const profile = userService.updateUserProfile(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
