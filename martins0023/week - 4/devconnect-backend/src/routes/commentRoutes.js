const express = require('express');
const { getCommentsForProject, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');
const router = express.Router();

router.get('/project/:projectId', getCommentsForProject);
router.post('/', protect, validateComment, addComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;