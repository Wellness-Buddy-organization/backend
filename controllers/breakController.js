// controllers/breakController.js
const Break = require('../models/Break');

// Log a new break
exports.logBreak = async (req, res) => {
  try {
    const { duration, type } = req.body;
    const breakEntry = new Break({
      userId: req.user._id,
      duration,
      type: type || 'short',
      date: new Date()
    });
    await breakEntry.save();
    res.status(201).json(breakEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error logging break', error: error.message });
  }
};

// Get break history (e.g., last 30 breaks)
exports.getBreakHistory = async (req, res) => {
  try {
    const breaks = await Break.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json(breaks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching break history', error: error.message });
  }
};
