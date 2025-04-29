const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
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
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Work', workSchema);