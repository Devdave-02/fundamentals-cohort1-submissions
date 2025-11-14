const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  reportType: {
    type: String,
    required: [true, 'Report type is required'],
    enum: ['lab_test', 'diagnosis', 'prescription', 'scan', 'other']
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Report description is required'],
    trim: true
  },
  findings: {
    type: String,
    trim: true
  },
  recommendations: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
reportSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Report', reportSchema);
