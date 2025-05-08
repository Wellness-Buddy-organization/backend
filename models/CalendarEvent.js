// models/CalendarEvent.js

const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'wellness', 'health'],
    default: 'personal'
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index on userId and startDate for efficient querying
calendarEventSchema.index({ userId: 1, startDate: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);