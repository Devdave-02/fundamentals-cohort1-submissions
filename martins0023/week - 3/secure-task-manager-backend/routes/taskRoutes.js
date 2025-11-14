const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getTasks, createTask, deleteTask, searchTasks, filterTasks } = require('../controllers/taskController');

// All routes here are protected
router.use(protect);

router.route('/')
    .get(authorize('user', 'admin'), getTasks)
    .post(authorize('user', 'admin'), createTask);

router.route('/search')
    .post(authorize('user', 'admin'), searchTasks);
    
router.route('/filter')
    .post(authorize('user', 'admin'), filterTasks);

router.route('/:id')
    .delete(authorize('admin'), deleteTask); // Only admins can delete

module.exports = router;