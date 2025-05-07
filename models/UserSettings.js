const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  animationsEnabled: {
    type: Boolean,
    default: true,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);