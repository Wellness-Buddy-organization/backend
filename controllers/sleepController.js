const Sleep = require('../models/Sleep');

exports.logSleep = async (req, res) => {
  try {
    const { hours, quality } = req.body;
    const sleepEntry = new Sleep({
      userId: req.user._id,
      hours,
      quality,
      date: new Date()
    });
    
    await sleepEntry.save();
    res.status(201).json(sleepEntry);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging sleep',
      error: error.message 
    });
  }
};

exports.getSleepHistory = async (req, res) => {
  try {
    const history = await Sleep.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(14);
    res.json(history);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching sleep history',
      error: error.message 
    });
  }
};
