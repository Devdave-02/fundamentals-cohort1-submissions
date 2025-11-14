const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates the relationship
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Walking']
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  caloriesBurned: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;