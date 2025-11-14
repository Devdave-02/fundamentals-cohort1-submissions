const express = require('express');
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');
const router = express.Router();

router.route('/').get(getAllProjects).post(protect, validateProject, createProject);
router.route('/:id').get(getProjectById).put(protect, validateProject, updateProject).delete(protect, deleteProject);

module.exports = router;