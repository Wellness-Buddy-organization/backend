const Work = require('../models/Work');

exports.logWork = async (req, res) => {
  try {
    const { hours, tasksCompleted } = req.body;
    const workEntry = new Work({
      userId: req.user._id,
      hours,
      tasksCompleted: tasksCompleted || 0,
      date: new Date()
    });
    
    await workEntry.save();
    res.status(201).json(workEntry);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging work hours',
      error: error.message 
    });
  }
};

exports.getWorkHistory = async (req, res) => {
  try {
    const history = await Work.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json(history);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching work history',
      error: error.message 
    });
  }
};
