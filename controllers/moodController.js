const Mood = require('../models/Mood');

// Properly exported function
exports.createMood = async (req, res) => {
  try {
    const { mood, notes } = req.body;
    const entry = new Mood({ 
      userId: req.user._id,
      mood,
      notes,
      date: new Date()
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
