const Meal = require('../models/Meal');
const User = require('../models/User');

// @desc    Create a new meal for a user
// @route   POST /api/meals
exports.createMeal = async (req, res) => {
  try {
    const { user, name, foodItems } = req.body;

    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Server calculates total calories
    let totalCalories = 0;
    if (foodItems && foodItems.length > 0) {
      totalCalories = foodItems.reduce((acc, item) => acc + item.calories, 0);
    }

    const newMeal = new Meal({
      user,
      name,
      foodItems,
      totalCalories
    });

    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all meals for a specific user
// @route   GET /api/meals/user/:userId
exports.getMealsByUser = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.params.userId }).populate('user', 'username');
    if (!meals) {
      return res.status(404).json({ message: 'No meals found for this user' });
    }
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};