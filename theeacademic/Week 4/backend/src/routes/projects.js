const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/', projectController.list);
router.post('/', auth, [body('title').notEmpty()], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return projectController.create(req, res, next);
});
router.get('/:id', projectController.get);

module.exports = router;
