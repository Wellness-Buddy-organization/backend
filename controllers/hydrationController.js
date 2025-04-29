const Hydration = require('../models/Hydration');

exports.logHydration = async (req, res) => {
  try {
    const { glasses } = req.body;
    const hydrationEntry = new Hydration({
      userId: req.user._id,
      glasses,
      date: new Date()
    });
    
    await hydrationEntry.save();
    res.status(201).json(hydrationEntry);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging hydration',
      error: error.message 
    });
  }
};

exports.getHydrationHistory = async (req, res) => {
  try {
    const history = await Hydration.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(history);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching hydration history',
      error: error.message 
    });
  }
};
