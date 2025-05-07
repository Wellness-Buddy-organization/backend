const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
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
  mood: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'angry', 'anxious'],
    required: true,
  },
  stress: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);