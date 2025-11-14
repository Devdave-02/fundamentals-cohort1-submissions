const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const foodItemSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  portionSize: { type: String, default: '1 serving' }
}, { _id: false });

const mealSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
  foodItems: [foodItemSchema],
  totalCalories: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save hook to calculate totalCalories
mealSchema.pre('save', function(next) {
  this.totalCalories = this.foodItems.reduce((acc, item) => acc + item.calories, 0);
  next();
});

module.exports = mongoose.model('Meal', mealSchema);