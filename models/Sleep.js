const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
  },
  quality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Sleep', sleepSchema);