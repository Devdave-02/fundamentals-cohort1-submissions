const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  activityType: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'other']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0, 'Duration must be positive']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories must be positive']
  },
  distance: {
    type: Number,
    min: [0, 'Distance must be positive']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
activitySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);
