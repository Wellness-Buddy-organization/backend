const Mood = require('../models/Mood');

exports.createMood = async (req, res) => {
  try {
    const { mood, notes, stress } = req.body;
    const entry = new Mood({ 
      userId: req.user._id,
      mood,
      notes,
      stress: stress || 3,
      date: new Date()
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new function to get mood history
exports.getMoodHistory = async (req, res) => {
  try {
    const history = await Mood.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(history);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching mood history',
      error: error.message 
    });
  }
};
