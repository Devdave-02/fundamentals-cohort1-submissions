const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Create a new activity for a user
// @route   POST /api/activities
exports.createActivity = async (req, res) => {
  try {
    const { user, type, duration, caloriesBurned } = req.body;

    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newActivity = new Activity({
      user,
      type,
      duration,
      caloriesBurned
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all activities for a specific user
// @route   GET /api/activities/user/:userId
exports.getActivitiesByUser = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.params.userId }).populate('user', 'username');
    if (!activities) {
      return res.status(404).json({ message: 'No activities found for this user' });
    }
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};