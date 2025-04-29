const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  users: { type: Number, default: 0 },
  programs: { type: Number, default: 0 },
  reminders: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stat', statSchema);