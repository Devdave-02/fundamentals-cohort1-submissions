const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, default: 'Weekly Health Report' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // References to the data *within* this report's timeframe
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
  meals: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  
  // A generated summary
  summary: {
    averageDailyCalories: Number,
    totalCaloriesBurned: Number,
    notes: String // e.g., "Great work on activity, watch calorie intake."
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);