const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // Set TTL index to automatically remove expired tokens from DB
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', // Matches refresh token expiration
  },
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
module.exports = TokenBlacklist;