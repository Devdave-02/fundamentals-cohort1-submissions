const express = require('express');
const router = express.Router();
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getUserActivityStats
} = require('../controllers/activityController');

// Activity routes
router.route('/')
  .get(getAllActivities)
  .post(createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);

router.route('/stats/:userId')
  .get(getUserActivityStats);

module.exports = router;
